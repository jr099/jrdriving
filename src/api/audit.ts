import { supabase } from '../lib/supabase';

export type AuditLogInput = {
  action: string;
  actor?: string | null;
  entity: string;
  meta?: Record<string, unknown>;
};

export async function logAuditEvent({ action, actor, entity, meta }: AuditLogInput): Promise<void> {
  const { error } = await supabase.from('audit_logs').insert({
    action,
    actor: actor ?? null,
    entity,
    meta: meta ?? {},
  });

  if (error) {
    throw error;
  }
}
