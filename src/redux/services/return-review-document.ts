//redux/services/return-review-document.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define the base URL for your API Gateway endpoint
const BASE_URL =
  "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev";

export interface ReturnReviewDocumentRequest {
  project_id: string;
  document_type_uuid: string;
  feedback?: string;
  document_text?: string; // base64 string
}

export interface ReturnReviewDocumentResponse {
  message: string;
  status: string;
  feedback_added: boolean;
  returned_document_uploaded: boolean;
  returned_s3_url: string;
  presigned_download_url?: string;
  email_sent: boolean;
  email_response?: Record<string, any>;
}

// Define the API
export const returnReviewDocumentApi = createApi({
  reducerPath: "returnReviewDocumentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    returnReviewDocument: builder.mutation<
      ReturnReviewDocumentResponse,
      ReturnReviewDocumentRequest
    >({
      query: (body) => ({
        url: "/return-review-document",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export the mutation hook
export const { useReturnReviewDocumentMutation } = returnReviewDocumentApi;
