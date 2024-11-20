/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactElement, useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/header'
import { GeneralContentLoader } from '../components/common/loader/loader'
import Sidebar from '../components/common/sidebar/sidebar'
import Analytics from '../components/dashboard/analytics/analytics'
import BoxInformation from '../components/dashboard/boxes/boxesInformation'
import EnergyChart from '../components/dashboard/charts/energyChart'
import Profile from '../components/dashboard/profile/profile'
import Settings from '../components/dashboard/settings/settings'
import NotFound from '../components/notfound/notFound'
import { useGetBoxesQuery } from '../lib/api/box/boxEndPoints'
import { useGetPartnersQuery } from '../lib/api/partners/partnersEndPoints'
import { useGetStepsQuery } from '../lib/api/redexsteps/stepsEndpoints'
import { useGetSystemStepsQuery } from '../lib/api/systemSteps/systemSteps'
import { useGetAdditionalInfoQuery } from '../lib/api/user/userEndPoints'
import Private from './private'

export const DashboardRoutes: FC = (): ReactElement => {
  const navigate = useNavigate()

  const {
    data: boxesData,
    isFetching: fetchingBoxes,
    refetch: refetchBoxes,
  } = useGetBoxesQuery()

  const {
    data: redexSteps,
    refetch,
    isFetching: isFetchingSteps,
  } = useGetStepsQuery()
  const [partner, setPartner] = useState<Array<string>>([])
  const { data, refetch: refetchData, isFetching } = useGetAdditionalInfoQuery()
  const {
    data: partners,
    refetch: refetchPartners,
    isFetching: partnerFetching,
  } = useGetPartnersQuery()

  const {
    data: stepsData,
    isFetching: isSystemFetching,
    refetch: stepsRefetch,
  } = useGetSystemStepsQuery()

  useEffect(() => {
    if (!partnerFetching) {
      if (partners && partners.data !== null) {
        if (!partners.data.partner || partners.data.partner.length === 0) {
          navigate('/onboarding')
        } else {
          setPartner(partners.data.partner)
        }
      } else {
        navigate('/onboarding')
      }
    }
  }, [partners, partnerFetching])

  useEffect(() => {
    if (partner.length > 0) {
      partner.forEach((part: string) => {
        if (part === 'REDEX') {
          if (
            (redexSteps?.data &&
              redexSteps.data.length > 0 &&
              redexSteps.data[0].status === false) ||
            redexSteps?.data?.length === 0
          ) {
            navigate('/redexsteps')
          }
        }
        if (part === 'No') {
          if (
            (stepsData?.data &&
              stepsData.data.length > 0 &&
              stepsData.data[0].status === false) ||
            stepsData?.data?.length === 0
          ) {
            navigate('/systemsteps')
          }
        }
      })
    }
  }, [redexSteps, partner])

  useEffect(() => {
    if (
      redexSteps?.data &&
      redexSteps.data.length > 0 &&
      redexSteps.data[0].status === true &&
      stepsData?.data &&
      stepsData.data.length > 0 &&
      stepsData.data[0].status === false
    ) {
      navigate('/systemsteps')
    }
  }, [redexSteps])

  useEffect(() => {
    if (
      ((redexSteps?.data &&
        redexSteps.data.length > 0 &&
        redexSteps.data[0].status === true) ||
        (stepsData?.data &&
          stepsData.data.length > 0 &&
          stepsData.data[0].status === true)) &&
      boxesData?.data &&
      boxesData.data.length === 0
    ) {
      navigate('/ds/devices')
    }
  }, [stepsData, boxesData])

  useEffect(() => {
    refetch()
    refetchData()
    refetchBoxes()
    refetchPartners()
    stepsRefetch()
  }, [refetch, refetchData, refetchBoxes, refetchPartners, stepsRefetch])

  if (isFetchingSteps || fetchingBoxes || isSystemFetching) {
    return <GeneralContentLoader />
  }

  return (
    <div className='h-[100vh] bg-white overflow-y-hidden w-[100%]'>
      <div className='flex h-[100%] w-[100%] '>
        <Sidebar boxesData={boxesData?.data} />
        <div className='flex-1 h-[100%] flex flex-col  mb-16 w-[100%] '>
          <NavBar data={data?.data} boxesData={boxesData?.data} />
          <ContentWrapper>
            <Routes>
              <Route path='/' element={<Analytics />} />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/profile'
                element={
                  <Profile
                    additionalData={data?.data}
                    loading={fetchingBoxes || isFetching}
                  />
                }
              />
              <Route
                path='/devices'
                element={
                  <BoxInformation
                    boxesData={boxesData?.data}
                    isFetching={fetchingBoxes}
                  />
                }
              />
              <Route path='/charts' element={<EnergyChart />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </ContentWrapper>
        </div>
      </div>
    </div>
  )
}

const PrivateDashboard = Private(DashboardRoutes)
export default PrivateDashboard
