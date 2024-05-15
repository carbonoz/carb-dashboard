import { baseAPI } from '../api'

export interface LoginDTO {
  email: string
  password: string
}

export interface AuthResponse {
  data: {
    token: string
    user: AuthInt
  }
}

export interface AuthInt {
  id: string
  createdAt: string
  updatedAt: string
  active: boolean
  role: string
  email: string
}

const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDTO>({
      query: (DTO) => ({
        url: `/auth/login/`,
        method: 'POST',
        body: DTO,
      }),
    }),
  }),
})

export const { useLoginMutation } = authApi
