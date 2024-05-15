import { FC, ReactElement } from 'react'
import { useGetTopicsQuery } from '../../../lib/api/topic/topicEndpints'

const Settings: FC = (): ReactElement => {
  const { data } = useGetTopicsQuery()

  return (
    <section className='ml-3'>
      <h1 className=' text-xl   mb-10 text-[#31b0d5]'>Settings</h1>
      <div className='mt-5 flex flex-row items-center gap-5 text-base'>
        <p className='text-[#31b0d5] font-bold '>Topic name</p>
        <p> {data?.data.topicName} </p>
      </div>
    </section>
  )
}

export default Settings
