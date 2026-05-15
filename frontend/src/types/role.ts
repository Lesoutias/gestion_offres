export type PermissionName =
  | "user:read"
  | "user:create"
  | "user:update"
  | "role:read"
  | "role:create"
  | "role:update"
  | "permission:read"
  | "permission:assign"
  | "company:create"
  | "company:read"
  | "company:update"
  | "company:verify"
  | "job_offer:create"
  | "job_offer:read"
  | "job_offer:update"
  | "job_offer:publish"
  | "job_offer:reject"
  | "job_offer:close"
  | "application:create"
  | "application:read_own"
  | "application:read_recruiter"
  | "application:read_all"
  | "application:update_status"
  | "application:shortlist"
  | "application:reject"
  | "application:invite"
  | "document:upload"
  | "document:read"
  | "document:delete"
  | "review:create"
  | "review:read"
  | "review:moderate"
  | "stats:read";

export interface Permission {
  id: number;
  name: PermissionName;
  description: string;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}
