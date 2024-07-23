import { FC, ReactElement } from 'react'
import { useGetTopicsQuery } from '../../../lib/api/topic/topicEndpints'

const Settings: FC = (): ReactElement => {
  const { data } = useGetTopicsQuery()

  return (
    <section className='ml-3'>
      <h1 className=' text-3xl   mb-10 text-[#c1cf16] font-bold'>Settings</h1>
      <div className='mt-5 flex flex-row items-center gap-5 text-base'>
        <p className='text-[#c1cf16]  font-semibold '>Topic name</p>
        <p> {data?.data?.topicName} </p>
      </div>
    </section>
  )
}

export default Settings
