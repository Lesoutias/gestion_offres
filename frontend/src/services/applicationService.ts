import { apiClient } from "./api";
import {
  Application,
  ApplicationCreate,
  ApplicationStatusUpdate,
  ApplicationWithDetails,
} from "../types";

class ApplicationService {
  async createApplication(data: ApplicationCreate): Promise<Application> {
    try {
      const response = await apiClient.post<Application>("/applications", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listMyApplications(): Promise<ApplicationWithDetails[]> {
    try {
      const response =
        await apiClient.get<ApplicationWithDetails[]>("/applications/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getApplicationById(id: number): Promise<ApplicationWithDetails> {
    try {
      const response = await apiClient.get<ApplicationWithDetails>(
        `/applications/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateApplicationStatus(
    id: number,
    data: ApplicationStatusUpdate,
  ): Promise<Application> {
    try {
      const response = await apiClient.patch<Application>(
        `/applications/${id}/status`,
        data,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async inviteCandidate(id: number): Promise<void> {
    try {
      await apiClient.post(`/applications/${id}/invite`);
    } catch (error) {
      throw error;
    }
  }

  async applyToOffer(data: ApplicationCreate): Promise<Application> {
    return this.createApplication(data);
  }

  async reviewApplication(
    applicationId: number,
    status: ApplicationStatusUpdate["status"],
  ): Promise<Application> {
    return this.updateApplicationStatus(applicationId, { status });
  }

  async listRecruiterApplications(): Promise<ApplicationWithDetails[]> {
    try {
      const response = await apiClient.get<ApplicationWithDetails[]>(
        "/applications/recruiter",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listAllApplications(): Promise<ApplicationWithDetails[]> {
    try {
      const response = await apiClient.get<ApplicationWithDetails[]>(
        "/applications/admin",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const applicationService = new ApplicationService();
export default applicationService;
