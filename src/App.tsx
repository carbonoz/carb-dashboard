import { Route, Routes } from 'react-router-dom'
import PrivateDashboard from './routes/dashboard.route'
import IndexRoutes from './routes/index.route'

function App() {
  return (
    <Routes>
      <Route path='/*' element={<IndexRoutes />} />
      <Route path='/ds/*' element={<PrivateDashboard />} />
    </Routes>
  )
}

export default App
