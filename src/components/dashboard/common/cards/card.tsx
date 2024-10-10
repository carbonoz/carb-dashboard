import { FC } from 'react'
import { SlEnergy } from 'react-icons/sl'

interface AnalyticsCardProps {
  data: string | undefined
  title?: string
}

const AnalyticsCard: FC<AnalyticsCardProps> = ({ data, title }) => {
  return (
    <div className='h-40 w-[100%] bg-[#1C2834] text-[#C1CF16] rounded-xl p-5 relative'>
      <div className='flex 2xl:flex-row xl:gap-5 lg:gap-3 xl:flex-row xl:items-center lg:flex-col  2xl:items-center flex-col'>
        <SlEnergy size={50} />
        <div>
          <p className='text-3xl'>
            {data} <span className='text-xl'>Kwh</span>{' '}
          </p>
          <div className='text-white'> Load power {title}</div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCard
