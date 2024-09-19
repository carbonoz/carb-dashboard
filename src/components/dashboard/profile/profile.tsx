import { FC, ReactElement, useEffect } from 'react'
import {
  AdditionalInfoInt,
  useGetAssetsQuery,
  useGetUserPortsQuery,
} from '../../../lib/api/user/userEndPoints'
import CustomImage from '../../common/image/customImage'
import { GeneralContentLoader } from '../../common/loader/loader'

interface props {
  additionalData: AdditionalInfoInt | undefined
  loading: boolean
}

const Profile: FC<props> = ({ additionalData, loading }): ReactElement => {
  const { data, refetch: refetchPort } = useGetUserPortsQuery()

  const {
    data: assetsData,
    isFetching: isAssetsFetching,
    refetch,
  } = useGetAssetsQuery()

  useEffect(() => {
    refetchPort()
    refetch()
  }, [refetchPort, refetch])

  if (loading || isAssetsFetching) {
    return <GeneralContentLoader />
  }

  return (
    <section className=''>
      <div className='border border-gray-300  rounded-2xl'>
        <h1 className=' text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          User information
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='  p-5'>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>First name</p>
            <p className='text-black'> {additionalData?.firstName} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Last name</p>
            <p className='text-black'> {additionalData?.lastName} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Street</p>
            <p className='text-black'> {additionalData?.street} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>Telephone</p>
            <p className='text-black'> {additionalData?.telephone} </p>
          </div>
          <div className='flex flex-row items-center gap-5 mb-1 '>
            <p className='w-[150px] font-bold'>City</p>
            <p className='text-black'> {additionalData?.city} </p>
          </div>
          <div className='flex flex-row items-center gap-5 '>
            <p className='w-[150px] font-bold'>Language</p>
            <p className='text-black'> {additionalData?.customerLanguage} </p>
          </div>
          <div className='flex flex-row items-center gap-5 '>
            <p className='w-[150px] font-bold'>Timezone</p>
            <p className='text-black'> {additionalData?.customerTimezone} </p>
          </div>
        </div>
      </div>
      <div className='border mt-8 border-gray-300  rounded-2xl'>
        <h1 className=' text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Device
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className=' p-5 flex 3xl:flex-row  2xl:flex-row  xl:flex-col lg:flex-col md:flex-col lg:gap-10'>
          <section>
            <div>
              <p className='  flex  flex-row items-center'>
                <span className='text-black font-bold w-[150px] '>
                  Mqtt host :{' '}
                </span>
                <span>{data?.data[0]?.port}</span>
              </p>
              <p className='  flex  flex-row items-center mt-5'>
                <span className='text-black font-bold w-[150px] '>
                  Mqtt port :{' '}
                </span>
                <span>{data?.data[0]?.mqttPort}</span>
              </p>
              <p className='  flex  flex-row items-center mt-5'>
                <span className='text-black font-bold w-[150px] '>
                  Mqtt Username :{' '}
                </span>
                <span>{data?.data[0]?.mqttUsername}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className='  text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Assets information
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <section className='mt-5'>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Asset Name</p>
              <p className='text-black'>{assetsData?.data?.assetName}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Asset Owner</p>
              <p className='text-black'>{assetsData?.data?.assetOwner}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Country</p>
              <p className='text-black'>{assetsData?.data?.country}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Capacity (kWp)</p>
              <p className='text-black'>{assetsData?.data?.capacityKwp}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Fuel Type</p>
              <p className='text-black'>{assetsData?.data?.fuelType}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Panel Brand</p>
              <p className='text-black'>{assetsData?.data?.panelBrand}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Inverter Brand</p>
              <p className='text-black'>{assetsData?.data?.inverterBrand}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Amount of Inverters</p>
              <p className='text-black'>
                {assetsData?.data?.amountOfInverters}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Amount of Panels</p>
              <p className='text-black'>{assetsData?.data?.amountOfPanels}</p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Battery Serial Numbers</p>
              <p className='text-black'>
                {assetsData?.data?.BatterySerialNumber1},{' '}
                {assetsData?.data?.BatterySerialNumber2},{' '}
                {assetsData?.data?.BatterySerialNumber3}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Inverter Serial Numbers</p>
              <p className='text-black'>
                {assetsData?.data?.InverterSerialnumber1},{' '}
                {assetsData?.data?.InverterSerialnumber2},{' '}
                {assetsData?.data?.InverterSerialnumber3}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1'>
              <p className='w-[250px] font-bold'>Monitoring System</p>
              <p className='text-black'>
                {assetsData?.data?.monitoringSystemName}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5'>
              <p className='w-[250px] font-bold'>Monitoring URL</p>
              <p className='text-black'>
                {assetsData?.data?.monitoringSystemURL}
              </p>
            </div>
          </section>

          <section className='flex flex-row items-center gap-5'>
            <div className='mt-5'>
              <p className='font-bold'>Building Photo:</p>
              <CustomImage
                src={assetsData?.data?.buildingPhotoUpload}
                className='mt-2 rounded-lg'
                width={300}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='mt-5'>
              <p className='font-bold'>Inverter Setup Photo:</p>
              <CustomImage
                src={assetsData?.data?.inverterSetupPhotoUpload}
                className='mt-2 rounded-lg'
                width={300}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className='mt-5'>
              <p className='font-bold'>Solar Panels Photo:</p>
              <CustomImage
                src={assetsData?.data?.solarPanelsPhotoUpload}
                className='mt-2 rounded-lg'
                width={300}
                height={200}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

export default Profile
