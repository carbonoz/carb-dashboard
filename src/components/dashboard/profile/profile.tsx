import { Form } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import {
  AdditionalInfoInt,
  additionalInfoInt,
  useEditAdditionalInfoMutation,
  useGetAssetsQuery,
} from '../../../lib/api/user/userEndPoints'
import CustomButton from '../../common/button/button'
import CustomImage from '../../common/image/customImage'
import { GeneralContentLoader } from '../../common/loader/loader'
import CustomModal from '../../common/modal/customModal'
import EditUserInformationForm from '../../forms/edituserInfo'

interface props {
  additionalData: AdditionalInfoInt | undefined
  loading: boolean
}

const Profile: FC<props> = ({ additionalData }): ReactElement => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const {
    data: assetsData,
    isFetching: isAssetsFetching,
    refetch,
  } = useGetAssetsQuery()

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleCancel = () => {
    setIsVisible(false)
  }

  const [editAdditionalInfo, { isLoading }] = useEditAdditionalInfoMutation()

  const [form] = Form.useForm()

  const onFinish = (values: additionalInfoInt) => {
    handleAPIRequests({
      request: editAdditionalInfo,
      ...values,
      onSuccess: handleCancel,
    })
  }

  if (isAssetsFetching) {
    return <GeneralContentLoader />
  }

  return (
    <>
      <CustomModal
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        title={'Edit user information'}
        width={1000}
        handleCancel={handleCancel}
        footerContent={
          <CustomButton
            type='primary'
            htmlType='submit'
            form='edit-user-info-form'
            className='h-[50px] w-[70px]'
            loading={isLoading}
          >
            Save
          </CustomButton>
        }
      >
        <EditUserInformationForm
          form={form}
          data={additionalData}
          onFinish={onFinish}
        />
      </CustomModal>
      <section className='w-[100%]'>
        <div className='border border-gray-300  dark:border-gray-600 rounded-2xl w-[100%]'>
          <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
            <h1 className=' text-xl  text-[#C1CF16] font-bold  rounded-t-2xl '>
              User information
            </h1>
            <FaRegEdit
              color='#C1CF16'
              size={25}
              className=' cursor-pointer'
              onClick={() => setIsVisible(true)}
            />
          </div>
          <div className='border-t-[1px] border-gray-300  dark:border-gray-600 ' />
          <div className='p-5 '>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px] font-bold'>First name</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.firstName}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px] font-bold'>Last name</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.lastName}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px] font-bold'>Street</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.street}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px] font-bold'>Telephone</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.telephone}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 mb-1 '>
              <p className='w-[150px] font-bold'>City</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.city}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 '>
              <p className='w-[150px] font-bold'>Language</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.customerLanguage}{' '}
              </p>
            </div>
            <div className='flex flex-row items-center gap-5 '>
              <p className='w-[150px] font-bold'>Timezone</p>
              <p className='text-black dark:text-white'>
                {' '}
                {additionalData?.customerTimezone}{' '}
              </p>
            </div>
          </div>
        </div>
        <div className='mt-8 border border-gray-300  dark:border-gray-600 rounded-2xl'>
          <h1 className='  text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
            Assets information
          </h1>
          <div className='border-t-[1px] border-gray-300   dark:border-gray-600' />
          <div className='p-5'>
            <section className='mt-5'>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Asset Name</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.assetName}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Asset Owner</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.assetOwner}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Country</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.country}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Capacity (kWp)</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.capacityKwp}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Fuel Type</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.fuelType}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Panel Brand</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.panelBrand}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Inverter Brand</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.inverterBrand}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Amount of Inverters</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.amountOfInverters}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Amount of Panels</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.amountOfPanels}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Battery Serial Numbers</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.BatterySerialNumber1},{' '}
                  {assetsData?.data?.BatterySerialNumber2},{' '}
                  {assetsData?.data?.BatterySerialNumber3}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Inverter Serial Numbers</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.InverterSerialnumber1},{' '}
                  {assetsData?.data?.InverterSerialnumber2},{' '}
                  {assetsData?.data?.InverterSerialnumber3}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5 mb-1'>
                <p className='w-[250px] font-bold'>Monitoring System</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.monitoringSystemName}
                </p>
              </div>
              <div className='flex flex-row items-center gap-5'>
                <p className='w-[250px] font-bold'>Monitoring URL</p>
                <p className='text-black dark:text-white'>
                  {assetsData?.data?.monitoringSystemURL}
                </p>
              </div>
            </section>

            <section className='grid xl:grid-cols-3  lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 w-[100%]  gap-1'>
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
    </>
  )
}

export default Profile
