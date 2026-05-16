import { api, unwrap } from "./api";
import type { PublicAuthority, PublicAuthorityCreate, PublicAuthorityUpdate } from "../types";

export const publicAuthorityService = {
  getAll: () => unwrap<PublicAuthority[]>(api.get("/public-authorities")),
  getById: (id: number) => unwrap<PublicAuthority>(api.get(`/public-authorities/${id}`)),
  create: (payload: PublicAuthorityCreate) => unwrap<PublicAuthority>(api.post("/public-authorities", payload)),
  update: (id: number, payload: PublicAuthorityUpdate) => unwrap<PublicAuthority>(api.put(`/public-authorities/${id}`, payload)),
};
