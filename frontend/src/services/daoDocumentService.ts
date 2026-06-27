import { api, unwrap } from "./api";
import type { DaoDocument, DaoDocumentCreate, DaoDocumentUpdate, SubmissionDocumentType } from "../types";

export const daoDocumentService = {
  getAvailableDocumentTypes: () =>
    unwrap<SubmissionDocumentType[]>(api.get("/dao-documents/available-document-types")),
  create: (payload: DaoDocumentCreate) => unwrap<DaoDocument>(api.post("/dao-documents", payload)),
  getByTender: (tenderCallId: number) => unwrap<DaoDocument>(api.get(`/dao-documents/tender/${tenderCallId}`)),
  update: (id: number, payload: DaoDocumentUpdate) => unwrap<DaoDocument>(api.put(`/dao-documents/${id}`, payload)),
  uploadFile: (id: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap<DaoDocument>(api.post(`/dao-documents/${id}/upload-file`, form, { headers: { "Content-Type": "multipart/form-data" } }));
  },
};
