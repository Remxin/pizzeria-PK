import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import type { UserRole } from '../../types/user.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  requireAuth?: boolean
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireAuth = false,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { user, isAuthenticated, isInitialized, loading } = useAppSelector(
    (state) => state.auth,
  )

  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-md">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ładowanie sesji...
          </p>
        </div>
      </div>
    )
  }

  if ((requireAuth || allowedRoles) && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'CLIENT') {
      return <Navigate to="/menu" replace />
    }

    return <Navigate to="/menu" replace />
  }

  return <>{children}</>
}
