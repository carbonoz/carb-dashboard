import { ESteps } from '../../../config/constant'
import { baseAPI } from '../api'

export interface stepDTO {
  step: ESteps
}

export interface StepData {
  message: string
  data: Array<stepInt>
}

export interface stepInt {
  id: string
  userId: string
  step: ESteps
  status: boolean
  createdAt: string
  updatedAt: string
  isFile: boolean | undefined
  hasSkipped: boolean
}

export const stepsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    makeStep: builder.mutation<unknown, stepDTO>({
      invalidatesTags: ['Steps'],
      query: (DTO) => ({
        url: `/steps/step`,
        method: 'POST',
        body: DTO,
      }),
    }),
    getSteps: builder.query<StepData, void>({
      providesTags: ['Steps'],
      query: () => ({
        url: `/steps/step`,
        method: 'GET',
      }),
    }),
    skipStep: builder.mutation<unknown, stepDTO>({
      invalidatesTags: ['Steps'],
      query: (DTO) => ({
        url: `/steps/skip-step`,
        method: 'POST',
        body: DTO,
      }),
    }),
  }),
})

export const { useMakeStepMutation, useGetStepsQuery, useSkipStepMutation } =
  stepsApi
