import { FC } from 'react'

interface AnalyticsCardProps {
  data: string | undefined
  title?: string
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ data, title }) => {
  return (
    <div className='h-40 w-[100%] bg-[#1C2834] text-[#C1CF16] rounded-xl p-5 relative'>
      <div className='flex lg:justify-between flex-col items-center'>
        <p className='text-3xl'>
          {data} <span className='text-xl'>Kwh</span>{' '}
        </p>
        <div className='text-white'> Load power {title}</div>
      </div>
    </div>
  )
}

export default AnalyticsCard
