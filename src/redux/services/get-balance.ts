//redux/services/get-balance.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the API service
export const balanceApi = createApi({
  reducerPath: "balanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getBalance: builder.query<
      { available: string; pending: string; total: string },
      void
    >({
      query: () => ({
        url: "/show-balance",
        method: "GET",
      }),
    }),
  }),
});

// Export the hook
export const { useGetBalanceQuery } = balanceApi;