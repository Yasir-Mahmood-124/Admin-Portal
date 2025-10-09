import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface ActivityItem {
  table: string;
  createdAt: string;
  relative_time: string;
}

interface RecentActivityResponse {
  success: boolean;
  data: {
    Users: ActivityItem;
    Organizations: ActivityItem;
    Projects: ActivityItem;
    ReviewDocument: ActivityItem;
  };
}

export const recentActivityApi = createApi({
  reducerPath: "recentActivityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRecentActivity: builder.query<RecentActivityResponse, void>({
      query: () => ({
        url: "/recent-activity",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetRecentActivityQuery } = recentActivityApi;
