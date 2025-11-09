import { env } from '../env';
import type { Quote } from '../db/schema';

type QuoteAutomationPayload = {
  quote: Quote;
  attachments?: Array<{
    fileName: string;
    mimeType: string | null;
    fileSize: number;
    data: string;
  }>;
};

type DriverApplicationAutomationPayload = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: number;
  licenseTypes: string[];
  regions: string[];
  availability: string;
  hasOwnVehicle: boolean;
  hasCompany: boolean;
  message?: string | null;
  attachments?: Array<{
    fileName: string;
    mimeType: string | null;
    fileSize: number;
    data: string;
  }>;
};

type MissionNotificationPayload = {
  missionNumber: string;
  status: string;
  previousStatus?: string;
  priority: string;
  driverId: number | null;
  clientId: number;
  scheduledDate: string;
  updatedAt: string;
};

type PasswordResetPayload = {
  email: string;
  resetToken: string;
  expiresAt: string;
};

async function postWebhook(url: string, payload: unknown) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.warn(`[integrations] Webhook ${url} returned status ${response.status}`);
    }
  } catch (error) {
    console.error(`[integrations] Unable to reach webhook ${url}:`, error);
  }
}

export async function forwardQuoteToAutomations(payload: QuoteAutomationPayload) {
  if (env.AUTOMATION_QUOTE_WEBHOOKS.length === 0) {
    return;
  }

  await Promise.all(env.AUTOMATION_QUOTE_WEBHOOKS.map((url) => postWebhook(url, payload)));
}

export async function forwardDriverApplication(payload: DriverApplicationAutomationPayload) {
  if (env.AUTOMATION_DRIVER_WEBHOOKS.length === 0) {
    return;
  }

  await Promise.all(env.AUTOMATION_DRIVER_WEBHOOKS.map((url) => postWebhook(url, payload)));
}

export async function notifyMissionStatusChange(payload: MissionNotificationPayload) {
  if (env.MISSION_NOTIFICATION_WEBHOOKS.length === 0) {
    return;
  }

  await Promise.all(env.MISSION_NOTIFICATION_WEBHOOKS.map((url) => postWebhook(url, payload)));
}

export async function notifyPasswordReset(payload: PasswordResetPayload) {
  if (env.PASSWORD_RESET_WEBHOOKS.length === 0) {
    return;
  }

  await Promise.all(env.PASSWORD_RESET_WEBHOOKS.map((url) => postWebhook(url, payload)));
}
