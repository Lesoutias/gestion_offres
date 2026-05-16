import { api, unwrap } from "./api";
import type { OfferEvaluation, OfferEvaluationCreate, OfferEvaluationUpdate } from "../types";

export const offerEvaluationService = {
  create: (payload: OfferEvaluationCreate) => unwrap<OfferEvaluation>(api.post("/offer-evaluations", payload)),
  getByOffer: (offerId: number) => unwrap<OfferEvaluation[]>(api.get(`/offer-evaluations/offer/${offerId}`)),
  getByTender: (tenderCallId: number) => unwrap<OfferEvaluation[]>(api.get(`/offer-evaluations/tender/${tenderCallId}`)),
  update: (id: number, payload: OfferEvaluationUpdate) => unwrap<OfferEvaluation>(api.put(`/offer-evaluations/${id}`, payload)),
  delete: (id: number) => unwrap<void>(api.delete(`/offer-evaluations/${id}`)),
};
