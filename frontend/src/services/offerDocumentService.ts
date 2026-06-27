import { api, unwrap } from "./api";
import type { OfferDocument, OfferDocumentType } from "../types";

export const offerDocumentService = {
  upload: (offerId: number, documentType: OfferDocumentType, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap<OfferDocument>(api.post(`/offer-documents/offer/${offerId}/upload?document_type=${documentType}`, form, { headers: { "Content-Type": "multipart/form-data" } }));
  },
  getByOffer: (offerId: number) => unwrap<OfferDocument[]>(api.get(`/offer-documents/offer/${offerId}`)),
  download: async (documentId: number, fileName: string) => {
    const response = await api.get<Blob>(`/offer-documents/${documentId}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
  delete: (id: number) => unwrap<void>(api.delete(`/offer-documents/${id}`)),
};
