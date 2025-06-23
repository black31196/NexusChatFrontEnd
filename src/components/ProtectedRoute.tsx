import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: string[]
}

/**
 * Wrap any route that needs auth (and optionally role(s)).
 * If not logged in → redirect to /login.
 * If logged in but role not allowed → redirect to /unauthorized.
 */
export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // not logged in
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    // logged in but wrong role
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
