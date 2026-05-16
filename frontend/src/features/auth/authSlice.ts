import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../services/authService";
import { tokenStorage } from "../../services/api";
import type { AuthState, LoginRequest, RegisterCompanyRequest } from "../../types";

const initialState: AuthState = {
  user: null,
  token: tokenStorage.get(),
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (payload: LoginRequest) => {
  await authService.login(payload);
  return authService.getCurrentUser();
});

export const registerCompany = createAsyncThunk("auth/registerCompany", async (payload: RegisterCompanyRequest) => {
  await authService.registerCompany(payload);
});

export const loadCurrentUser = createAsyncThunk("auth/me", async () => authService.getCurrentUser());

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = tokenStorage.get();
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Connexion impossible";
      })
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Inscription impossible";
      })
      .addCase(loadCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = tokenStorage.get();
      })
      .addCase(loadCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        tokenStorage.clear();
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
