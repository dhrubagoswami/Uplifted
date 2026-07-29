import { createContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import * as authApi from '../api/auth'
import type { LoginParams } from '../api/auth'
import type { Role, SessionUser } from '../types'

export interface AuthContextValue {
  user: SessionUser | null
  role: Role | null
  isLoading: boolean
  login: (params: LoginParams) => Promise<SessionUser>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      role: user?.role ?? null,
      isLoading,
      login: async (params: LoginParams) => {
        setIsLoading(true)
        try {
          const session = await authApi.login(params)
          setUser(session)
          return session
        } finally {
          setIsLoading(false)
        }
      },
      logout: async () => {
        setIsLoading(true)
        try {
          await authApi.logout()
          setUser(null)
        } finally {
          setIsLoading(false)
        }
      },
    }),
    [user, isLoading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
