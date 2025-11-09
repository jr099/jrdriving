import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { env } from '../env';

export type JwtRole = 'admin' | 'driver' | 'client';

export interface AccessTokenPayload {
  userId: number;
  role: JwtRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as Secret, { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] });
}

export function verifyAccessToken(token: string): AccessTokenPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET as Secret) as unknown as AccessTokenPayload;
  } catch {
    return null;
  }
}
