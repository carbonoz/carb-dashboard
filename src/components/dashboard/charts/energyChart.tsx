import { FC, ReactElement, useEffect } from 'react'
import { useGetUserPortsQuery } from '../../../lib/api/user/userEndPoints'
import { GeneralContentLoader } from '../../common/loader/loader'

const EnergyChart: FC = (): ReactElement => {
  const { data, isFetching, refetch } = useGetUserPortsQuery()

  useEffect(() => {
    refetch()
  }, [refetch])

  if (isFetching) {
    return <GeneralContentLoader />
  }

  return (
    <div className='w-[100%] h-[100%]'>
      <iframe
        src={`http://${data?.data[0].port}:3000/d/solar_dashboard/solar-dashboard?orgId=1&kiosk=1&refresh=1m&theme=light`}
        allowFullScreen={true}
        width={'100%'}
        height={'100%'}
        style={{
          backgroundColor: 'white',
        }}
      />
    </div>
  )
}

export default EnergyChart
