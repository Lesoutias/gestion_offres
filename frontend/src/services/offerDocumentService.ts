import { api, unwrap } from "./api";
import type { OfferDocument, OfferDocumentType } from "../types";

export const offerDocumentService = {
  upload: (offerId: number, documentType: OfferDocumentType, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap<OfferDocument>(api.post(`/offer-documents/offer/${offerId}/upload?document_type=${documentType}`, form, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  getByOffer: (offerId: number) => unwrap<OfferDocument[]>(api.get(`/offer-documents/offer/${offerId}`)),
  delete: (id: number) => unwrap<void>(api.delete(`/offer-documents/${id}`)),
};
