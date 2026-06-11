import axios from "axios";

const TOKEN_KEY = "auth_token";

function resolveApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

  // En production Vercel : passer par le proxy /api (même origine, pas de CORS)
  if (import.meta.env.PROD && (!raw || raw.includes("onrender.com"))) {
    return "/api";
  }

  if (raw) {
    if (raw.startsWith("/")) {
      return raw.replace(/\/+$/, "") || "/api";
    }
    const normalized = raw.replace(/\/+$/, "");
    return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
  }

  return "http://localhost:8001/api";
}

const API_URL = resolveApiBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 120_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }
  if (!error.response) {
    return "Impossible de joindre le serveur. Le backend peut être en train de démarrer — attendez 30 secondes et réessayez.";
  }
  const detail = error.response.data?.detail;
  if (typeof detail === "string") {
    return detail;
  }
  if (Array.isArray(detail) && detail[0]?.msg) {
    return detail[0].msg;
  }
  return error.message || fallback;
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const unwrap = <T>(request: Promise<{ data: T }>) => request.then((response) => response.data);
