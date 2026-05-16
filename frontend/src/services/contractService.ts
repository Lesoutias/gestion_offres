import { api, unwrap } from "./api";
import type { Contract, ContractCreate, ContractUpdate } from "../types";

export const contractService = {
  create: (payload: ContractCreate) => unwrap<Contract>(api.post("/contracts", payload)),
  getByPublicContract: (publicContractId: number) => unwrap<Contract>(api.get(`/contracts/public-contract/${publicContractId}`)),
  getById: (id: number) => unwrap<Contract>(api.get(`/contracts/${id}`)),
  update: (id: number, payload: ContractUpdate) => unwrap<Contract>(api.put(`/contracts/${id}`, payload)),
  uploadFile: (id: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap<Contract>(api.post(`/contracts/${id}/upload-file`, form, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  sign: (id: number) => unwrap<Contract>(api.patch(`/contracts/${id}/sign`)),
};
