import { api, unwrap } from "./api";
import type { Role, RoleCreate, RolePermissionAssign, RoleUpdate } from "../types";

export const roleService = {
  getAll: () => unwrap<Role[]>(api.get("/roles")),
  create: (payload: RoleCreate) => unwrap<Role>(api.post("/roles", payload)),
  update: (id: number, payload: RoleUpdate) => unwrap<Role>(api.put(`/roles/${id}`, payload)),
  delete: (id: number) => unwrap<void>(api.delete(`/roles/${id}`)),
  assignPermissions: (id: number, payload: RolePermissionAssign) => unwrap<Role>(api.post(`/roles/${id}/permissions`, payload)),
};
