import { Navigate, Outlet } from 'react-router'

import LoadingScreen from '../components/shared/LoadingScreen'
import { useAuthStore } from '../stores/auth-store'

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <LoadingScreen />
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />
}

export default PublicRoute
