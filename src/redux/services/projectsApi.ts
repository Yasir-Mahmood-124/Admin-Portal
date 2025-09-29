import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the shape of a Project
export interface Project {
  id: string;
  project_name: string;
  createdAt: string;
  organization_id: string;
}

// Define the API response
interface ProjectsResponse {
  total_projects: number;
  projects: Project[];
}

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev/",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAll_projects: builder.query<ProjectsResponse, void>({
      query: () => ({
        url: "getAll-projects",
        method: "GET",
      }),
    }),
  }),
});

// Export the auto-generated hook
export const { useGetAll_projectsQuery } = projectsApi;
