import { baseAPI } from '../api'

export interface AssetResponse {
  message: string
  data: Array<assetInt>
}

export interface assetInt {
  id: string
  assetOwner: string
  assetName: string
  fuelType: string
  country: string
  address: string
  latitude: number
  longitude: number
  capacity: number
  userId: string
}
export interface AdditionalInfoResponse {
  message: string
  data: AdditionalInfoInt
}

export interface AdditionalInfoInt {
  id: string
  jobTitle: string
  names: string
  address: string
  postalCode: string
  city: string
  country: string
  phone: string
  userId: string
}

export interface AssetDTO {
  assetName: string
  assetOwner: string
  fuelType: string
  country: string
  address: string
  latitude: number
  longitude: number
  capacity: number
}

export interface additionalInfoInt {
  jobTitle: string
  names: string
  address: string
  postalCode: string
  city: string
  country: string
  phone: string
}

export interface getPortsResponse {
  message: string
  data: Array<getPort>
}

export interface getPort {
  id: string
  createdAt: string
  updatedAt: string
  mqttUsername: string
  mqttPassword: string
  mqttPort: number
  userId: string
  port: string
}

const userEndpoints = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAssets: builder.query<AssetResponse, void>({
      providesTags: ['Assets'],
      query: () => ({
        url: `user/assets`,
        method: 'GET',
      }),
    }),
    getAdditionalInfo: builder.query<AdditionalInfoResponse, void>({
      providesTags: ['Info'],
      query: () => ({
        url: `user/infos`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    addAsset: builder.mutation<unknown, AssetDTO>({
      invalidatesTags: ['Assets'],
      query: (DTO) => ({
        url: `user/asset`,
        method: 'POST',
        body: DTO,
      }),
    }),
    addAdditionalInfo: builder.mutation<unknown, additionalInfoInt>({
      invalidatesTags: ['Info'],
      query: (DTO) => ({
        url: `user/info`,
        method: 'POST',
        body: DTO,
      }),
    }),
    uploadRedexFile: builder.mutation<unknown, FormData>({
      invalidatesTags: ['File'],
      query: (DTO) => ({
        url: `user/redex-file`,
        method: 'POST',
        body: DTO,
      }),
    }),
    getUserPorts: builder.query<getPortsResponse, void>({
      providesTags: ['Ports'],
      query: () => ({
        url: `user/ports`,
        method: 'GET',
      }),
    }),
  }),
})

export const {
  useGetAssetsQuery,
  useGetAdditionalInfoQuery,
  useAddAssetMutation,
  useAddAdditionalInfoMutation,
  useUploadRedexFileMutation,
  useGetUserPortsQuery,
} = userEndpoints
