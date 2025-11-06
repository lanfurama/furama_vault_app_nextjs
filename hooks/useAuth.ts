'use client'

import { useState, useEffect } from 'react'

export type UserRole = 'admin' | 'user' | 'guest'

interface User {
  role: UserRole
  name?: string
  email?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user role from localStorage (or from API in production)
    const userRole = localStorage.getItem('userRole') as UserRole | null
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')

    if (userRole) {
      setUser({
        role: userRole,
        name: userName || undefined,
        email: userEmail || undefined
      })
    } else {
      // Default to admin for now (can be changed later)
      const defaultRole: UserRole = 'admin'
      localStorage.setItem('userRole', defaultRole)
      setUser({ role: defaultRole })
    }
    
    setLoading(false)
  }, [])

  const isAdmin = user?.role === 'admin'
  const isUser = user?.role === 'user'
  const isGuest = user?.role === 'guest'

  const setUserRole = (role: UserRole, name?: string, email?: string) => {
    localStorage.setItem('userRole', role)
    if (name) localStorage.setItem('userName', name)
    if (email) localStorage.setItem('userEmail', email)
    setUser({ role, name, email })
  }

  return {
    user,
    loading,
    isAdmin,
    isUser,
    isGuest,
    setUserRole
  }
}

