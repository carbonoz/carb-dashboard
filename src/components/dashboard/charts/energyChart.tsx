/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import {
  useGetEnergyFor12MonthsQuery,
  useGetEnergyFor30DaysQuery,
  useGetEnergyQuery,
} from '../../../lib/api/Analytics/analyticsEndpoints'
import CustomInput from '../../common/input/customInput'
import { GeneralContentLoader } from '../../common/loader/loader'
import Last12MonthGraph from './12months/PastTwelveMonth'
import Last30DaysGraph from './30days/PastThirtyDays'
import Last7DaysGraph from './7days/PastSevenDays'

const EnergyChart: FC = (): ReactElement => {
  const [from, setFrom] = useState()
  const [to, setTo] = useState()

  const { data, isFetching, refetch } = useGetEnergyQuery(
    from && to ? { from, to } : {}
  )
  const {
    data: monthlyData,
    isFetching: fetching,
    refetch: refechMonthly,
  } = useGetEnergyFor30DaysQuery(from && to ? { from, to } : {})

  const {
    data: yearlyData,
    isFetching: yearlyFetching,
    refetch: yearlyRefetch,
  } = useGetEnergyFor12MonthsQuery({})

  useEffect(() => {
    refetch()
    refechMonthly()
    yearlyRefetch()
  }, [refetch, refechMonthly, yearlyRefetch])

  function onChangeFromDate(e: any) {
    setFrom(e)
  }
  function onChangeToDate(e: any) {
    setTo(e)
  }

  const [form] = Form.useForm()

  return (
    <section className='w-[100%]'>
      <div className=''>
        <section className='flex flex-col gap-5 mb-10'>
          <h1 className=' text-xl text-[#C1CF16] font-bold'>Energy graphs</h1>
          <Form className='space-y-12' name='user-info-form' form={form}>
            <Row className='w-[100%]  flex flex-row gap-5'>
              <Col className='gutter-row mt-2 lg:w-[25%] w-[100%]'>
                <CustomInput
                  placeholder='From'
                  label='From'
                  inputType='date'
                  name='from'
                  onChange={onChangeFromDate}
                />
              </Col>
              <Col className='gutter-row mt-2 lg:w-[25%] w-[100%]'>
                <CustomInput
                  placeholder='To'
                  label='To'
                  inputType='date'
                  name='to'
                  onChange={onChangeToDate}
                />
              </Col>
            </Row>
          </Form>
        </section>
        {isFetching || fetching || yearlyFetching ? (
          <GeneralContentLoader />
        ) : (
          <section className='flex flex-col'>
            <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
              <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
                <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
                  Graph data
                  <span className='sm:pl-5 pl-1'>(For last 7 days)</span>
                </h1>
              </div>
              <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
              <div className='p-5'>
                <Last7DaysGraph data={data?.data || []} />
              </div>
            </div>
            <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
              <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
                <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
                  Graph data
                  <span className='sm:pl-5 pl-1'>(For last 30 days)</span>
                </h1>
              </div>
              <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
              <div className='p-5'>
                <Last30DaysGraph data={monthlyData?.data || []} />
              </div>
            </div>
            <div className='mt-8 border border-gray-300 dark:border-gray-600 rounded-2xl'>
              <div className='flex justify-between items-center p-5  w-[100%] bg-[#1C2834] rounded-t-2xl'>
                <h1 className=' lg:text-xl text-base text-[#C1CF16] font-bold  rounded-t-2xl '>
                  Graph data
                  <span className='sm:pl-5 pl-1'>(Last 12 Months)</span>
                </h1>
              </div>
              <div className='border-t-[1px] border-gray-300 dark:border-gray-600 ' />
              <div className='p-5'>
                <Last12MonthGraph data={yearlyData?.data || []} />
              </div>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}

export default EnergyChart
