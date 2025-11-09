import { Router } from 'express';
import { desc, eq, inArray } from 'drizzle-orm';
import { authenticate, authorize, type AuthenticatedRequest } from '../middleware/auth';
import { db, schema } from '../db';
import type { DriverApplication, Mission, Quote } from '../db/schema';

const router = Router();
const { missions, profiles, quotes, quoteAttachments, driverApplications, driverApplicationAttachments } = schema;

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

function parseJsonArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown;
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch (error) {
      console.warn('[admin] Impossible de parser un champ JSON:', error);
      return [];
    }
  }

  return [];
}

function mapDriverApplication(record: DriverApplication) {
  return {
    id: record.id,
    fullName: record.fullName,
    email: record.email,
    phone: record.phone,
    yearsExperience: record.yearsExperience,
    licenseTypes: parseJsonArray<string>(record.licenseTypes),
    regions: parseJsonArray<string>(record.regions),
    availability: record.availability,
    hasOwnVehicle: Boolean(record.hasOwnVehicle),
    hasCompany: Boolean(record.hasCompany),
    message: record.message ?? null,
    status: record.status,
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
      const pendingQuoteIds = pendingQuotes.map((quote) => quote.id);
      const pendingQuoteAttachments = pendingQuoteIds.length
        ? await db
            .select()
            .from(quoteAttachments)
            .where(inArray(quoteAttachments.quoteId, pendingQuoteIds))
            .execute()
        : [];
      const recentMissions = await db
        .select()
        .from(missions)
        .orderBy(desc(missions.createdAt))
        .limit(5)
        .execute();
      const recentDriverApplications = await db
        .select()
        .from(driverApplications)
        .orderBy(desc(driverApplications.createdAt))
        .limit(5)
        .execute();
      const driverApplicationIds = recentDriverApplications.map((app) => app.id);
      const driverAppAttachments = driverApplicationIds.length
        ? await db
            .select()
            .from(driverApplicationAttachments)
            .where(inArray(driverApplicationAttachments.applicationId, driverApplicationIds))
            .execute()
        : [];

      const activeMissions = allMissions.filter((mission) => mission.status === 'in_progress' || mission.status === 'assigned');
      const revenue = allMissions
        .filter((mission) => mission.status === 'completed' && mission.price)
        .reduce((total, mission) => total + (mission.price ?? 0), 0);

      const punctualityRate = (() => {
        const completed = allMissions.filter((mission) => mission.status === 'completed');
        if (completed.length === 0) return 100;
        const withTiming = completed.filter((mission) => mission.actualEndTime && mission.actualStartTime);
        return Math.min(100, Math.round((withTiming.length / completed.length) * 100));
      })();

      const insights: string[] = [];
      if (pendingQuotes.length > 10) {
        insights.push('Beaucoup de devis en attente : pensez à déclencher une campagne de relance automatique.');
      }
      if (activeMissions.length > Math.max(driverProfiles.length, 1) * 3) {
        insights.push("Charge élevée sur les chauffeurs : identifiez les profils disponibles ou planifiez des renforts.");
      }
      if (punctualityRate < 95) {
        insights.push("Taux de ponctualité en baisse : analysez les missions express pour ajuster les buffers logistiques.");
      }
      if (insights.length === 0) {
        insights.push('Activité stable : maintenez le niveau de qualité et automatisez la relance des clients fidèles.');
      }

      return res.json({
        stats: {
          totalMissions: allMissions.length,
          activeMissions: activeMissions.length,
          totalDrivers: driverProfiles.length,
          totalClients: clientProfiles.length,
          pendingQuotes: pendingQuotes.length,
          revenue,
          punctualityRate,
        },
        recentMissions: recentMissions.map(mapMission),
        pendingQuotes: pendingQuotes.map((quote) => ({
          ...mapQuote(quote),
          attachments: pendingQuoteAttachments
            .filter((file) => file.quoteId === quote.id)
            .map((file) => ({
              id: file.id,
              fileName: file.fileName,
              mimeType: file.mimeType,
              fileSize: file.fileSize,
              createdAt: file.createdAt instanceof Date ? file.createdAt.toISOString() : String(file.createdAt),
            })),
        })),
        driverApplications: recentDriverApplications.map((application) => ({
          ...mapDriverApplication(application),
          attachments: driverAppAttachments
            .filter((file) => file.applicationId === application.id)
            .map((file) => ({
              id: file.id,
              fileName: file.fileName,
              mimeType: file.mimeType,
              fileSize: file.fileSize,
              createdAt: file.createdAt instanceof Date ? file.createdAt.toISOString() : String(file.createdAt),
            })),
        })),
        aiInsights: insights,
      });
    } catch (error) {
      return next(error);
    }
  }
);

export default router;
