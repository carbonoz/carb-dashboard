import { FC, ReactElement } from 'react'
import { useGetEnergyQuery } from '../../../lib/api/Analytics/analyticsEndpoints'
import { GeneralContentLoader } from '../../common/loader/loader'
import EnergyTable from '../../tables/energyTable'
import AnalyticsCard from '../common/cards/card'

const Analytics: FC = (): ReactElement => {
  const { data, isFetching } = useGetEnergyQuery()

  if (isFetching) {
    return <GeneralContentLoader />
  }

  return (
    <section className=''>
      <div className=''>
        <h1 className=' text-xl  mb-10 text-[#C1CF16] font-bold'>Analytics</h1>
        <section className='flex flex-row items-center gap-5 mb-10'>
          <AnalyticsCard />
          <AnalyticsCard />
          <AnalyticsCard />
        </section>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className='  text-xl  text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Energy information
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <EnergyTable data={data?.data} isFetching={isFetching} />
        </div>
      </div>
    </section>
  )
}

export default Analytics
