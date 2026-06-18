import React, { useState } from 'react'
import { Row, Col, Spinner } from 'reactstrap'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto || '')

  const showMsg = (text, type = 'success') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password && form.password !== form.confirmPassword) {
      showMsg('❌ Passwords do not match!', 'error'); return
    }
    setLoading(true)
    const payload = {
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
      ...(photoPreview ? { profilePhoto: photoPreview } : {}),
    }
    try {
      const res = await api.put(`/auth/profile/${user.id}`, payload)
      updateUser({ name: res.data.name, mobile: res.data.mobile, email: res.data.email, profilePhoto: res.data.profilePhoto })
      showMsg('✅ Profile updated successfully!')
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
    } catch {
      showMsg('❌ Failed to update profile.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'
  const isMgr = user?.role === 'FIN_MGR'

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title">👤 My Profile</h1>
        <p className="section-subtitle">Manage your personal details and security settings</p>
      </div>

      <Row className="g-4">
        {/* Avatar Card */}
        <Col xs={12} md={4} lg={3}>
          <div className="glass-card p-4 text-center">
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800, color: '#fff',
              margin: '0 auto 1rem', overflow: 'hidden',
              border: '3px solid var(--border)',
              boxShadow: '0 8px 24px rgba(99,102,241,0.3)'
            }}>
              {photoPreview
                ? <img src={photoPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials}
            </div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>{user?.name}</div>
            <div style={{ marginBottom: '0.75rem' }}>
              <span className={isMgr ? 'badge-role-admin' : 'badge-role-user'}>
                {isMgr ? '🛡️ Finance Manager' : '👤 Member'}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              📱 {user?.mobile}
            </div>
            <label htmlFor="photo-upload" style={{
              display: 'block', cursor: 'pointer', padding: '0.5rem',
              background: 'rgba(99,102,241,0.1)', border: '1px solid var(--border)',
              borderRadius: '8px', fontSize: '0.82rem', color: 'var(--primary-light)',
              fontWeight: 600, transition: 'all 0.2s ease'
            }}>
              📷 Change Photo
            </label>
            <input id="photo-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>
        </Col>

        {/* Form Card */}
        <Col xs={12} md={8} lg={9}>
          <div className="glass-card p-4">
            {msg && (
              <div className={msgType === 'success' ? 'alert-success-custom' : 'alert-danger-custom'}
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 500 }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h6 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Personal Information
              </h6>
              <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                  <label className="form-label-custom">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="profile-name" type="text" className="form-control input-dark"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </Col>
                <Col xs={12} md={6}>
                  <label className="form-label-custom">Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="profile-mobile" type="text" className="form-control input-dark"
                    value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
                </Col>
                <Col xs={12} md={6}>
                  <label className="form-label-custom">Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                  <input id="profile-email" type="email" className="form-control input-dark"
                    placeholder="your@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </Col>
              </Row>

              <div className="divider" />

              <h6 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em' }}>
                Change Password
              </h6>
              <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                  <label className="form-label-custom">New Password</label>
                  <input id="profile-password" type="password" className="form-control input-dark"
                    placeholder="Leave blank to keep current"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </Col>
                <Col xs={12} md={6}>
                  <label className="form-label-custom">Confirm Password</label>
                  <input id="profile-confirm-password" type="password" className="form-control input-dark"
                    placeholder="Re-enter new password"
                    value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
                </Col>
              </Row>

              <div className="d-flex gap-3 flex-wrap">
                <button id="btn-save-profile" type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
                  {loading ? <Spinner size="sm" className="me-2" /> : null}
                  💾 Save Changes
                </button>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  )
}
