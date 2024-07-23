import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getFromLocal } from '../../helpers/handleStorage'

const BASE_URL = 'http://localhost:9000/api/v1'

export const baseAPI = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers: Headers): Headers => {
      const localToken = getFromLocal<string>('token')

      if (localToken) {
        headers.set('authorization', `Bearer ${localToken}`)
      }
      return headers
    },
  }),
  tagTypes: [
    'Energy',
    'Box',
    'Topic',
    'User',
    'Steps',
    'Assets',
    'Info',
    'File',
  ] as const,
  endpoints: () => ({}),
})
