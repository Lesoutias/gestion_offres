import { api, unwrap } from "./api";
import type { PublicContract, PublicContractCreate } from "../types";

export const publicContractService = {
  create: (payload: PublicContractCreate) => unwrap<PublicContract>(api.post("/public-contracts", payload)),
  getAll: () => unwrap<PublicContract[]>(api.get("/public-contracts")),
  getMine: () => unwrap<PublicContract[]>(api.get("/public-contracts/me")),
  getById: (id: number) => unwrap<PublicContract>(api.get(`/public-contracts/${id}`)),
  sign: (id: number) => unwrap<PublicContract>(api.patch(`/public-contracts/${id}/sign`)),
  cancel: (id: number) => unwrap<PublicContract>(api.patch(`/public-contracts/${id}/cancel`)),
};
