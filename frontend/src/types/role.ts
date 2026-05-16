import type { Permission } from "./permission";

export type UserRole = "admin" | "autorite_publique" | "entreprise" | "commission_evaluation";

export interface Role {
  id: number;
  name: UserRole | string;
  description?: string | null;
  permissions: Permission[];
}

export interface RoleCreate {
  name: UserRole | string;
  description?: string;
}

export type RoleUpdate = Partial<RoleCreate>;

export interface RolePermissionAssign {
  permission_ids: number[];
}
