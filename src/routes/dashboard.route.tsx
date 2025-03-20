import { FC, ReactElement, useEffect, useMemo } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/header'
import { GeneralContentLoader } from '../components/common/loader/loader'
import Sidebar from '../components/common/sidebar/sidebar'
import Analytics from '../components/dashboard/analytics/analytics'
import EnergyChart from '../components/dashboard/charts/energyChart'
import Profile from '../components/dashboard/profile/profile'
import Settings from '../components/dashboard/settings/settings'
import NotFound from '../components/notfound/notFound'
import { EPartner } from '../config/constant'
import { useGetPartnersQuery } from '../lib/api/partners/partnersEndPoints'
import { useGetStepsQuery } from '../lib/api/redexsteps/stepsEndpoints'
import { useGetSystemStepsQuery } from '../lib/api/systemSteps/systemSteps'
import { useGetAdditionalInfoQuery } from '../lib/api/user/userEndPoints'
import Private from './private'

export const DashboardRoutes: FC = (): ReactElement => {
  const navigate = useNavigate()

  const {
    data: redexSteps,
    refetch: refetchRedexSteps,
    isFetching: isFetchingSteps,
  } = useGetStepsQuery()

  const {
    data: additionalUserInfo,
    refetch: refetchUserInfo,
    isFetching: isUserInfoFetching,
  } = useGetAdditionalInfoQuery()

  const {
    data: partners,
    refetch: refetchPartners,
    isFetching: isPartnersFetching,
  } = useGetPartnersQuery()

  const {
    data: systemSteps,
    refetch: refetchSystemSteps,
    isFetching: isSystemStepsFetching,
  } = useGetSystemStepsQuery()

  const partnerList = useMemo(() => {
    if (partners?.data?.partner && partners.data.partner.length > 0) {
      return partners.data.partner
    }
    return []
  }, [partners])

  const isLoading =
    isFetchingSteps ||
    isSystemStepsFetching ||
    isPartnersFetching ||
    isUserInfoFetching

  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.all([
        refetchRedexSteps(),
        refetchUserInfo(),
        refetchPartners(),
        refetchSystemSteps(),
      ])
    }
    fetchAllData()
  }, [refetchRedexSteps, refetchUserInfo, refetchPartners, refetchSystemSteps])

  const shouldRedirect = useMemo(() => {
    // Don't redirect if still loading
    if (isLoading) {
      return null
    }

    // Check if user has partners
    if (!partners?.data?.partner || partners.data.partner.length === 0) {
      return '/onboarding'
    }

    // Check REDEX partner requirements
    if (partnerList.includes(EPartner.REDEX)) {
      const hasIncompleteRedexSteps =
        !redexSteps?.data?.length ||
        (redexSteps.data.length > 0 &&
          redexSteps.data[0].status === false &&
          redexSteps.data[0]?.hasSkipped === false)
      if (hasIncompleteRedexSteps) {
        return '/redexsteps'
      }
    }

    // Check No partner requirements
    if (partnerList.includes(EPartner.NO)) {
      const hasIncompleteSystemSteps =
        !systemSteps?.data ||
        systemSteps.data.length === 0 ||
        systemSteps.data[0]?.status === false

      if (hasIncompleteSystemSteps) {
        return '/systemsteps'
      }
    }

    // Check if user completed REDEX steps but not system steps
    const hasCompletedRedexSteps =
      redexSteps?.data &&
      redexSteps.data.length > 0 &&
      (redexSteps.data[0]?.status === true ||
        redexSteps.data[0]?.hasSkipped === true)

    const hasIncompleteSystemSteps =
      systemSteps?.data &&
      systemSteps.data.length > 0 &&
      systemSteps.data[0]?.status === false

    if (hasCompletedRedexSteps && hasIncompleteSystemSteps) {
      return '/systemsteps'
    }

    // No redirection needed
    return null
  }, [isLoading, partners, partnerList, redexSteps, systemSteps])

  // Handle navigation when redirect path changes
  useEffect(() => {
    if (shouldRedirect) {
      navigate(shouldRedirect)
    }
  }, [shouldRedirect, navigate])

  // Show loading while fetching or determining redirection
  if (isLoading || shouldRedirect) {
    return <GeneralContentLoader />
  }

  return (
    <div className='h-[100vh] bg-white overflow-y-hidden w-[100%]'>
      <div className='flex h-[100%] w-[100%] '>
        <Sidebar />
        <div className='flex-1 h-[100%] flex flex-col mb-16 w-[100%]'>
          <NavBar data={additionalUserInfo?.data} />
          <ContentWrapper>
            <Routes>
              <Route
                path='/'
                element={
                  <Analytics additionalData={additionalUserInfo?.data} />
                }
              />
              <Route path='/settings' element={<Settings />} />
              <Route
                path='/profile'
                element={
                  <Profile
                    additionalData={additionalUserInfo?.data}
                    loading={isUserInfoFetching}
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
