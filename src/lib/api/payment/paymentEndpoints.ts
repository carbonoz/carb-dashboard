import { baseAPI } from '../api'

export interface CreatePaymentDTO {
  amount: number
  currency?: string
  description?: string
}

export interface PaymentResponse {
  data: {
    payment: {
      id: string
      amount: number
      currency: string
      status: string
      paypalOrderId: string
      userId: string
      createdAt: string
      updatedAt: string
    }
    paypalOrder: {
      id: string
      status: string
      links: Array<{
        href: string
        rel: string
        method: string
      }>
    }
    approvalUrl?: string
  }
}

export interface CapturePaymentDTO {
  paypalOrderId: string
}

export interface CapturePaymentResponse {
  data: {
    payment: {
      id: string
      amount: number
      currency: string
      status: string
      paypalOrderId: string
      transactionId?: string
      userId: string
      createdAt: string
      updatedAt: string
    }
    captureResponse: {
      id: string
      status: string
      purchase_units: Array<{
        payments: {
          captures: Array<{
            id: string
            status: string
            amount: {
              currency_code: string
              value: string
            }
          }>
        }
      }>
    }
    success: boolean
  }
}

export interface UserPayment {
  id: string
  amount: number
  currency: string
  status: string
  planId: string
  billingType: string
  createdAt: string
  updatedAt: string
  paypalOrderId?: string
}

export interface UserPaymentsResponse {
  data: {
    items: UserPayment[]
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface PaymentDetailsResponse {
  data: UserPayment
}

export interface PaginationDTO {
  page?: string
  size?: string
}

interface FilterPayments extends PaginationDTO {
  status?: string
}

const paymentApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<PaymentResponse, CreatePaymentDTO>({
      query: (DTO) => ({
        url: `/payment/create`,
        method: 'POST',
        body: DTO,
      }),
      invalidatesTags: ['Payment'],
    }),
    capturePayment: builder.mutation<CapturePaymentResponse, CapturePaymentDTO>({
      query: (DTO) => ({
        url: `/payment/capture`,
        method: 'POST',
        body: DTO,
      }),
      invalidatesTags: ['Payment'],
    }),
    getUserPayments: builder.query<UserPaymentsResponse, FilterPayments>({
      query: ({ page = '', size = '', status = '' }) => ({
        url: `/payment/user-payments?page=${page}&size=${size}&status=${status}`,
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
    getPaymentById: builder.query<PaymentDetailsResponse, string>({
      query: (id) => ({
        url: `/payment/${id}`,
        method: 'GET',
      }),
      providesTags: ['Payment'],
    }),
    cancelPayment: builder.mutation<{ data: { message: string } }, string>({
      query: (id) => ({
        url: `/payment/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
})

export const {
  useCreatePaymentMutation,
  useCapturePaymentMutation,
  useGetUserPaymentsQuery,
  useGetPaymentByIdQuery,
  useCancelPaymentMutation,
} = paymentApi