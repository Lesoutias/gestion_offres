import { apiClient } from "./api";
import { User, AuthResponse, LoginRequest, RegisterRequest } from "../types";

class AuthService {
  async login(
    credentials: LoginRequest,
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const { access_token, user } = response.data;
      apiClient.setToken(access_token);

      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  }

  async register(
    data: RegisterRequest,
  ): Promise<{ user: User; token: string }> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", {
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        role_name: data.role_name,
      });

      const { access_token, user } = response.data;
      apiClient.setToken(access_token);

      return { user, token: access_token };
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/auth/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      apiClient.removeToken();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  getToken(): string | null {
    return apiClient.getToken();
  }
}

export const authService = new AuthService();

export default authService;
