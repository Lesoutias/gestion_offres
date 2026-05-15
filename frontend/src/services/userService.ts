import { api, authHeader } from "./api";

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  role_name: string;
};

export const fetchCurrentUser = async () => {
  const response = await api.get<User>("/users/me", {
    headers: authHeader(),
  });
  return response.data;
};

export const listUsers = async () => {
  const response = await api.get<User[]>("/users", {
    headers: authHeader(),
  });
  return response.data;
};
