import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/auth';
import { db, schema } from '../db';
import type { Mission } from '../db/schema';

const router = Router();
const { missions } = schema;

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

router.get('/me', authenticate, authorize('driver', 'admin'), async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.auth) {
      return res.status(401).json({ message: 'Non authentifié.' });
    }

    const driverProfileId = req.auth.profileId;

    const driverMissions = await db
      .select()
      .from(missions)
      .where(eq(missions.driverId, driverProfileId))
      .orderBy(desc(missions.scheduledDate))
      .execute();

    const stats = {
      totalMissions: driverMissions.length,
      inProgress: driverMissions.filter((mission) => mission.status === 'in_progress').length,
      completed: driverMissions.filter((mission) => mission.status === 'completed').length,
      totalKm: driverMissions.reduce((total, mission) => total + (mission.distanceKm ?? 0), 0),
    };

    return res.json({
      stats,
      missions: driverMissions.map(mapMission),
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
