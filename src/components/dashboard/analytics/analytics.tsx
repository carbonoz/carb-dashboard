import { FC, ReactElement, useEffect, useState } from 'react'
import {
  energyInt,
  useGetEnergyFor12MonthsQuery,
  useGetEnergyFor30DaysQuery,
  useGetEnergyForLast10YearsQuery,
  useGetEnergyQuery,
} from '../../../lib/api/Analytics/analyticsEndpoints'
import { GeneralContentLoader } from '../../common/loader/loader'
import EnergyTable from '../../tables/energyTable'
import AnalyticsCard from '../common/cards/card'

const Analytics: FC = (): ReactElement => {
  const { data, isFetching, refetch } = useGetEnergyQuery({})
  const {
    data: monthlyData,
    isFetching: fetching,
    refetch: refechMonthly,
  } = useGetEnergyFor30DaysQuery({})

  const {
    data: yearlyData,
    isFetching: yearlyFetching,
    refetch: yearlyRefetch,
  } = useGetEnergyFor12MonthsQuery()

  const {
    data: decadeData,
    isFetching: decadeFetching,
    refetch: decadeRefetch,
  } = useGetEnergyForLast10YearsQuery()

  const pastSevenDays = data ? [...data.data].reverse() : []
  const pastThirtyDays = monthlyData ? [...monthlyData.data].reverse() : []

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    refetch()
    refechMonthly()
    yearlyRefetch()
    decadeRefetch()
  }, [refetch, refechMonthly, yearlyRefetch, decadeRefetch])

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: monthlyData?.data?.length || 0,
    onChange: (page: number, pageSize?: number) => {
      setCurrentPage(page)
      if (pageSize) {
        setPageSize(pageSize)
      }
    },
  }

  const calculateTotalLoadPower = (data: Array<energyInt> | undefined) =>
    data?.reduce((total, item) => {
      const loadPowerValue = parseFloat(item.loadPower.replace(/[^0-9.]/g, ''))
      return total + (isNaN(loadPowerValue) ? 0 : loadPowerValue)
    }, 0)

  const totalLoadPower = calculateTotalLoadPower(data?.data)
  const totalLoadPower30 = calculateTotalLoadPower(monthlyData?.data)
  const totalLoadPowerMonthly = calculateTotalLoadPower(yearlyData?.data)

  if (isFetching || fetching || yearlyFetching || decadeFetching) {
    return <GeneralContentLoader />
  }

  return (
    <section className='w-[100%]'>
      <div className=''>
        <h1 className=' text-xl mb-10 text-[#C1CF16] font-bold'>Analytics</h1>
        <section className='grid grid-cols-3 mb-10 w-[100%] gap-2'>
          <AnalyticsCard
            data={totalLoadPower?.toFixed(1)}
            title='For past 7 days'
          />
          <AnalyticsCard
            data={totalLoadPower30?.toFixed(1)}
            title='For past 30 days'
          />
          <AnalyticsCard
            data={totalLoadPowerMonthly?.toFixed(1)}
            title='For past 12 months'
          />
        </section>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className=' text-xl text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Energy information <span className='pl-5'>( Last 7 days)</span>
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <EnergyTable data={pastSevenDays} isFetching={isFetching} />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className=' text-xl text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Energy information <span className='pl-5'>( Last 30 days)</span>
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <EnergyTable
            data={pastThirtyDays}
            isFetching={isFetching}
            type='monthly'
            pagination={paginationConfig}
          />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className=' text-xl text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Energy information <span className='pl-5'>( Last 12 months)</span>
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <EnergyTable
            data={yearlyData?.data}
            isFetching={isFetching}
            type='yearly'
          />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 rounded-2xl'>
        <h1 className=' text-xl text-[#C1CF16] font-bold p-5 bg-[#1C2834] rounded-t-2xl '>
          Energy information <span className='pl-5'>( Last 10 years)</span>
        </h1>
        <div className='border-t-[1px] border-gray-300 ' />
        <div className='p-5'>
          <EnergyTable
            data={decadeData?.data}
            isFetching={isFetching}
            type='decade'
          />
        </div>
      </div>
    </section>
  )
}

export default Analytics
