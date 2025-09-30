import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types for response
export interface Project {
  id: string;
  project_name: string;
  createdAt: string | null;
  organization_id: string;
}

export interface Organization {
  id: string;
  organization_name: string;
  createdAt: string | null;
  projects: Project[];
}

export interface User {
  id: string | null;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string | null;
  organizations: Organization[];
}

export interface GetUserOrganizationProjectsResponse {
  total_users: number;
  users: User[];
}

export const userOrganizationProjectsApi = createApi({
  reducerPath: "userOrganizationProjectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserOrganizationProjects: builder.query<
      GetUserOrganizationProjectsResponse,
      void
    >({
      query: () => "get-user-organization-project",
    }),
  }),
});

// Export hook
export const { useGetUserOrganizationProjectsQuery } =
  userOrganizationProjectsApi;
