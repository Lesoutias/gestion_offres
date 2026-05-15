export type DocumentType =
  | "cv"
  | "diploma"
  | "cover_letter"
  | "identity_card"
  | "certificate"
  | "other";

export interface DocumentBase {
  application_id: number;
  document_type: DocumentType;
}

export interface DocumentCreate extends DocumentBase {
  file: File;
}

export interface Document {
  id: number;
  application_id: number;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  file_mime_type: string;
  uploaded_at: string;
}

export interface DocumentResponse {
  id: number;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}
