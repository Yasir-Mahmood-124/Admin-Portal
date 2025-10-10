import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface PaymentRecord {
  index_id: string;
  currency: string;
  amount_total: string;
  plan_name: string;
  credits: string;
  payment_at: string;
  payment_status: string;
  email: string;
  country: string;
  name?: string;
  lookup_key?: string;
}

interface UserPaymentData {
  records: PaymentRecord[];
  total_spent: number;
}

interface PaymentDataResponse {
  success: boolean;
  data: Record<string, UserPaymentData>;
}

export const paymentHistoryApi = createApi({
  reducerPath: "paymentHistoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://o3uzr46ro5.execute-api.us-east-1.amazonaws.com/cammi-dev",
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPaymentHistory: builder.query<PaymentDataResponse, void>({
      query: () => ({
        url: "/payment-data-superadminportal",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetPaymentHistoryQuery } = paymentHistoryApi;
