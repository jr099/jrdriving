import 'dotenv/config';
import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL doit être défini pour exécuter les migrations Drizzle.');
}

export default {
  schema: './server/src/db/schema.ts',
  out: './server/drizzle',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;
