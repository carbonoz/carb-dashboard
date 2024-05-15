import { baseAPI } from '../api'

export interface EnergyData {
  message: string
  data: Array<energyInt>
}

export interface energyInt {
  id: string
  pvPower: number
  loadPower: number
  gridPowerUsed: number | null
  gridPowerExposed: number | null
  batteryCharged: number | null
  batteryDischarged: number | null
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
  }),
})

export const { useGetEnergyQuery } = energyEndpoints
