import { apiClient } from "./api";
import { Company, CompanyCreate, CompanyUpdate } from "../types";

class CompanyService {
  async createCompany(data: CompanyCreate): Promise<Company> {
    try {
      const response = await apiClient.post<Company>("/companies", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCompanyById(id: number): Promise<Company> {
    try {
      const response = await apiClient.get<Company>(`/companies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateCompany(id: number, data: CompanyUpdate): Promise<Company> {
    try {
      const response = await apiClient.patch<Company>(`/companies/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async listMyCompanies(): Promise<Company[]> {
    try {
      const response = await apiClient.get<Company[]>("/companies/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const companyService = new CompanyService();
export default companyService;
