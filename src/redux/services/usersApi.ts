// src/redux/services/usersApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the user type (helps with TypeScript autocomplete)
export interface User {
  id: string;
  email: string;
  fullName: string;
  status: string;
  createdAt?: string;
  password?: string;
  session_id?: string;
  onboarding_status?: boolean | string;
  picture?: string;
  sub?: string;
  access_token?: string;
  verification_code_hash?: string;
  verification_expires_at?: number;
  expiry?: string;
  locale?: string | null;
}

export interface UsersResponse {
  count: number;
  users: User[];
}

export const usersApi = createApi({
  reducerPath: "usersApi", // unique key
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
  }),
  endpoints: (builder) => ({
    // GET ALL USERS API
    getAll_users: builder.query<UsersResponse, void>({
      query: () => ({
        url: "/getAll-users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAll_usersQuery } = usersApi;
