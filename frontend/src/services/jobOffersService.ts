import { api, authHeader } from "./api";

export type JobOffer = {
  id: number;
  title: string;
  description: string;
  location?: string | null;
  is_published: boolean;
  is_rejected: boolean;
  created_at: string;
  company_id: number;
  recruiter_id: number;
};

export type JobOfferCreatePayload = {
  title: string;
  description: string;
  location?: string;
  company_id: number;
  is_published?: boolean;
};

export type JobOfferApplication = {
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

export type JobOfferAdmin = JobOffer & {
  applications?: JobOfferApplication[];
  recruiter_full_name?: string | null;
  recruiter_email?: string | null;
};

export const listJobOffers = async () => {
  const response = await api.get<JobOffer[]>("/job-offers");
  return response.data;
};

export const listAdminJobOffers = async () => {
  const response = await api.get<JobOfferAdmin[]>("/job-offers/admin", {
    headers: authHeader(),
  });
  return response.data;
};

export const getJobOffer = async (offerId: number) => {
  const response = await api.get<JobOffer>(`/job-offers/${offerId}`);
  return response.data;
};

export const createJobOffer = async (payload: JobOfferCreatePayload) => {
  const response = await api.post<JobOffer>("/job-offers", payload, {
    headers: authHeader(),
  });
  return response.data;
};

export const publishJobOffer = async (offerId: number) => {
  const response = await api.patch<JobOffer>(
    `/job-offers/${offerId}/publish`,
    null,
    {
      headers: authHeader(),
    },
  );
  return response.data;
};

export const rejectJobOffer = async (offerId: number) => {
  const response = await api.patch<JobOffer>(
    `/job-offers/${offerId}/reject`,
    null,
    {
      headers: authHeader(),
    },
  );
  return response.data;
};
