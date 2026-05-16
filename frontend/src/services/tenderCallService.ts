import { api, unwrap } from "./api";
import type { TenderCall, TenderCallCreate, TenderCallUpdate } from "../types";

export const tenderCallService = {
  getPublished: () => unwrap<TenderCall[]>(api.get("/tender-calls/published")),
  getAll: () => unwrap<TenderCall[]>(api.get("/tender-calls/admin")),
  getById: (id: number) => unwrap<TenderCall>(api.get(`/tender-calls/${id}`)),
  create: (payload: TenderCallCreate) => unwrap<TenderCall>(api.post("/tender-calls", payload)),
  update: (id: number, payload: TenderCallUpdate) => unwrap<TenderCall>(api.put(`/tender-calls/${id}`, payload)),
  publish: (id: number) => unwrap<TenderCall>(api.patch(`/tender-calls/${id}/publish`)),
  close: (id: number) => unwrap<TenderCall>(api.patch(`/tender-calls/${id}/close`)),
  cancel: (id: number) => unwrap<TenderCall>(api.patch(`/tender-calls/${id}/cancel`)),
  startEvaluation: (id: number) => unwrap<TenderCall>(api.patch(`/tender-calls/${id}/start-evaluation`)),
};
