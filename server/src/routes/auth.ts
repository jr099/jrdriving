import { Router } from 'express';
import type { OkPacket } from 'mysql2';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db, schema } from '../db';
import { env } from '../env';
import { signAccessToken, verifyAccessToken } from '../utils/jwt';
import { getSessionByUserId } from '../services/session';

const { users, profiles } = schema;

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

export default router;
