import { Router } from 'express';
import { z } from 'zod';
import { Buffer } from 'node:buffer';
import { db, schema } from '../db';
import { forwardDriverApplication } from '../services/integrations';
import { authenticate, authorize } from '../middleware/auth';
import { eq, and } from 'drizzle-orm';
import { resolveInsertId } from '../utils/db';

const router = Router();
const { driverApplications, driverApplicationAttachments } = schema;

const attachmentSchema = z.object({
  name: z.string().min(1),
  type: z.string().optional(),
  size: z.number().int().nonnegative().max(5 * 1024 * 1024),
  data: z.string().min(1),
});

const applicationSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(4),
  yearsExperience: z.number().int().min(0).max(50),
  licenseTypes: z.array(z.string().min(1)).min(1),
  regions: z.array(z.string().min(1)).min(1),
  availability: z.string().min(1),
  hasOwnVehicle: z.boolean(),
  hasCompany: z.boolean(),
  message: z.string().optional(),
  attachments: z.array(attachmentSchema).optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = applicationSchema.parse({
      ...req.body,
      yearsExperience: Number(req.body?.yearsExperience ?? 0),
    });

    const applicationResult = await db
      .insert(driverApplications)
      .values({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        yearsExperience: payload.yearsExperience,
        licenseTypes: payload.licenseTypes,
        regions: payload.regions,
        availability: payload.availability,
        hasOwnVehicle: payload.hasOwnVehicle ? 1 : 0,
        hasCompany: payload.hasCompany ? 1 : 0,
        message: payload.message ?? null,
      })
      .execute();

    const applicationId = resolveInsertId(applicationResult);

    if (payload.attachments && payload.attachments.length > 0 && typeof applicationId === 'number') {
      const records = payload.attachments.map((attachment) => ({
        applicationId,
        fileName: attachment.name,
        mimeType: attachment.type ?? null,
        fileSize: attachment.size,
        content: attachment.data,
      }));

      if (records.length > 0) {
        await db.insert(driverApplicationAttachments).values(records).execute();
      }
    }

    await forwardDriverApplication({
      id: applicationId ?? 0,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      yearsExperience: payload.yearsExperience,
      licenseTypes: payload.licenseTypes,
      regions: payload.regions,
      availability: payload.availability,
      hasOwnVehicle: payload.hasOwnVehicle,
      hasCompany: payload.hasCompany,
      message: payload.message ?? null,
      attachments: payload.attachments?.map((item) => ({
        fileName: item.name,
        mimeType: item.type ?? null,
        fileSize: item.size,
        data: item.data,
      })),
    });

    return res.status(201).json({ message: 'Candidature enregistrée.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

router.get(
  '/applications/:applicationId/attachments/:attachmentId',
  authenticate,
  authorize('admin'),
  async (req, res, next) => {
    try {
      const applicationId = Number(req.params.applicationId);
      const attachmentId = Number(req.params.attachmentId);

      if (Number.isNaN(applicationId) || Number.isNaN(attachmentId)) {
        return res.status(400).json({ message: 'Identifiants invalides.' });
      }

      const [attachment] = await db
        .select()
        .from(driverApplicationAttachments)
        .where(
          and(
            eq(driverApplicationAttachments.id, attachmentId),
            eq(driverApplicationAttachments.applicationId, applicationId)
          )
        )
        .limit(1)
        .execute();

      if (!attachment) {
        return res.status(404).json({ message: 'Fichier introuvable.' });
      }

      res.setHeader('Content-Type', attachment.mimeType ?? 'application/octet-stream');
      res.setHeader('Content-Length', attachment.fileSize);
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);
      return res.send(Buffer.from(attachment.content, 'base64'));
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
