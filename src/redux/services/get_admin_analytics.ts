import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define base API
export const adminAnalyticsApi = createApi({
  reducerPath: "adminAnalyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAdminAnalytics: builder.query<{
      users_count: number;
      organizations_count: number;
      projects_count: number;
      reviewDocuments_count: number;
    }, void>({
      query: () => "admin-analytics",
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAdminAnalyticsQuery } = adminAnalyticsApi;
