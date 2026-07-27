import { useSelector } from 'react-redux'

export const useAuth = () => {
  const { user, accessToken } = useSelector((state) => state.auth)
  return {
    user,
    isAuthenticated: !!accessToken && !!user,
    role: user?.role,
  }
}
