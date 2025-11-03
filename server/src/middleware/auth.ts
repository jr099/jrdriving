import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';
import { verifyAccessToken, type JwtRole } from '../utils/jwt';
import { getSessionByUserId } from '../services/session';
import type { AuthSession } from '../types/api-types';

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: number;
    role: JwtRole;
    profileId: number;
    session: AuthSession;
  };
}

export async function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

  req.auth = {
    userId: session.user.id,
    role: session.profile.role,
    profileId: session.profile.id,
    session,
  };

  return next();
}

export function authorize(...roles: JwtRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    if (!roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Accès refusé.' });
    }

    return next();
  };
}
