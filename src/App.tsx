import { Route, Routes } from 'react-router-dom'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import ChoosePartnersTypeForm from './components/firststep/choosetype'
import ErrorPage from './components/notfound/ErrorPage'
import UserSteps from './components/steps/steps'
import SystemUserSteps from './components/systemSteps/systemSteps'
import PrivateDashboard from './routes/dashboard.route'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/ds/*' element={<PrivateDashboard />} />
      <Route path='/redexsteps' element={<UserSteps />} />
      <Route path='/systemsteps' element={<SystemUserSteps />} />
      <Route path='/onboarding' element={<ChoosePartnersTypeForm />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

export default App
