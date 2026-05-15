export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "rejected"
  | "invited"
  | "accepted";
export type DocumentType =
  | "cv"
  | "diploma"
  | "cover_letter"
  | "identity_card"
  | "certificate"
  | "other";

export interface Application {
  id: number;
  job_offer_id: number;
  candidate_id: number;
  cover_letter?: string | null;
  resume_url?: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  candidate_full_name?: string | null;
  candidate_email?: string | null;
  job_offer_title?: string | null;
  job_offer_location?: string | null;
}

export interface ApplicationWithDetails extends Application {
  job_offer: {
    id: number;
    title: string;
    company: {
      id: number;
      name: string;
    };
  };
  candidate: {
    id: number;
    full_name: string;
    email: string;
  };
  documents: Document[];
}

export interface ApplicationCreate {
  job_offer_id: number;
  cover_letter?: string | null;
  resume_url?: string | null;
}

export interface ApplicationStatusUpdate {
  status: ApplicationStatus;
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

export interface ApplicationsListResponse {
  total: number;
  applications: ApplicationWithDetails[];
}
