import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import applicationService from "../../services/applicationService";
import {
  Application as ApplicationBase,
  ApplicationCreate,
  ApplicationStatusUpdate,
  ApplicationWithDetails,
} from "../../types";

export type Application = ApplicationBase | ApplicationWithDetails;

type ApplicationsState = {
  items: Application[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ApplicationsState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchMyApplications = createAsyncThunk<
  ApplicationWithDetails[],
  void,
  { rejectValue: string }
>("applications/fetchMyApplications", async (_, thunkApi) => {
  try {
    return await applicationService.listMyApplications();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de charger les candidatures",
    );
  }
});

export const fetchRecruiterApplications = createAsyncThunk<
  ApplicationWithDetails[],
  void,
  { rejectValue: string }
>("applications/fetchRecruiterApplications", async (_, thunkApi) => {
  try {
    return await applicationService.listRecruiterApplications();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail ||
        "Impossible de charger les candidatures du recruteur",
    );
  }
});

export const applyToOffer = createAsyncThunk<
  Application,
  ApplicationCreate,
  { rejectValue: string }
>("applications/applyToOffer", async (payload, thunkApi) => {
  try {
    return await applicationService.applyToOffer(payload);
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de postuler à l'offre",
    );
  }
});

export const reviewApplication = createAsyncThunk<
  Application,
  { applicationId: number; status: ApplicationStatusUpdate["status"] },
  { rejectValue: string }
>("applications/reviewApplication", async (payload, thunkApi) => {
  try {
    return await applicationService.reviewApplication(
      payload.applicationId,
      payload.status,
    );
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail ||
        "Impossible de mettre à jour le statut de la candidature",
    );
  }
});

const applicationsSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {
    resetApplications(state) {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      })
      .addCase(fetchRecruiterApplications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchRecruiterApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      })
      .addCase(applyToOffer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(applyToOffer.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = "succeeded";
      })
      .addCase(applyToOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors de la candidature";
      })
      .addCase(reviewApplication.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(reviewApplication.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item,
        );
        state.status = "succeeded";
      })
      .addCase(reviewApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Erreur lors de la mise à jour de la candidature";
      });
  },
});

export const { resetApplications } = applicationsSlice.actions;
export default applicationsSlice.reducer;
