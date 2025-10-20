import { Router } from 'express';
import { z } from 'zod';
import { db, schema } from '../db';

const router = Router();
const { quotes } = schema;

const quoteSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(4),
  companyName: z.string().optional(),
  vehicleType: z.string().min(1),
  departureLocation: z.string().min(1),
  arrivalLocation: z.string().min(1),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = quoteSchema.parse(req.body);

    await db
      .insert(quotes)
      .values({
        fullName: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        companyName: payload.companyName ?? null,
        vehicleType: payload.vehicleType,
        departureLocation: payload.departureLocation,
        arrivalLocation: payload.arrivalLocation,
        preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
        message: payload.message ?? null,
        status: 'new',
      })
      .execute();

    return res.status(201).json({ message: 'Demande de devis enregistrée.' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Données invalides', details: error.flatten() });
    }

    return next(error);
  }
});

export default router;
