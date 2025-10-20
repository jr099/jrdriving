import { apiRequest } from '../lib/apiClient';

export type AuditLogInput = {
  action: string;
  actor?: string | null;
  entity: string;
  meta?: Record<string, unknown>;
  token?: string | null;
};

export async function logAuditEvent({ action, actor, entity, meta, token }: AuditLogInput): Promise<void> {
  await apiRequest('audit-logs', {
    method: 'POST',
    token: token ?? undefined,
    body: {
      action,
      actor: actor ?? null,
      entity,
      meta: meta ?? {},
    },
  });
}
