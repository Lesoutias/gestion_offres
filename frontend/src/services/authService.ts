import axios from "axios";

import { api, tokenStorage, unwrap } from "./api";
import type { LoginRequest, RegisterCompanyRequest, Token, User } from "../types";

async function postLogin(payload: LoginRequest) {
  return unwrap<Token>(api.post("/auth/login", payload));
}

export const authService = {
  async login(payload: LoginRequest) {
    try {
      const token = await postLogin(payload);
      tokenStorage.set(token.access_token);
      return token;
    } catch (error) {
      if (axios.isAxiosError(error) && !error.response) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        const token = await postLogin(payload);
        tokenStorage.set(token.access_token);
        return token;
      }
      throw error;
    }
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
