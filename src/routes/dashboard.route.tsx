import { Layout } from 'antd'
import { FC, ReactElement, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/header'
import { GeneralContentLoader } from '../components/common/loader/loader'
import Sidebar from '../components/common/sidebar/sidebar'
import Analytics from '../components/dashboard/analytics/analytics'
import Profile from '../components/dashboard/profile/profile'
import Settings from '../components/dashboard/settings/settings'
import NotFound from '../components/notfound/notFound'
import { useGetStepsQuery } from '../lib/api/steps/stepsEndpoints'
import { useGetAdditionalInfoQuery } from '../lib/api/user/userEndPoints'
import Private from './private'

export const DashboardRoutes: FC = (): ReactElement => {
  const navigate = useNavigate()

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
  }, [stepsData, navigate])

  useEffect(() => {
    refetch()
    refetchData()
  }, [refetch, refetchData])

  if (isFetching || isFetchingSteps || !stepsData?.data) {
    return <GeneralContentLoader />
  }

  return (
    <Layout className='h-[100vh] bg-white overflow-y-hidden'>
      <div className='flex h-[100%]'>
        <Sidebar />
        <div className='flex-1 h-[100%] '>
          <NavBar data={data?.data} />
          <ContentWrapper>
            <Routes>
              <Route path='/' element={<Analytics />} />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/profile'
                element={<Profile additionalData={data?.data} />}
              />
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
