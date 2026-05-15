import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import jobOffersReducer from "../features/jobOffers/jobOfferSlice";
import applicationsReducer from "../features/applications/applicationSlice";
import usersReducer from "../features/users/userSlice";
import companiesReducer from "../features/companies/companySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobOffers: jobOffersReducer,
    applications: applicationsReducer,
    users: usersReducer,
    companies: companiesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
