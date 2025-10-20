import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/auth';
import { db, schema } from '../db';

const router = Router();
const { missions } = schema;

const statusSchema = z.object({
  status: z.enum(['pending', 'assigned', 'in_progress', 'completed', 'cancelled']),
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
