import { eq } from 'drizzle-orm';
import { db, schema } from '../db';
import type { AuthSession } from '../types/api-types';

const { users, profiles } = schema;

export async function getSessionByUserId(userId: number): Promise<AuthSession | null> {
  const [result] = await db
    .select({
      userId: users.id,
      email: users.email,
      createdAt: users.createdAt,
      profileId: profiles.id,
      fullName: profiles.fullName,
      phone: profiles.phone,
      role: profiles.role,
      plan: profiles.plan,
      avatarUrl: profiles.avatarUrl,
      profileCreatedAt: profiles.createdAt,
      profileUpdatedAt: profiles.updatedAt,
    })
    .from(users)
    .innerJoin(profiles, eq(profiles.userId, users.id))
    .where(eq(users.id, userId))
    .limit(1)
    .execute();

  if (!result) {
    return null;
  }

  return {
    user: {
      id: result.userId,
      email: result.email,
      createdAt: result.createdAt instanceof Date ? result.createdAt.toISOString() : String(result.createdAt),
    },
    profile: {
      id: result.profileId,
      userId: result.userId,
      fullName: result.fullName,
      phone: result.phone ?? null,
      role: result.role,
      plan: result.plan ?? null,
      avatarUrl: result.avatarUrl ?? null,
      createdAt:
        result.profileCreatedAt instanceof Date
          ? result.profileCreatedAt.toISOString()
          : String(result.profileCreatedAt),
      updatedAt:
        result.profileUpdatedAt instanceof Date
          ? result.profileUpdatedAt.toISOString()
          : String(result.profileUpdatedAt),
    },
  };
}
