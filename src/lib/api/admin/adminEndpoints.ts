import { ERoles, EUserStatus } from '../../../config/constant'
import { baseAPI } from '../api'
import { AuthInt, SignupDTO } from '../Auth/authEndpoints'

export interface AccountUser {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  activeStatus: boolean
  role: ERoles
  email: string
  firstName: string
  lastName: string
  customerTimezone: string
}

interface UsersResponse {
  message: string
  data: {
    items: AccountUser[]
    totalItems: number
    itemCount: number
    itemsPerPage: number
    totalPages: number
    currentPage: number
  }
}

export interface PaginationDTO {
  page?: string
  size?: string
}

interface filterUsers extends PaginationDTO {
  status?: string
}

export interface toogleActivationResponse {
  message: string
  affectedAccount: number
}

export interface toogleAccountDto {
  userIds: string[]
  status: string
}

export interface AdminAuthResponse {
  data: {
    token: string
    user: AuthInt
  }
}

const adminEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UsersResponse, filterUsers>({
      providesTags: ['Users'],
      query: ({ page = '', size = '', status }) => ({
        url: `admin/users?page=${page}&limit=${size}&status=${
          status || EUserStatus.ENABLED
        }`,
        method: 'GET',
      }),
    }),
    toogleActivation: builder.mutation<
      toogleActivationResponse,
      toogleAccountDto
    >({
      invalidatesTags: ['Users'],
      query: (DTO) => ({
        url: `admin/toogle-activation`,
        method: 'PATCH',
        body: DTO,
      }),
    }),
    addNewUser: builder.mutation<AdminAuthResponse, SignupDTO>({
      invalidatesTags: ['Users'],
      query: (DTO) => ({
        url: `admin/sign-users`,
        method: 'POST',
        body: DTO,
      }),
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useToogleActivationMutation,
  useAddNewUserMutation,
} = adminEndpoints
