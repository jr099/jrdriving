import { Router } from 'express';
import type { OkPacket } from 'mysql2';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';
import { db, schema } from '../db';
import { env } from '../env';
import { signAccessToken, verifyAccessToken } from '../utils/jwt';
import { getSessionByUserId } from '../services/session';
import { notifyPasswordReset } from '../services/integrations';

const { users, profiles, passwordResetTokens } = schema;

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = credentialsSchema.extend({
  fullName: z.string().min(1),
  phone: z.string().min(4),
  role: z.enum(['client', 'driver']),
});

const router = Router();

function setAuthCookie(res: import('express').Response, token: string) {
  res.cookie(env.COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production' || env.AUTH_COOKIE_SAME_SITE === 'none',
    maxAge: env.COOKIE_MAX_AGE,
  });
}

router.post('/signup', async (req, res, next) => {
  try {
    const payload = signupSchema.parse(req.body);

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1)
      .execute();

    if (existing) {
      return res.status(409).json({ message: 'Un compte existe déjà pour cet email.' });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const userResult = await db
      .insert(users)
      .values({
        email: payload.email,
        passwordHash,
      })
      .execute();

    const userId = Number((userResult as unknown as OkPacket).insertId);

    await db
      .insert(profiles)
      .values({
        userId,
        fullName: payload.fullName,
        phone: payload.phone,
        role: payload.role,
        plan: 'free',
      })
      .execute();

    const session = await getSessionByUserId(userId);
    if (!session) {
      throw new Error('Impossible de créer la session utilisateur.');
    }

    const token = signAccessToken({ userId: session.user.id, role: session.profile.role });
    setAuthCookie(res, token);

    return res.status(201).json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const payload = credentialsSchema.parse(req.body);

    const [userRecord] = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1)
      .execute();

    if (!userRecord) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }

    const validPassword = await bcrypt.compare(payload.password, userRecord.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe invalide.' });
    }

    const session = await getSessionByUserId(userRecord.id);
    if (!session) {
      return res.status(401).json({ message: 'Profil utilisateur introuvable.' });
    }

    const token = signAccessToken({ userId: session.user.id, role: session.profile.role });
    setAuthCookie(res, token);

    return res.json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

router.get('/session', async (req, res) => {
  const token = req.cookies?.[env.COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: 'Non authentifié.' });
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({ message: 'Session invalide.' });
  }

  const session = await getSessionByUserId(payload.userId);
  if (!session) {
    return res.status(401).json({ message: 'Session expirée.' });
  }

  return res.json(session);
});

router.post('/logout', (req, res) => {
  res.clearCookie(env.COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production' || env.AUTH_COOKIE_SAME_SITE === 'none',
  });

  return res.status(204).send();
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(16),
  password: z.string().min(8),
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    const [userRecord] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();

    if (!userRecord) {
      return res.status(202).json({ message: 'Si un compte existe, un email de réinitialisation sera envoyé.' });
    }

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userRecord.id)).execute();

    const token = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

    await db
      .insert(passwordResetTokens)
      .values({
        userId: userRecord.id,
        tokenHash,
        expiresAt,
      })
      .execute();

    await notifyPasswordReset({
      email,
      resetToken: token,
      expiresAt: expiresAt.toISOString(),
    });

    console.info(`[auth] Lien de réinitialisation généré pour ${email}`);

    return res.status(202).json({ message: 'Si un compte existe, un email de réinitialisation sera envoyé.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const tokenHash = createHash('sha256').update(token).digest('hex');

    const [tokenRecord] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.tokenHash, tokenHash))
      .limit(1)
      .execute();

    if (!tokenRecord || tokenRecord.expiresAt <= new Date()) {
      return res.status(400).json({ message: 'Lien de réinitialisation invalide ou expiré.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.update(users).set({ passwordHash }).where(eq(users.id, tokenRecord.userId)).execute();
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, tokenRecord.userId)).execute();

    return res.status(200).json({ message: 'Mot de passe mis à jour.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

export default router;
