import { api, unwrap } from "./api";
import type { Permission, PermissionCreate, PermissionUpdate } from "../types";

export const permissionService = {
  getAll: () => unwrap<Permission[]>(api.get("/permissions")),
  create: (payload: PermissionCreate) => unwrap<Permission>(api.post("/permissions", payload)),
  update: (id: number, payload: PermissionUpdate) => unwrap<Permission>(api.put(`/permissions/${id}`, payload)),
  delete: (id: number) => unwrap<void>(api.delete(`/permissions/${id}`)),
};
