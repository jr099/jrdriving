import jwt from 'jsonwebtoken';
import { env } from '../env';

export type JwtRole = 'admin' | 'driver' | 'client';

export interface JwtPayload {
  userId: number;
  role: JwtRole;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
