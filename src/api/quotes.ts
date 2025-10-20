import { apiRequest } from '../lib/apiClient';
import type { Quote } from '../types/domain';
import { logAuditEvent } from './audit';

export type CreateQuoteInput = {
  fullName: string;
  email: string;
  phone: string;
  companyName?: string | null;
  vehicleType: string;
  departureLocation: string;
  arrivalLocation: string;
  preferredDate?: string | null;
  message?: string | null;
  profileId?: string | null;
  authToken?: string | null;
};

export async function createQuote(input: CreateQuoteInput): Promise<Quote> {
  const quote = await apiRequest<Quote>('quotes', {
    method: 'POST',
    token: input.authToken ?? undefined,
    body: {
      full_name: input.fullName,
      email: input.email,
      phone: input.phone,
      company_name: input.companyName ?? null,
      vehicle_type: input.vehicleType,
      departure_location: input.departureLocation,
      arrival_location: input.arrivalLocation,
      preferred_date: input.preferredDate ?? null,
      message: input.message ?? null,
      profile_id: input.profileId ?? null,
    },
  });

  await logAuditEvent({
    action: 'quote.created',
    actor: input.profileId ?? null,
    entity: 'quote',
    meta: {
      email: quote.email,
      vehicleType: quote.vehicle_type,
      hasProfile: Boolean(input.profileId),
    },
    token: input.authToken ?? null,
  });

  await triggerQuoteWebhook(quote);

  return quote;
}

export async function getQuote(id: string, token: string): Promise<Quote | null> {
  return apiRequest<Quote>(`quotes/${id}`, { token });
}

async function triggerQuoteWebhook(quote: Quote): Promise<void> {
  const url = resolveWebhookUrl();
  if (!url) {
    return;
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: quote.id,
        email: quote.email,
        vehicleType: quote.vehicle_type,
        createdAt: quote.created_at,
        status: quote.status,
      }),
    });
  } catch (error) {
    console.warn('Failed to trigger quote webhook', error);
  }
}

function resolveWebhookUrl(): string | null {
  const importMetaEnv = (() => {
    try {
      return (
        Function('return typeof import.meta !== "undefined" ? import.meta : undefined;')() as
          | { env?: Record<string, string | undefined> }
          | undefined
      )?.env;
    } catch (error) {
      console.warn('Unable to access import.meta', error);
      return undefined;
    }
  })();

  if (importMetaEnv?.VITE_N8N_WEBHOOK_QUOTE_CREATED) {
    return importMetaEnv.VITE_N8N_WEBHOOK_QUOTE_CREATED;
  }

  const nodeEnv = (
    globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }
  ).process?.env;

  if (nodeEnv?.VITE_N8N_WEBHOOK_QUOTE_CREATED) {
    return nodeEnv.VITE_N8N_WEBHOOK_QUOTE_CREATED;
  }

  return null;
}
