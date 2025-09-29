import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewDocumentsApi = createApi({
  reducerPath: "reviewDocumentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 1. Get all review documents
    getAll_review_documents: builder.query<
      {
        documents: {
          user_id: string;
          project_name: string;
          document_type: string;
          document_type_uuid: string;
          status: string;
          organization_name: string;
          createdAt: string;
          project_id: string;
          email: string;
          s3_url: string;
        }[];
      },
      void
    >({
      query: () => `/getAll-review-document`,
    }),

    // 2. Get a specific review document
    get_review_document: builder.mutation<
      {
        filename: string;
        docxBase64: string;
      },
      {
        project_id: string;
        document_type_uuid: string;
      }
    >({
      query: (body) => ({
        url: `/get-review-document`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAll_review_documentsQuery,
  useGet_review_documentMutation,
} = reviewDocumentsApi;
