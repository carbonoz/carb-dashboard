import { FC, ReactElement, useEffect } from 'react'
import {
  useGetEnergyFor30DaysQuery,
  useGetEnergyQuery,
} from '../../../lib/api/Analytics/analyticsEndpoints'
import { GeneralContentLoader } from '../../common/loader/loader'
import Last30DaysGraph from './30days/PastThirtyDays'
import Last7DaysGraph from './7days/PastSevenDays'

const EnergyChart: FC = (): ReactElement => {
  const { data, isFetching, refetch } = useGetEnergyQuery()
  const {
    data: monthlyData,
    isFetching: fetching,
    refetch: refechMonthly,
  } = useGetEnergyFor30DaysQuery()

  useEffect(() => {
    refetch()
    refechMonthly()
  }, [refetch, refechMonthly])

  if (isFetching || fetching) {
    return <GeneralContentLoader />
  }

  return (
    <section className='w-[100%]'>
      <div className=''>
        <h1 className=' text-xl mb-10 text-[#C1CF16] font-bold'>
          Energy graphs
        </h1>
        <section className='flex flex-col'>
          <div>
            <h2 className='text-lg font-bold mb-5'>Last 7 Days</h2>
            <Last7DaysGraph data={data?.data || []} />
          </div>
          <div>
            <h2 className='text-lg font-bold mb-5'>Last 30 Days</h2>
            <Last30DaysGraph data={monthlyData?.data || []} />
          </div>
        </section>
      </div>
    </section>
  )
}

export default EnergyChart
