/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table } from 'antd'
import dayjs from 'dayjs'
import { FC, ReactElement } from 'react'
import { energyInt } from '../../lib/api/Analytics/analyticsEndpoints'

interface props {
  data: Array<energyInt> | undefined
  isFetching: boolean
}

const { Column } = Table

const EnergyTable: FC<props> = ({ data, isFetching }): ReactElement => {
  const sortedData: Array<energyInt> | undefined = data
    ?.slice()
    .sort((a, b) => {
      return (
        dayjs(b.date, 'DD/MM/YYYY').valueOf() -
        dayjs(a.date, 'DD/MM/YYYY').valueOf()
      )
    })

  return (
    <Table
      className='data_table'
      dataSource={sortedData}
      rowKey={(record) => {
        return record?.id
      }}
      rowClassName='shadow'
      pagination={false}
      loading={isFetching}
      bordered={false}
      scroll={{ x: 0 }}
    >
      <Column
        title='Date'
        key='date'
        render={(record: energyInt) => (
          <span className='text-gray-500 font-bold'>
            {' '}
            {dayjs(record.date, 'DD/MM/YYYY').format('MMMM DD')}{' '}
          </span>
        )}
      />
      <Column
        title='loadPower'
        key='loadPower'
        render={(record: energyInt) => (
          <span className='font-bold  text-blue-500'>{record?.loadPower}</span>
        )}
      />
      <Column
        title='pvPower'
        key='pvPower'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>{record?.pvPower}</span>
        )}
      />
    </Table>
  )
}

export default EnergyTable
