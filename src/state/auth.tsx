import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAuthToken } from '../api'

type Role = 'user' | 'admin'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

const LS_TOKEN = 'pizza_token'
const LS_USER = 'pizza_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(LS_USER)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  })

  useEffect(() => {
    setAuthToken(token)
    if (token) localStorage.setItem(LS_TOKEN, token)
    else localStorage.removeItem(LS_TOKEN)
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem(LS_USER, JSON.stringify(user))
    else localStorage.removeItem(LS_USER)
  }, [user])

  async function login(email: string, password: string) {
    const res = await api.post('/api/auth/login', { email, password })
    setToken(res.data.token)
    setUser(res.data.user)
  }

  async function register(name: string, email: string, password: string) {
    await api.post('/api/auth/register', { name, email, password })
    await login(email, password)
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

