import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as userService from "../../services/userService";

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  role_name: string;
};

type UsersState = {
  list: User[];
  currentUser: User | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UsersState = {
  list: [],
  currentUser: null,
  status: "idle",
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<
  userService.User,
  void,
  { rejectValue: string }
>("users/fetchCurrentUser", async (_, thunkApi) => {
  try {
    return await userService.fetchCurrentUser();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de charger le profil",
    );
  }
});

export const fetchUsers = createAsyncThunk<
  userService.User[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, thunkApi) => {
  try {
    return await userService.listUsers();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de charger les utilisateurs",
    );
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUsers(state) {
      state.list = [];
      state.currentUser = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      })
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      });
  },
});

export const { clearUsers } = usersSlice.actions;
export default usersSlice.reducer;
