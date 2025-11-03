import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/auth';
import { db, schema } from '../db';
import type { Mission, Quote } from '../db/schema';

const router = Router();
const { missions, profiles, quotes } = schema;

function mapMission(record: Mission) {
  return {
    id: record.id,
    clientId: record.clientId,
    driverId: record.driverId ?? null,
    missionNumber: record.missionNumber,
    departureAddress: record.departureAddress,
    departureCity: record.departureCity,
    departurePostalCode: record.departurePostalCode,
    arrivalAddress: record.arrivalAddress,
    arrivalCity: record.arrivalCity,
    arrivalPostalCode: record.arrivalPostalCode,
    scheduledDate: record.scheduledDate instanceof Date ? record.scheduledDate.toISOString() : String(record.scheduledDate),
    scheduledTime: record.scheduledTime ?? null,
    actualStartTime: record.actualStartTime ? record.actualStartTime.toISOString() : null,
    actualEndTime: record.actualEndTime ? record.actualEndTime.toISOString() : null,
    distanceKm: record.distanceKm ?? null,
    price: record.price ?? null,
    status: record.status,
    priority: record.priority,
    notes: record.notes ?? null,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
  };
}

function mapQuote(record: Quote) {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    companyName: record.companyName ?? null,
    vehicleType: record.vehicleType,
    departureLocation: record.departureLocation,
    arrivalLocation: record.arrivalLocation,
    preferredDate: record.preferredDate ? record.preferredDate.toISOString() : null,
    message: record.message ?? null,
    status: record.status,
    estimatedPrice: record.estimatedPrice ?? null,
    createdAt: record.createdAt instanceof Date ? record.createdAt.toISOString() : String(record.createdAt),
    updatedAt: record.updatedAt instanceof Date ? record.updatedAt.toISOString() : String(record.updatedAt),
  };
}

router.get(
  '/dashboard',
  authenticate,
  authorize('admin'),
  async (_req: AuthenticatedRequest, res, next) => {
    try {
      const allMissions = await db.select().from(missions).execute();
      const driverProfiles = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.role, 'driver'))
        .execute();
      const clientProfiles = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.role, 'client'))
        .execute();
      const pendingQuotes = await db
        .select()
        .from(quotes)
        .where(eq(quotes.status, 'new'))
        .execute();
      const recentMissions = await db
        .select()
        .from(missions)
        .orderBy(desc(missions.createdAt))
        .limit(5)
        .execute();

      const activeMissions = allMissions.filter((mission) => mission.status === 'in_progress' || mission.status === 'assigned');
      const revenue = allMissions
        .filter((mission) => mission.status === 'completed' && mission.price)
        .reduce((total, mission) => total + (mission.price ?? 0), 0);

      return res.json({
        stats: {
          totalMissions: allMissions.length,
          activeMissions: activeMissions.length,
          totalDrivers: driverProfiles.length,
          totalClients: clientProfiles.length,
          pendingQuotes: pendingQuotes.length,
          revenue,
        },
        recentMissions: recentMissions.map(mapMission),
        pendingQuotes: pendingQuotes.map(mapQuote),
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
