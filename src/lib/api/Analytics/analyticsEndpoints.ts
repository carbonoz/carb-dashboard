import { baseAPI } from '../api'

export interface EnergyData {
  message: string
  data: Array<energyInt>
}

export interface energyInt {
  id: string
  pvPower: string
  loadPower: string
  gridIn: string
  gridOut: string
  batteryCharged: string
  batteryDischarged: string
  date: string
  topic: string | null
  userId: string
}

const energyEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEnergy: builder.query<EnergyData, void>({
      providesTags: ['Energy'],
      query: () => ({
        url: `energy/energy-data`,
        method: 'GET',
      }),
    }),
    getEnergyFor30Days: builder.query<EnergyData, void>({
      providesTags: ['Energy'],
      query: () => ({
        url: `energy/total/30`,
        method: 'GET',
      }),
    }),
    getEnergyFor12Months: builder.query<EnergyData, void>({
      providesTags: ['Energy'],
      query: () => ({
        url: `energy/total/12`,
        method: 'GET',
      }),
    }),
    getEnergyForLast10Years: builder.query<EnergyData, void>({
      providesTags: ['Energy'],
      query: () => ({
        url: `energy/total/year/10`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetEnergyQuery,
  useGetEnergyFor30DaysQuery,
  useGetEnergyFor12MonthsQuery,
  useGetEnergyForLast10YearsQuery,
} = energyEndpoints
