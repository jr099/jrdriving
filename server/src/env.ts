import { config } from 'dotenv';

config();

const numberFromEnv = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: numberFromEnv(process.env.PORT, 4000),
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET ?? 'change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  COOKIE_NAME: process.env.AUTH_COOKIE_NAME ?? 'jrdriving_token',
  COOKIE_MAX_AGE: numberFromEnv(process.env.AUTH_COOKIE_MAX_AGE, 60 * 60 * 24 * 7) * 1000,
};

if (!env.DATABASE_URL) {
  console.warn('[env] DATABASE_URL is not defined. The API server will fail to connect to the database.');
}
