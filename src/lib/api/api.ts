import {
  BaseQueryApi,
  createApi,
  FetchArgs,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import { getFromLocal } from '../../helpers/handleStorage'

const BASE_URL = 'http://192.168.160.190/api/v1'

const baseQueryWithAuth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers: Headers): Headers => {
      const localToken = getFromLocal<string>('token')

      if (localToken) {
        headers.set('authorization', `Bearer ${localToken}`)
      }
      return headers
    },
  })

  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    window.location.href = '/login'
  }

  return result
}

export const baseAPI = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'Energy',
    'Box',
    'Topic',
    'User',
    'Steps',
    'Assets',
    'Info',
    'File',
    'Ports',
  ] as const,
  endpoints: () => ({}),
})
