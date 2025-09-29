import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the organization type
export interface Organization {
  id: string;
  organization_name: string;
  createdAt: string;
  user_id: string;
}

// Response type
export interface GetAllOrganizationsResponse {
  total_organizations: number;
  organizations: Organization[];
}

export const organizationsApi = createApi({
  reducerPath: "organizationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev/",
  }),
  endpoints: (builder) => ({
    getAll_organizations: builder.query<GetAllOrganizationsResponse, void>({
      query: () => ({
        url: "getAll-organizations",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetAll_organizationsQuery } = organizationsApi;
