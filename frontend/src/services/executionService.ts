import { api, unwrap } from "./api";
import type { Execution, ExecutionCreate, ExecutionReport, ExecutionReportCreate, ExecutionUpdate } from "../types";

export const executionService = {
  create: (payload: ExecutionCreate) => unwrap<Execution>(api.post("/executions", payload)),
  getAll: () => unwrap<Execution[]>(api.get("/executions")),
  getMine: () => unwrap<Execution[]>(api.get("/executions/me")),
  getByPublicContract: (publicContractId: number) => unwrap<Execution>(api.get(`/executions/public-contract/${publicContractId}`)),
  getById: (id: number) => unwrap<Execution>(api.get(`/executions/${id}`)),
  update: (id: number, payload: ExecutionUpdate) => unwrap<Execution>(api.put(`/executions/${id}`, payload)),
  start: (id: number) => unwrap<Execution>(api.patch(`/executions/${id}/start`)),
  complete: (id: number) => unwrap<Execution>(api.patch(`/executions/${id}/complete`)),
  delay: (id: number) => unwrap<Execution>(api.patch(`/executions/${id}/delay`)),
  createReport: (payload: ExecutionReportCreate) => unwrap<ExecutionReport>(api.post("/execution-reports", payload)),
  getReports: (executionId: number) => unwrap<ExecutionReport[]>(api.get(`/execution-reports/execution/${executionId}`)),
};
