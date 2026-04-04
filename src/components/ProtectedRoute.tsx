import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

