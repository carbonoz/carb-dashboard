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
      <div className='ml-3'>
        <h1 className=' text-3xl  mb-10 text-[#C1CF16] font-bold'>Analytics</h1>
        <section className='flex flex-row items-center gap-5 mb-10'>
          <AnalyticsCard />
          <AnalyticsCard />
          <AnalyticsCard />
        </section>
      </div>
      <EnergyTable data={data?.data} isFetching={isFetching} />
    </section>
  )
}

export default Analytics
