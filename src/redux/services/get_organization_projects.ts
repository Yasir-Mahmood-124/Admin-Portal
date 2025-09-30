import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for response
export interface Project {
  id: string;
  project_name: string;
  createdAt: string;
  organization_id: string;
}

export interface Organization {
  id: string;
  organization_name: string;
  createdAt: string;
  user_id: string;
  projects: Project[];
}

export interface GetOrganizationProjectsResponse {
  total_organizations: number;
  organizations: Organization[];
}

export const organizationProjectsApi = createApi({
  reducerPath: "organizationProjectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getOrganizationProjects: builder.query<GetOrganizationProjectsResponse, void>({
      query: () => "get-organization-projects",
    }),
  }),
});

export const { useGetOrganizationProjectsQuery } = organizationProjectsApi;
