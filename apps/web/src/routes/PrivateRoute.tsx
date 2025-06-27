import { Navigate, Outlet } from 'react-router'

import LoadingScreen from '../components/shared/LoadingScreen'
import { useAuthStore } from '../stores/auth-store'

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingScreen />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />
}

export default PrivateRoute
