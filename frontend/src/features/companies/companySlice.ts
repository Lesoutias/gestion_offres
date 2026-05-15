import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Company = {
  id: number;
  name: string;
  description?: string | null;
  owner_id?: number | null;
};

type CompaniesState = {
  list: Company[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: CompaniesState = {
  list: [],
  status: "idle",
  error: null,
};

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies(state, action: PayloadAction<Company[]>) {
      state.list = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearCompanies(state) {
      state.list = [];
      state.status = "idle";
      state.error = null;
    },
    setCompaniesError(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const { setCompanies, clearCompanies, setCompaniesError } =
  companiesSlice.actions;
export default companiesSlice.reducer;
