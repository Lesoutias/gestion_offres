import { apiClient } from "./api";
import { AdminStats, PipelineOverview } from "../types";

class AdminService {
  async fetchStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminStats>("/admin/stats");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async fetchPipelineOverview(): Promise<PipelineOverview> {
    try {
      const response = await apiClient.get<PipelineOverview>(
        "/admin/pipeline-overview",
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const adminService = new AdminService();
export default adminService;
