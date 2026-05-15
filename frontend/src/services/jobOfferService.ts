import { apiClient } from "./api";
import {
  JobOffer,
  JobOfferCreate,
  JobOfferUpdate,
  JobOfferResponse,
} from "../types";

class JobOfferService {
  async createJobOffer(data: JobOfferCreate): Promise<JobOffer> {
    try {
      const response = await apiClient.post<JobOffer>("/job-offers", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listPublishedOffers(
    domain?: string,
    location?: string,
  ): Promise<JobOfferResponse[]> {
    try {
      const params = new URLSearchParams();
      if (domain) params.append("domain", domain);
      if (location) params.append("location", location);

      const response = await apiClient.get<JobOfferResponse[]>(
        `/job-offers?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getJobOfferById(id: number): Promise<JobOfferResponse> {
    try {
      const response = await apiClient.get<JobOfferResponse>(
        `/job-offers/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateJobOffer(id: number, data: JobOfferUpdate): Promise<JobOffer> {
    try {
      const response = await apiClient.patch<JobOffer>(
        `/job-offers/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async publishJobOffer(id: number): Promise<JobOffer> {
    try {
      const response = await apiClient.patch<JobOffer>(
        `/job-offers/${id}/publish`,
        {},
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async rejectJobOffer(id: number): Promise<JobOffer> {
    try {
      const response = await apiClient.patch<JobOffer>(
        `/job-offers/${id}/reject`,
        {},
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async closeJobOffer(id: number): Promise<JobOffer> {
    try {
      const response = await apiClient.patch<JobOffer>(
        `/job-offers/${id}/close`,
        {},
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteJobOffer(id: number): Promise<void> {
    try {
      await apiClient.delete(`/job-offers/${id}`);
    } catch (error) {
      throw error;
    }
  }

  async listMyOffers(): Promise<JobOffer[]> {
    try {
      const response = await apiClient.get<JobOffer[]>(
        "/job-offers/recruiter/me",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listPendingOffers(): Promise<JobOffer[]> {
    try {
      const response = await apiClient.get<JobOffer[]>(
        "/job-offers/admin/pending",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listAllOffers(): Promise<JobOffer[]> {
    try {
      const response = await apiClient.get<JobOffer[]>("/job-offers/admin/all");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const jobOfferService = new JobOfferService();

export default jobOfferService;
