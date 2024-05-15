import { Layout } from 'antd'
import { FC, ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import ContentWrapper from '../components/common/contentwrapper/contentwrapper'
import NavBar from '../components/common/header/header'
import Sidebar from '../components/common/sidebar/sidebar'
import Analytics from '../components/dashboard/analytics/analytics'
import Settings from '../components/dashboard/settings/settings'
import Private from './private'

export const DashboardRoutes: FC = (): ReactElement => {
  return (
    <Layout className='h-[100vh] bg-white'>
      <div className='flex h-[100%]'>
        <Sidebar />
        <div className='flex-1'>
          <NavBar />
          <ContentWrapper>
            <Routes>
              <Route path='/' element={<Analytics />} />
              <Route path='/settings' element={<Settings />} />
            </Routes>
          </ContentWrapper>
        </div>
      </div>
    </Layout>
  )
}
const PrivateDashboard = Private(DashboardRoutes)
export default PrivateDashboard
