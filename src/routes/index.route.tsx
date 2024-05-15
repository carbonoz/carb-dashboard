import { FC, ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../components/auth/login'
import Signup from '../components/auth/signup'

const IndexRoutes: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  )
}

export default IndexRoutes
