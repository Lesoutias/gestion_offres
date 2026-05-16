import { api, tokenStorage, unwrap } from "./api";
import type { LoginRequest, RegisterCompanyRequest, Token, User } from "../types";

export const authService = {
  async login(payload: LoginRequest) {
    const token = await unwrap<Token>(api.post("/auth/login", payload));
    tokenStorage.set(token.access_token);
    return token;
  },
  registerCompany(payload: RegisterCompanyRequest) {
    return unwrap<User>(api.post("/auth/register", payload));
  },
  getCurrentUser() {
    return unwrap<User>(api.get("/auth/me"));
  },
  logout() {
    tokenStorage.clear();
  },
};
