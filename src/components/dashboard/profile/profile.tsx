import { FC, ReactElement } from 'react'
import {
  AdditionalInfoInt,
  useGetAssetsQuery,
} from '../../../lib/api/user/userEndPoints'
import AssetTable from '../../tables/assetTable'

interface props {
  additionalData: AdditionalInfoInt | undefined
}

const Profile: FC<props> = ({ additionalData }): ReactElement => {
  const { data: assetsData, isFetching: isAssetsFetching } = useGetAssetsQuery()
  return (
    <section className='ml-3'>
      <div className='flex gap-40'>
        <div>
          <h1 className=' text-xl  mb-10 text-[#31b0d5]'>User information</h1>
          <div className='text-lg '>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px]'>Job title</p>
              <p className='text-blue-500'> {additionalData?.jobTitle} </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px]'>Address</p>
              <p className='text-blue-500'> {additionalData?.address} </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px]'>Postal code</p>
              <p className='text-blue-500'> {additionalData?.postalCode} </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px]'>City</p>
              <p className='text-blue-500'> {additionalData?.city} </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px]'>Country</p>
              <p className='text-blue-500'> {additionalData?.country} </p>
            </div>
            <div className='flex flex-row items-center gap-5 '>
              <p className='w-[150px]'>Phone</p>
              <p className='text-blue-500'> {additionalData?.phone} </p>
            </div>
          </div>
        </div>
        <div className=''>
          <h1 className=' text-xl mb-5 text-[#31b0d5]'>Assets information</h1>
          <AssetTable data={assetsData?.data} isFetching={isAssetsFetching} />
        </div>
      </div>
    </section>
  )
}

export default Profile
