// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { usersApi } from "./services/usersApi";
import { organizationsApi } from "./services/organizationsApi";
import { projectsApi } from "./services/projectsApi";
import { reviewDocumentsApi } from "./services/reviewDocumentsApi";

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    [projectsApi.reducerPath]: projectsApi.reducer,
    [reviewDocumentsApi.reducerPath]: reviewDocumentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
        usersApi.middleware, 
        organizationsApi.middleware,
        projectsApi.middleware,
        reviewDocumentsApi.middleware,
    ),
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
