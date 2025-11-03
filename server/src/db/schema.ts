import {
  mysqlTable,
  int,
  varchar,
  datetime,
  timestamp,
  text,
  float,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const profiles = mysqlTable('profiles', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }),
  role: mysqlEnum('role', ['admin', 'driver', 'client']).default('client').notNull(),
  plan: varchar('plan', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export const missionStatus = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'] as const;
export const missionPriority = ['normal', 'urgent', 'express'] as const;

export const missions = mysqlTable('missions', {
  id: int('id').primaryKey().autoincrement(),
  clientId: int('client_id').notNull(),
  driverId: int('driver_id'),
  missionNumber: varchar('mission_number', { length: 100 }).notNull().unique(),
  departureAddress: varchar('departure_address', { length: 255 }).notNull(),
  departureCity: varchar('departure_city', { length: 255 }).notNull(),
  departurePostalCode: varchar('departure_postal_code', { length: 50 }).notNull(),
  arrivalAddress: varchar('arrival_address', { length: 255 }).notNull(),
  arrivalCity: varchar('arrival_city', { length: 255 }).notNull(),
  arrivalPostalCode: varchar('arrival_postal_code', { length: 50 }).notNull(),
  scheduledDate: datetime('scheduled_date').notNull(),
  scheduledTime: varchar('scheduled_time', { length: 50 }),
  actualStartTime: datetime('actual_start_time'),
  actualEndTime: datetime('actual_end_time'),
  distanceKm: float('distance_km'),
  price: float('price'),
  status: mysqlEnum('status', missionStatus).default('pending').notNull(),
  priority: mysqlEnum('priority', missionPriority).default('normal').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export const quoteStatus = ['new', 'quoted', 'converted', 'declined'] as const;

export const quotes = mysqlTable('quotes', {
  id: int('id').primaryKey().autoincrement(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 100 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  vehicleType: varchar('vehicle_type', { length: 100 }).notNull(),
  departureLocation: varchar('departure_location', { length: 255 }).notNull(),
  arrivalLocation: varchar('arrival_location', { length: 255 }).notNull(),
  preferredDate: datetime('preferred_date'),
  message: text('message'),
  status: mysqlEnum('status', quoteStatus).default('new').notNull(),
  estimatedPrice: float('estimated_price'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow()
    .notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Profile = InferSelectModel<typeof profiles>;
export type Mission = InferSelectModel<typeof missions>;
export type Quote = InferSelectModel<typeof quotes>;

export type NewUser = InferInsertModel<typeof users>;
export type NewProfile = InferInsertModel<typeof profiles>;
export type NewMission = InferInsertModel<typeof missions>;
export type NewQuote = InferInsertModel<typeof quotes>;
