import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppNavbar from './components/AppNavbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import BudgetManager from './components/BudgetManager'
import ExpenditureTracker from './components/ExpenditureTracker'
import TransactionHistory from './components/TransactionHistory'
import Profile from './components/Profile'
import AddUser from './components/AddUser'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'FIN_MGR') return <Navigate to="/" replace />
  return children
}

function AppLayout({ children }) {
  return (
    <>
      <AppNavbar />
      <div className="page-wrapper">
        <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </div>
    </>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/budget" element={
        <ProtectedRoute adminOnly>
          <AppLayout><BudgetManager /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/expenditure" element={
        <ProtectedRoute>
          <AppLayout><ExpenditureTracker /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <AppLayout><TransactionHistory /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><Profile /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/add-user" element={
        <ProtectedRoute adminOnly>
          <AppLayout><AddUser /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
