import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { FC, ReactElement } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { energyInt } from '../../../../lib/api/Analytics/analyticsEndpoints'

dayjs.extend(utc)
dayjs.extend(timezone)

interface Props {
  data: Array<energyInt>
}

const Last30DaysGraph: FC<Props> = ({ data }): ReactElement => {
  const timeZone = 'Indian/Mauritius'

  const formattedData = data.map((item) => ({
    date: dayjs(item.date).tz(timeZone).format('DD/MM/YYYY'),
    loadPower: parseFloat(item.loadPower),
    pvPower: parseFloat(item.pvPower),
    gridIn: parseFloat(item.gridIn),
    gridOut: parseFloat(item.gridOut),
    batteryCharged: parseFloat(item.batteryCharged),
    batteryDischarged: parseFloat(item.batteryDischarged),
    // Calculate net grid flow (positive = in, negative = out)
    gridFlow: parseFloat(item.gridIn) - parseFloat(item.gridOut),
    // Calculate net battery flow (positive = charging, negative = discharging)
    batteryFlow:
      parseFloat(item.batteryCharged) - parseFloat(item.batteryDischarged),
  }))

  const customFormatter = (
    value: number | string | Array<number | string> | undefined,
    name: string
  ) => {
    if (value === undefined || value === null) return ['-', name]

    const numValue =
      typeof value === 'string' ? parseFloat(value) : Number(value)

    if (isNaN(numValue)) return [value, name]

    if (name === 'Grid Flow') {
      return [
        `${Math.abs(numValue).toFixed(2)} (${
          numValue > 0 ? 'Importing' : 'Exporting'
        })`,
        name,
      ]
    } else if (name === 'Battery Flow') {
      return [
        `${Math.abs(numValue).toFixed(2)} (${
          numValue > 0 ? 'Charging' : 'Discharging'
        })`,
        name,
      ]
    }

    return [numValue.toFixed(2), name]
  }

  return (
    <div className='space-y-8'>
      {/* Main Energy Chart */}
      <div className='p-4 border rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium mb-4'>
          Energy Production & Consumption
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='loadPower'
              stroke='#8884d8'
              name='Load Power'
            />
            <Line
              type='monotone'
              dataKey='pvPower'
              stroke='#82ca9d'
              name='PV Power'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Grid Power Chart */}
      <div className='p-4 border rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium mb-4'>
          Grid Power Flow (Up = Importing, Down = Exporting)
        </h3>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <ReferenceLine y={0} stroke='#000' strokeDasharray='3 3' />
            <Tooltip formatter={customFormatter} />
            <Legend />
            <Line
              type='monotone'
              dataKey='gridFlow'
              stroke='#ff7300'
              name='Grid Flow'
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Battery Chart */}
      <div className='p-4 border rounded-lg shadow-sm'>
        <h3 className='text-lg font-medium mb-4'>
          Battery Flow (Up = Charging, Down = Discharging)
        </h3>
        <ResponsiveContainer width='100%' height={250}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis />
            <ReferenceLine y={0} stroke='#000' strokeDasharray='3 3' />
            <Tooltip formatter={customFormatter} />
            <Legend />
            <Line
              type='monotone'
              dataKey='batteryFlow'
              stroke='#387908'
              name='Battery Flow'
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Last30DaysGraph
