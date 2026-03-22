'use client'

import { createContext, useContext, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  email: string
  name: string
  roleCodes: string[]
}

const AuthContext = createContext<AuthUser | null>(null)

export function AuthProvider({ user, children }: { user: AuthUser | null; children: ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
