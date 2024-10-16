import { FC, ReactElement, useState } from 'react'
import { FiCopy, FiEye, FiEyeOff } from 'react-icons/fi'
import { useGetTopicsQuery } from '../../../lib/api/topic/topicEndpints'
import { useGetCredentialsQuery } from '../../../lib/api/user/userEndPoints'
import { GeneralContentLoader } from '../../common/loader/loader'
import Notify from '../../common/notification/notification'

const Settings: FC = (): ReactElement => {
  const { data, isFetching } = useGetTopicsQuery()
  const { data: credentials, isFetching: fetching } = useGetCredentialsQuery()

  const [showClientSecret, setShowClientSecret] = useState(false)

  const handleCopy = (text: string) => {
    navigator?.clipboard?.writeText(text)
    Notify({
      message: 'Success',
      description: 'Text copied successfully',
    })
  }

  if (isFetching || fetching) {
    return <GeneralContentLoader />
  }

  return (
    <section>
      <div className='border border-gray-300 rounded-2xl'>
        <h1 className='text-xl text-[#c1cf16] font-bold p-5 bg-[#1C2834] rounded-t-2xl'>
          Settings
        </h1>
        <div className='border-t-[1px] border-gray-300' />
        <div className='mt-5 flex flex-row items-center gap-5 text-base p-5'>
          <p className='text-black font-semibold'>Topic name:</p>
          <p>{data?.data?.topicName}</p>
        </div>
      </div>

      <div className='mt-10' />

      <div className='border border-gray-300 rounded-2xl'>
        <h1 className='text-xl text-[#c1cf16] font-bold p-5 bg-[#1C2834] rounded-t-2xl'>
          Credentials
        </h1>
        <div className='border-t-[1px] border-gray-300' />

        <div className='mt-5 p-5'>
          <div className='flex flex-row items-center justify-between gap-5'>
            <p className='text-black font-semibold'>Client ID:</p>
            <div className='flex items-center gap-3'>
              <p className='font-mono'>{credentials?.data?.clientId}</p>
              <FiCopy
                size={18}
                onClick={() => handleCopy(credentials?.data?.clientId || '')}
                className='text-[#c1cf16] cursor-pointer'
              />
            </div>
          </div>

          <div className='flex flex-row items-center justify-between gap-5 mt-5'>
            <p className='text-black font-semibold'>Client Secret:</p>
            <div className='flex items-center gap-3'>
              <p className='font-mono'>
                {showClientSecret
                  ? credentials?.data?.clientSecret
                  : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
              </p>
              {showClientSecret ? (
                <FiEyeOff
                  size={18}
                  onClick={() => setShowClientSecret(!showClientSecret)}
                  className='text-[#c1cf16] cursor-pointer'
                />
              ) : (
                <FiEye
                  size={18}
                  onClick={() => setShowClientSecret(!showClientSecret)}
                  className='text-[#c1cf16] cursor-pointer'
                />
              )}
              <FiCopy
                size={18}
                className='text-[#c1cf16] cursor-pointer'
                onClick={() =>
                  handleCopy(credentials?.data?.clientSecret || '')
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Settings
