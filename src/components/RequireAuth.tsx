import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types'

export interface RequireAuthProps {
  role: Role
  children: ReactNode
}

export function RequireAuth({ role, children }: RequireAuthProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user || user.role !== role) {
    const redirectTo = role === 'admin' ? '/admin/login' : '/login'
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return <>{children}</>
}
