/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import { ImDownload } from 'react-icons/im'
import handleAPIRequests from '../../../helpers/handleApiRequest'
import { handleFileDownload } from '../../../helpers/handleFileDownload'
import {
  csvfileFormat,
  energyInt,
  useDownloadCSVMutation,
  useGetEnergyFor12MonthsQuery,
  useGetEnergyFor30DaysQuery,
  useGetEnergyForLast10YearsQuery,
  useGetEnergyQuery,
} from '../../../lib/api/Analytics/analyticsEndpoints'
import CustomButton from '../../common/button/button'
import FilterTimeZones from '../../forms/filterTimezone'
import EnergyTable from '../../tables/energyTable'
import AnalyticsCard from '../common/cards/card'

interface CustomInputProps {
  Timezone: string
}

const Analytics: FC = (): ReactElement => {
  const [form] = Form.useForm()
  const [timeZone, setTimeZone] = useState<string>('')
  const { data, isFetching, refetch } = useGetEnergyQuery({ timeZone })
  const [downloadingPeriod, setDownloadingPeriod] = useState<number | null>(
    null
  )
  const [downloadCsv, { isLoading }] = useDownloadCSVMutation()
  const {
    data: monthlyData,
    isFetching: fetching,
    refetch: refechMonthly,
  } = useGetEnergyFor30DaysQuery({ timeZone })

  const {
    data: yearlyData,
    isFetching: yearlyFetching,
    refetch: yearlyRefetch,
  } = useGetEnergyFor12MonthsQuery({ timeZone })

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

  const onDownload = (period: number) => {
    setDownloadingPeriod(period)
    const obj: csvfileFormat = { date: period }

    handleAPIRequests({
      request: downloadCsv,
      ...obj,
      notify: true,
      onSuccess: (file: Blob) => {
        const fileNames = {
          7: 'CSV-report-for-last-7-days',
          30: 'CSV-report-for-last-30-days',
          12: 'CSV-report-for-last-12-months',
        }
        handleFileDownload({
          name: fileNames[period as keyof typeof fileNames],
          file,
        })
      },
    })
  }

  const onFinish = (value: CustomInputProps) => {
    setTimeZone(value.Timezone)
  }

  return (
    <section className='w-[100%]'>
      <div className='w-[100%]'>
        <h1 className=' text-xl mb-10 text-[#C1CF16] font-bold'>Analytics</h1>
        <section className='grid 2xl:grid-cols-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 mb-10 w-[100%] gap-2'>
          <AnalyticsCard
            data={totalLoadPower?.toFixed(1)}
            title='For past 7 days'
            loading={isFetching || fetching || yearlyFetching || decadeFetching}
          />
          <AnalyticsCard
            data={totalLoadPower30?.toFixed(1)}
            title='For past 30 days'
            loading={isFetching || fetching || yearlyFetching || decadeFetching}
          />
          <AnalyticsCard
            data={totalLoadPowerMonthly?.toFixed(1)}
            title='For past 12 months'
            loading={isFetching || fetching || yearlyFetching || decadeFetching}
          />
        </section>
      </div>
      <div className='w-full'>
        <FilterTimeZones form={form} onFinish={onFinish} />
      </div>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            Energy information{' '}
            <span className='sm:pl-5 pl-1'>(Last 7 days)</span>
          </h1>

          <CustomButton
            type='primary'
            htmlType='button'
            loading={isLoading && downloadingPeriod === 7}
            onClick={() => onDownload(7)}
            icon={<ImDownload />}
          />
        </div>
        <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
        <div className='p-5'>
          <EnergyTable data={pastSevenDays} isFetching={isFetching} />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            Energy information{' '}
            <span className='sm:pl-5 pl-1'>(Last 30 days)</span>
          </h1>
          <CustomButton
            type='primary'
            htmlType='button'
            loading={isLoading && downloadingPeriod === 30}
            onClick={() => {
              onDownload(30)
            }}
            icon={<ImDownload />}
          />
        </div>
        <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
        <div className='p-5'>
          <EnergyTable
            data={pastThirtyDays}
            isFetching={isFetching}
            type='monthly'
            pagination={paginationConfig}
          />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            Energy information{' '}
            <span className='sm:pl-5 pl-1'>(Last 12 months)</span>
          </h1>
          <CustomButton
            type='primary'
            htmlType='button'
            loading={isLoading && downloadingPeriod === 12}
            onClick={() => {
              onDownload(12)
            }}
            icon={<ImDownload />}
          />
        </div>
        <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
        <div className='p-5'>
          <EnergyTable
            data={yearlyData?.data}
            isFetching={isFetching}
            type='yearly'
          />
        </div>
      </div>
      <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
        <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
          <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
            Energy information{' '}
            <span className='sm:pl-5 pl-1'>(Last 10 years)</span>
          </h1>
          <CustomButton
            type='primary'
            htmlType='button'
            disabled={true}
            icon={<ImDownload />}
          />
        </div>
        <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
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
