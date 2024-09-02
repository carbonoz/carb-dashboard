/* eslint-disable react-hooks/exhaustive-deps */
import { Layout } from 'antd'
import { FC, ReactElement, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/header'
import { GeneralContentLoader } from '../components/common/loader/loader'
import Sidebar from '../components/common/sidebar/sidebar'
import Analytics from '../components/dashboard/analytics/analytics'
import BoxInformation from '../components/dashboard/boxes/boxesInformation'
import Profile from '../components/dashboard/profile/profile'
import Settings from '../components/dashboard/settings/settings'
import NotFound from '../components/notfound/notFound'
import { useGetBoxesQuery } from '../lib/api/box/boxEndPoints'
import { useGetStepsQuery } from '../lib/api/steps/stepsEndpoints'
import { useGetAdditionalInfoQuery } from '../lib/api/user/userEndPoints'
import Private from './private'
import EnergyChart from '../components/dashboard/charts/energyChart'

export const DashboardRoutes: FC = (): ReactElement => {
  const navigate = useNavigate()

  const {
    data: boxesData,
    isFetching: fetchingBoxes,
    refetch: refetchBoxes,
  } = useGetBoxesQuery()

  const {
    data: stepsData,
    refetch,
    isFetching: isFetchingSteps,
  } = useGetStepsQuery()

  const { data, refetch: refetchData, isFetching } = useGetAdditionalInfoQuery()

  useEffect(() => {
    if (
      (stepsData?.data &&
        stepsData.data.length > 0 &&
        stepsData.data[0].status === false) ||
      stepsData?.data?.length === 0
    ) {
      navigate('/steps')
    }
  }, [stepsData])

  useEffect(() => {
    if (
      stepsData?.data &&
      stepsData.data.length > 0 &&
      stepsData.data[0].status === true &&
      (!boxesData ||
        !Array.isArray(boxesData.data) ||
        boxesData.data.length === 0)
    ) {
      navigate('/ds/devices')
    }
  }, [stepsData, boxesData])

  useEffect(() => {
    refetch()
    refetchData()
    refetchBoxes()
  }, [refetch, refetchData, refetchBoxes])

  if (isFetching || isFetchingSteps || !stepsData?.data || fetchingBoxes) {
    return <GeneralContentLoader />
  }

  return (
    <Layout className='h-[100vh] bg-white overflow-y-hidden'>
      <div className='flex h-[100%]'>
        <Sidebar boxesData={boxesData?.data} />
        <div className='flex-1 h-[100%] flex flex-col  mb-16 '>
          <NavBar data={data?.data} />
          <ContentWrapper>
            <Routes>
              <Route path='/' element={<Analytics />} />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/profile'
                element={
                  <Profile
                    additionalData={data?.data}
                    boxesData={boxesData?.data}
                    loading={fetchingBoxes || isFetching}
                  />
                }
              />
              <Route
                path='/devices'
                element={<BoxInformation boxesData={boxesData?.data} />}
              />
              <Route path='/charts' element={<EnergyChart />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </ContentWrapper>
        </div>
      </div>
    </Layout>
  )
}

const PrivateDashboard = Private(DashboardRoutes)
export default PrivateDashboard
