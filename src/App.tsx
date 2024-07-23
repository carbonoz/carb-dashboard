import { Route, Routes } from 'react-router-dom'
import Login from './components/auth/login'
import Signup from './components/auth/signup'
import ErrorPage from './components/notfound/ErrorPage'
import UserSteps from './components/steps/steps'
import PrivateDashboard from './routes/dashboard.route'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/ds/*' element={<PrivateDashboard />} />
      <Route path='/steps' element={<UserSteps />} />
      <Route path='*' element={<ErrorPage />} />
    </Routes>
  )
}

export default App
