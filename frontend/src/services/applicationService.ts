import { api, authHeader } from "./api";

export type Application = {
  id: number;
  job_offer_id: number;
  candidate_id: number;
  cover_letter?: string | null;
  status: string;
  resume_url?: string | null;
  created_at: string;
  candidate_full_name?: string | null;
  candidate_email?: string | null;
  job_offer_title?: string | null;
  job_offer_location?: string | null;
};

export type ApplicationCreatePayload = {
  job_offer_id: number;
  cover_letter?: string;
  resume_url?: string;
};

export type ApplicationReviewPayload = {
  applicationId: number;
  status: string;
};

export const listMyApplications = async () => {
  const response = await api.get<Application[]>("/applications/me", {
    headers: authHeader(),
  });
  return response.data;
};

export const listRecruiterApplications = async () => {
  const response = await api.get<Application[]>("/applications/recruiter", {
    headers: authHeader(),
  });
  return response.data;
};

export const applyToOffer = async (payload: ApplicationCreatePayload) => {
  const response = await api.post<Application>("/applications", payload, {
    headers: authHeader(),
  });
  return response.data;
};

export const reviewApplication = async (payload: ApplicationReviewPayload) => {
  const response = await api.patch<Application>(
    `/applications/${payload.applicationId}`,
    { status: payload.status },
    {
      headers: authHeader(),
    },
  );
  return response.data;
};
