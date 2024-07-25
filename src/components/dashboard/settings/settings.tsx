import { FC, ReactElement } from 'react'
import { useGetTopicsQuery } from '../../../lib/api/topic/topicEndpints'

const Settings: FC = (): ReactElement => {
  const { data } = useGetTopicsQuery()

  return (
    <section className=''>
      <div className='border border-gray-300  rounded-2xl'>
        <h1 className=' text-xl text-[#c1cf16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Settings
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='mt-5 flex flex-row items-center gap-5 text-base p-5'>
          <p className='text-[#c1cf16]  font-semibold '>Topic name :</p>
          <p> {data?.data?.topicName} </p>
        </div>
      </div>
    </section>
  )
}

export default Settings
