import { api, unwrap } from "./api";
import type { User, UserCreate, UserUpdate } from "../types";

export const userService = {
  getAll: () => unwrap<User[]>(api.get("/users")),
  getById: (id: number) => unwrap<User>(api.get(`/users/${id}`)),
  create: (payload: UserCreate) => unwrap<User>(api.post("/users", payload)),
  update: (id: number, payload: UserUpdate) => unwrap<User>(api.put(`/users/${id}`, payload)),
  activate: (id: number) => unwrap<User>(api.patch(`/users/${id}/activate`)),
  deactivate: (id: number) => unwrap<User>(api.patch(`/users/${id}/deactivate`)),
};
