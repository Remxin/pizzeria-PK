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
  const { user, devPreviewRole } = useAppSelector((state) => state.app)

  const effectiveRole = user?.role ?? devPreviewRole

  if (requireAuth && !effectiveRole) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && effectiveRole && !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/menu" replace />
  }

  // Dev mode: allow admin routes without auth (UI preview)
  if (allowedRoles && !effectiveRole) {
    const isDev = import.meta.env.DEV
    if (isDev) {
      return <>{children}</>
    }
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
