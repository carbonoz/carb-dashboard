import { baseAPI } from '../api'
import { AuthInt } from '../Auth/authEndpoints'

export interface BoxesResponse {
  message: string
  data: Array<boxInterface>
}

export interface boxInterface {
  id: string
  userId: string
  serialNumber: string
  photoProof: Array<string>
  user: AuthInt
}

export interface RegisterBoxDTO {
  serialNumber: string
  photoProof: Array<string>
}

const boxEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getBoxes: builder.query<BoxesResponse, void>({
      providesTags: ['Box'],
      query: () => ({
        url: `box/retrieve`,
        method: 'GET',
      }),
    }),
    registerBoxes: builder.mutation<unknown, RegisterBoxDTO>({
      invalidatesTags: ['Box'],
      query: (DTO) => ({
        url: `box/register`,
        method: 'POST',
        body: DTO,
      }),
    }),
  }),
})

export const { useGetBoxesQuery, useRegisterBoxesMutation } = boxEndpoints
