import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ mobile: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid mobile number or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">🏠</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            RoomFMS
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Room Financial Management System
          </p>
        </div>

        {error && (
          <div className="alert-danger-custom p-3 mb-3 rounded" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label-custom">Mobile Number</label>
            <input
              id="login-mobile"
              type="text"
              className="form-control input-dark"
              placeholder="Enter mobile number"
              value={form.mobile}
              onChange={e => setForm({ ...form, mobile: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="form-label-custom">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-control input-dark"
              placeholder="Enter password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary-custom w-100"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" /> Logging in...</>
            ) : (
              '🔐 Login'
            )}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
            Contact your Finance Manager to get an account
          </p>
        </div>
      </div>
    </div>
  )
}
