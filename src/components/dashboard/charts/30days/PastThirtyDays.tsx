import { FC, ReactElement } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { energyInt } from '../../../../lib/api/Analytics/analyticsEndpoints'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

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
  }))

  return (
    <ResponsiveContainer width='100%' height={400}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='date' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type='monotone' dataKey='loadPower' stroke='#8884d8' />
        <Line type='monotone' dataKey='pvPower' stroke='#82ca9d' />
        <Line type='monotone' dataKey='gridIn' stroke='#ffc658' />
        <Line type='monotone' dataKey='gridOut' stroke='#ff7300' />
        <Line type='monotone' dataKey='batteryCharged' stroke='#387908' />
        <Line type='monotone' dataKey='batteryDischarged' stroke='#001f3f' />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Last30DaysGraph
