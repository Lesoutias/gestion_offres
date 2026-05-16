export interface AuditLog {
  id: number;
  user_id?: number | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  description?: string | null;
  created_at: string;
}
