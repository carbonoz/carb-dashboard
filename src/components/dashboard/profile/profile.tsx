import { FC, ReactElement, useEffect, useState } from 'react'
import {
  AdditionalInfoInt,
  useGetAssetsQuery,
} from '../../../lib/api/user/userEndPoints'
import AssetTable from '../../tables/assetTable'
import { boxInterface } from '../../../lib/api/box/boxEndPoints'
import { GeneralContentLoader } from '../../common/loader/loader'
import CustomImage from '../../common/image/customImage'

interface props {
  additionalData: AdditionalInfoInt | undefined
  boxesData: Array<boxInterface> | undefined
  loading: boolean
}

const Profile: FC<props> = ({
  additionalData,
  loading,
  boxesData,
}): ReactElement => {
  const { data: assetsData, isFetching: isAssetsFetching } = useGetAssetsQuery()

  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (
      boxesData &&
      boxesData.length > 0 &&
      boxesData[0].photoProof.length > 0
    ) {
      setSelectedImage(boxesData[0].photoProof[0])
    }
  }, [boxesData])

  if (loading) {
    return <GeneralContentLoader />
  }

  return (
    <section className=''>
      <div className='border border-gray-300  rounded-2xl'>
        <h1 className=' text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          User information
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='text-lg  p-5'>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Job title</p>
            <p className='text-black'> {additionalData?.jobTitle} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Address</p>
            <p className='text-black'> {additionalData?.address} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Postal code</p>
            <p className='text-black'> {additionalData?.postalCode} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>City</p>
            <p className='text-black'> {additionalData?.city} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Country</p>
            <p className='text-black'> {additionalData?.country} </p>
          </div>
          <div className='flex flex-row items-center gap-5 '>
            <p className='w-[150px] font-bold'>Phone</p>
            <p className='text-black'> {additionalData?.phone} </p>
          </div>
        </div>
      </div>
      <div className='border mt-8 border-gray-300  rounded-2xl'>
        <h1 className=' text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Device
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='text-lg  p-5 flex flex-row   gap-10'>
          <section>
            {selectedImage && (
              <div className='mb-4'>
                <CustomImage
                  src={selectedImage}
                  alt='Selected proof'
                  className='w-full h-auto rounded-lg'
                  width={682}
                  height={574}
                />
              </div>
            )}
            <div className='flex flex-row items-center gap-3  p-4 '>
              {boxesData
                ?.flatMap((box) => box.photoProof)
                .map((image, index) => (
                  <CustomImage
                    key={index}
                    src={image}
                    className={`border-[4px] hover:cursor-pointer rounded-lg ${
                      selectedImage === image
                        ? 'border-[#C1CF16]'
                        : 'border-transparent'
                    }`}
                    width={60}
                    height={60}
                    onClick={() => setSelectedImage(image)}
                  />
                ))}
            </div>
          </section>
          <section>
            {boxesData?.map((box, index) => {
              return (
                <div key={index}>
                  <h1 className='text-lg font-bold'>
                    <span className='text-[#C1CF16]'>Serial number : </span>
                    {box.serialNumber}
                  </h1>
                </div>
              )
            })}
          </section>
        </div>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className='  text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Assets information
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <AssetTable data={assetsData?.data} isFetching={isAssetsFetching} />
        </div>
      </div>
    </section>
  )
}

export default Profile
