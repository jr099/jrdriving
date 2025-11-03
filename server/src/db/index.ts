import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from './schema';
import { env } from '../env';

if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be provided to connect to the database.');
}

const pool = mysql.createPool(env.DATABASE_URL);

export const db = drizzle(pool, { schema, mode: 'default' });
export type Database = typeof db;
export { schema };
