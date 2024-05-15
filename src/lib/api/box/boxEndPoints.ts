/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from '../api'

const boxEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBoxes: builder.query<any, any>({
      providesTags: ['Box'],
      query: () => ({
        url: `box/retrieve`,
        method: 'GET',
      }),
    }),
  }),
})

export const { useGetBoxesQuery } = boxEndpoints
