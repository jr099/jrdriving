import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/auth';
import { db, schema } from '../db';
import { notifyMissionStatusChange } from '../services/integrations';

const router = Router();
const { missions, profiles } = schema;

const statusSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
});

const mapMissionForTracking = (mission: typeof missions.$inferSelect, driverName?: string | null) => ({
  missionNumber: mission.missionNumber,
  status: mission.status,
  priority: mission.priority,
  departureCity: mission.departureCity,
  arrivalCity: mission.arrivalCity,
  scheduledDate: mission.scheduledDate instanceof Date ? mission.scheduledDate.toISOString() : String(mission.scheduledDate),
  updatedAt: mission.updatedAt instanceof Date ? mission.updatedAt.toISOString() : String(mission.updatedAt),
  driverName: driverName ?? null,
});

router.get('/track/:missionNumber', async (req, res, next) => {
  try {
    const missionNumber = req.params.missionNumber.trim();
    if (!missionNumber) {
      return res.status(400).json({ message: 'Numéro de mission requis.' });
    }

    const [mission] = await db
      .select()
      .from(missions)
      .where(eq(missions.missionNumber, missionNumber))
      .limit(1)
      .execute();

    if (!mission) {
      return res.status(404).json({ message: 'Mission introuvable.' });
    }

    let driverName: string | null = null;
    if (mission.driverId) {
      const [driverProfile] = await db
        .select({ fullName: profiles.fullName })
        .from(profiles)
        .where(eq(profiles.id, mission.driverId))
        .limit(1)
        .execute();

      driverName = driverProfile?.fullName ?? null;
    }

    return res.json({ mission: mapMissionForTracking(mission, driverName) });
  } catch (error) {
    return next(error);
  }
});

router.patch(
  '/:missionId/status',
  authenticate,
  authorize('driver', 'admin'),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const missionId = Number(req.params.missionId);
      if (Number.isNaN(missionId)) {
        return res.status(400).json({ message: 'Identifiant de mission invalide.' });
      }

      const body = statusSchema.parse(req.body);

      const [mission] = await db
        .select()
        .from(missions)
        .where(eq(missions.id, missionId))
        .limit(1)
        .execute();

      if (!mission) {
        return res.status(404).json({ message: 'Mission introuvable.' });
      }

      if (req.auth?.role !== 'admin' && mission.driverId !== req.auth?.profileId) {
        return res.status(403).json({ message: 'Accès refusé.' });
      }

      const updates: Partial<typeof mission> = { status: body.status };

      const now = new Date();
      if (body.status === 'in_progress') {
        updates.actualStartTime = now;
      }
      if (body.status === 'completed') {
        updates.actualEndTime = now;
      }

      await db.update(missions).set(updates).where(eq(missions.id, missionId)).execute();

      const [updatedMission] = await db
        .select()
        .from(missions)
        .where(eq(missions.id, missionId))
        .limit(1)
        .execute();

      if (updatedMission) {
        await notifyMissionStatusChange({
          missionNumber: updatedMission.missionNumber,
          status: updatedMission.status,
          previousStatus: mission.status,
          priority: updatedMission.priority,
          driverId: updatedMission.driverId ?? null,
          clientId: updatedMission.clientId,
          scheduledDate:
            updatedMission.scheduledDate instanceof Date
              ? updatedMission.scheduledDate.toISOString()
              : String(updatedMission.scheduledDate),
          updatedAt:
            updatedMission.updatedAt instanceof Date
              ? updatedMission.updatedAt.toISOString()
              : String(updatedMission.updatedAt),
        });
      }

      return res.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Statut invalide.', details: error.flatten() });
      }

      return next(error);
    }
  }
);

export default router;
