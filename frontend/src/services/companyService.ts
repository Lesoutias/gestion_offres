import { api, unwrap } from "./api";
import type { Company, CompanyCreate, CompanyUpdate } from "../types";

export const companyService = {
  getAll: () => unwrap<Company[]>(api.get("/companies")),
  getMine: () => unwrap<Company>(api.get("/companies/me")),
  getById: (id: number) => unwrap<Company>(api.get(`/companies/${id}`)),
  create: (payload: CompanyCreate) => unwrap<Company>(api.post("/companies", payload)),
  update: (id: number, payload: CompanyUpdate) => unwrap<Company>(api.put(`/companies/${id}`, payload)),
  verify: (id: number) => unwrap<Company>(api.patch(`/companies/${id}/verify`)),
};
