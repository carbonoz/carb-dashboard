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

export interface filterDateDto {
  from?: string
  to?: string
}

export interface csvfileFormat {
  date: number
}

const energyEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getEnergy: builder.query<EnergyData, filterDateDto>({
      providesTags: ['Energy'],
      query: (dto) => {
        const baseUrl = 'energy/energy-data'
        const queryString =
          dto && dto.from && dto.to
            ? `?from=${encodeURIComponent(dto.from)}&to=${encodeURIComponent(
                dto.to
              )}`
            : ''

        return {
          url: `${baseUrl}${queryString}`,
          method: 'GET',
        }
      },
    }),
    getEnergyFor30Days: builder.query<EnergyData, filterDateDto>({
      providesTags: ['Energy'],
      query: (dto) => {
        const baseUrl = 'energy/total/30'
        const queryString =
          dto && dto.from && dto.to
            ? `?from=${encodeURIComponent(dto.from)}&to=${encodeURIComponent(
                dto.to
              )}`
            : ''

        return {
          url: `${baseUrl}${queryString}`,
          method: 'GET',
        }
      },
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
    downloadCSV: builder.mutation<Blob, csvfileFormat>({
      query: ({ date }) => ({
        url: `reports/download/csv/${date}`,
        method: 'GET',
        headers: {
          'content-type': 'application/octet-stream',
        },
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
})

export const {
  useGetEnergyQuery,
  useGetEnergyFor30DaysQuery,
  useGetEnergyFor12MonthsQuery,
  useGetEnergyForLast10YearsQuery,
  useDownloadCSVMutation,
} = energyEndpoints
