import { api, unwrap } from "./api";
import type { AuditLog } from "../types";

export const auditLogService = {
  getAll: () => unwrap<AuditLog[]>(api.get("/audit-logs")),
  getByUser: (userId: number) => unwrap<AuditLog[]>(api.get(`/audit-logs/user/${userId}`)),
};
