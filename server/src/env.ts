import { config } from 'dotenv';

config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sanitizePort = (value: number, fallback: number): number => {
  const n = Math.trunc(value);
  return n >= 1 && n <= 65535 ? n : fallback;
};

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = sanitizePort(numberFromEnv(process.env.PORT, 4000), 4000);
const DATABASE_URL = process.env.DATABASE_URL;
// En dev on tolère 'change-me'; en production on exige un secret fort
const JWT_SECRET = process.env.JWT_SECRET ?? (NODE_ENV === 'production' ? undefined : 'change-me');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? (NODE_ENV === 'production' ? 'https://jrdriving.galaxjr.digital' : undefined);
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? 'jrdriving_token';
const COOKIE_MAX_AGE = numberFromEnv(process.env.AUTH_COOKIE_MAX_AGE, 60 * 60 * 24 * 7) * 1000; // ms

export const env = Object.freeze({
  NODE_ENV,
  PORT,
  DATABASE_URL,
  JWT_SECRET: JWT_SECRET as string, // validé ci-dessous en production
  JWT_EXPIRES_IN,
  CORS_ORIGIN,
  COOKIE_NAME,
  COOKIE_MAX_AGE,
});

// Validation: échec fort en production
if (env.NODE_ENV === 'production') {
  if (!env.DATABASE_URL) {
    throw new Error('[env] DATABASE_URL est requis en production.');
  }
  if (!JWT_SECRET || JWT_SECRET === 'change-me') {
    throw new Error('[env] JWT_SECRET doit être défini avec une valeur forte en production.');
  }
}

// Avertissements en développement
if (!env.DATABASE_URL && env.NODE_ENV !== 'production') {
  console.warn('[env] DATABASE_URL n\'est pas défini. Le serveur API ne pourra pas se connecter à la base.');
}
