/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, Row } from 'antd'
import { FC, ReactElement, useEffect, useState } from 'react'
import {
  useGetEnergyFor30DaysQuery,
  useGetEnergyQuery,
} from '../../../lib/api/Analytics/analyticsEndpoints'
import CustomInput from '../../common/input/customInput'
import { GeneralContentLoader } from '../../common/loader/loader'
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

  useEffect(() => {
    refetch()
    refechMonthly()
  }, [refetch, refechMonthly])

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
              <Col className='gutter-row mt-2 w-[25%]'>
                <CustomInput
                  placeholder='From'
                  label='From'
                  inputType='date'
                  name='from'
                  onChange={onChangeFromDate}
                />
              </Col>
              <Col className='gutter-row mt-2 w-[25%]'>
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
        {isFetching || fetching ? (
          <GeneralContentLoader />
        ) : (
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
        )}
      </div>
    </section>
  )
}

export default EnergyChart
