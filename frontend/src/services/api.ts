/// <reference types="vite/client" />

import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { AppError, ApiError } from "../types/error";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

class ApiClient {
  private client: AxiosInstance;
  private tokenKey = "auth_token";

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur pour ajouter le token à chaque requête
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Intercepteur pour gérer les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.removeToken();
          window.location.href = "/login";
        }
        return Promise.reject(this.handleError(error));
      },
    );
  }

  private handleError(error: AxiosError<ApiError>): AppError {
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.detail ||
      error.message ||
      "Une erreur est survenue";

    return new AppError(
      typeof message === "string" ? message : JSON.stringify(message),
      status,
      error.response?.data,
    );
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Méthodes HTTP
  get<T>(url: string, config = {}) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: unknown, config = {}) {
    return this.client.post<T>(url, data, config);
  }

  patch<T>(url: string, data?: unknown, config = {}) {
    return this.client.patch<T>(url, data, config);
  }

  put<T>(url: string, data?: unknown, config = {}) {
    return this.client.put<T>(url, data, config);
  }

  delete<T>(url: string, config = {}) {
    return this.client.delete<T>(url, config);
  }

  // Upload de fichiers
  uploadFile<T>(
    url: string,
    file: File,
    additionalData?: Record<string, unknown>,
  ) {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.client.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const apiClient = new ApiClient();
export const api = apiClient;
export const authHeader = () => {
  const token = apiClient.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default apiClient;
