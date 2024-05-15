import { FC, ReactElement } from 'react'
import { useGetEnergyQuery } from '../../../lib/api/Analytics/analyticsEndpoints'
import EnergyTable from '../../tables/energyTable'

const Analytics: FC = (): ReactElement => {
  const { data, isFetching } = useGetEnergyQuery()

  return (
    <section>
      <h1 className=' text-xl  ml-3 mb-10 text-[#31b0d5]'>Analytics</h1>
      <EnergyTable data={data?.data} isFetching={isFetching} />
    </section>
  )
}

export default Analytics
