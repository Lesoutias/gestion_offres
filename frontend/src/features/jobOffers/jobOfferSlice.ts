import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as jobOfferService from "../../services/jobOffersService";

export type JobOffer = {
  id: number;
  title: string;
  description: string;
  location?: string | null;
  is_published: boolean;
  is_rejected: boolean;
  created_at: string;
  company_id: number;
  recruiter_id: number;
};

export type JobOfferAdmin = jobOfferService.JobOfferAdmin;

type JobOffersState = {
  items: JobOffer[];
  adminItems: JobOfferAdmin[];
  currentOffer: JobOffer | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: JobOffersState = {
  items: [],
  adminItems: [],
  currentOffer: null,
  status: "idle",
  error: null,
};

export const fetchJobOffers = createAsyncThunk<
  jobOfferService.JobOffer[],
  void,
  { rejectValue: string }
>("jobOffers/fetchJobOffers", async (_, thunkApi) => {
  try {
    return await jobOfferService.listJobOffers();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de charger les offres",
    );
  }
});

export const fetchJobOffer = createAsyncThunk<
  jobOfferService.JobOffer,
  number,
  { rejectValue: string }
>("jobOffers/fetchJobOffer", async (offerId, thunkApi) => {
  try {
    return await jobOfferService.getJobOffer(offerId);
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de charger l'offre",
    );
  }
});

export const createJobOffer = createAsyncThunk<
  jobOfferService.JobOffer,
  jobOfferService.JobOfferCreatePayload,
  { rejectValue: string }
>("jobOffers/createJobOffer", async (payload, thunkApi) => {
  try {
    return await jobOfferService.createJobOffer(payload);
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de créer l'offre",
    );
  }
});

export const fetchAdminJobOffers = createAsyncThunk<
  jobOfferService.JobOfferAdmin[],
  void,
  { rejectValue: string }
>("jobOffers/fetchAdminJobOffers", async (_, thunkApi) => {
  try {
    return await jobOfferService.listAdminJobOffers();
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail ||
        "Impossible de charger les offres administrateur",
    );
  }
});

export const publishJobOffer = createAsyncThunk<
  jobOfferService.JobOffer,
  number,
  { rejectValue: string }
>("jobOffers/publishJobOffer", async (offerId, thunkApi) => {
  try {
    return await jobOfferService.publishJobOffer(offerId);
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de publier l'offre",
    );
  }
});

export const rejectJobOffer = createAsyncThunk<
  jobOfferService.JobOffer,
  number,
  { rejectValue: string }
>("jobOffers/rejectJobOffer", async (offerId, thunkApi) => {
  try {
    return await jobOfferService.rejectJobOffer(offerId);
  } catch (error: any) {
    return thunkApi.rejectWithValue(
      error?.response?.data?.detail || "Impossible de rejeter l'offre",
    );
  }
});

const jobOffersSlice = createSlice({
  name: "jobOffers",
  initialState,
  reducers: {
    clearCurrentOffer(state) {
      state.currentOffer = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobOffers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobOffers.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchJobOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      })
      .addCase(fetchJobOffer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobOffer.fulfilled, (state, action) => {
        state.currentOffer = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchJobOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du chargement";
      })
      .addCase(createJobOffer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createJobOffer.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentOffer = action.payload;
        state.status = "succeeded";
      })
      .addCase(createJobOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors de la création";
      })
      .addCase(fetchAdminJobOffers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdminJobOffers.fulfilled, (state, action) => {
        state.adminItems = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchAdminJobOffers.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || "Erreur lors du chargement des offres admin";
      })
      .addCase(publishJobOffer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(publishJobOffer.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const index = state.adminItems.findIndex(
          (offer) => offer.id === updatedOffer.id,
        );
        if (index !== -1) {
          state.adminItems[index] = {
            ...state.adminItems[index],
            ...updatedOffer,
          };
        }
        state.status = "succeeded";
      })
      .addCase(publishJobOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors de la publication";
      })
      .addCase(rejectJobOffer.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(rejectJobOffer.fulfilled, (state, action) => {
        const updatedOffer = action.payload;
        const index = state.adminItems.findIndex(
          (offer) => offer.id === updatedOffer.id,
        );
        if (index !== -1) {
          state.adminItems[index] = {
            ...state.adminItems[index],
            ...updatedOffer,
          };
        }
        state.status = "succeeded";
      })
      .addCase(rejectJobOffer.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Erreur lors du rejet";
      });
  },
});

export const { clearCurrentOffer } = jobOffersSlice.actions;
export default jobOffersSlice.reducer;
