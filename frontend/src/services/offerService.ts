import { api, unwrap } from "./api";
import type { Offer, OfferCreate, OfferStatus, PublicContract } from "../types";

export const offerService = {
  submit: (payload: OfferCreate) => unwrap<Offer>(api.post("/offers", payload)),
  getMyOffers: () => unwrap<Offer[]>(api.get("/offers/me")),
  getByTender: (tenderCallId: number) => unwrap<Offer[]>(api.get(`/offers/tender/${tenderCallId}`)),
  getAll: () => unwrap<Offer[]>(api.get("/offers/admin")),
  getById: (id: number) => unwrap<Offer>(api.get(`/offers/${id}`)),
  award: (id: number) => unwrap<PublicContract>(api.patch(`/offers/${id}/award`)),
  updateStatus: (id: number, statut: OfferStatus) => unwrap<Offer>(api.patch(`/offers/${id}/status`, { statut })),
};
