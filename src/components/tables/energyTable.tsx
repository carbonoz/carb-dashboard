import { Table, TablePaginationConfig } from 'antd'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { FC, ReactElement } from 'react'
import { energyInt } from '../../lib/api/Analytics/analyticsEndpoints'

dayjs.extend(utc)
dayjs.extend(timezone)

interface Props {
  data: Array<energyInt> | undefined
  isFetching: boolean
  type?: 'monthly' | 'daily' | 'yearly' | 'decade'
  pagination?: TablePaginationConfig
}

const { Column } = Table

const EnergyTable: FC<Props> = ({
  data,
  isFetching,
  type = 'daily',
  pagination,
}): ReactElement => {
  const timeZone = 'Indian/Mauritius'
  let dateFormat
  switch (type) {
    case 'monthly':
      dateFormat = 'DD/MM/YYYY'
      break
    case 'yearly':
      dateFormat = 'MMMM YYYY'
      break
    case 'decade':
      dateFormat = 'YYYY'
      break
    default:
      dateFormat = 'MMMM DD'
  }

  return (
    <Table
      className='data_table border-collapse w-full'
      dataSource={data}
      rowKey={(record) => record?.id}
      rowClassName='shadow'
      pagination={pagination ? pagination : false}
      loading={isFetching}
      bordered={false}
      scroll={{ x: 0 }}
    >
      <Column
        title='Date'
        key='date'
        render={(record: energyInt) => (
          <span className='text-gray-500 font-bold'>
            {dayjs(record?.date).tz(timeZone).format(dateFormat)}
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Date',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Load Power'
        key='loadPower'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record.loadPower).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Load Power',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Pv Power'
        key='pvPower'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record?.pvPower).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Pv Power',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Grid In'
        key='gridIn'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record?.gridIn).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Grid In',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Grid Out'
        key='gridOut'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record?.gridOut).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Grid Out',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Battery Charged'
        key='batteryCharged'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record?.batteryCharged).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Battery Charged',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
      <Column
        title='Battery Discharged'
        key='batteryDischarged'
        render={(record: energyInt) => (
          <span className='font-bold text-blue-500'>
            {parseFloat(record?.batteryDischarged).toFixed(1)} Kwh
          </span>
        )}
        onCell={() =>
          ({
            'data-label': 'Battery Discharged',
          } as React.TdHTMLAttributes<HTMLTableCellElement>)
        }
      />
    </Table>
  )
}

export default EnergyTable
