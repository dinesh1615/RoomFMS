import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roomfms_user')) || null
    } catch {
      return null
    }
  })

  const login = (userData) => {
    localStorage.setItem('roomfms_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('roomfms_user')
    setUser(null)
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    localStorage.setItem('roomfms_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
