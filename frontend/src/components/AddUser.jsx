import React, { useState, useEffect } from 'react'
import { Row, Col, Spinner, Table } from 'reactstrap'
import api from '../api/axios'

export default function AddUser() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', role: 'USER' })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(true)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')

  const showMsg = (text, type = 'success') => {
    setMsg(text); setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  const fetchUsers = async () => {
    setFetchingUsers(true)
    try {
      const res = await api.get('/auth/users')
      setUsers(res.data)
    } catch {
      setUsers([])
    } finally {
      setFetchingUsers(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/add-user', form)
      showMsg(`✅ User "${form.name}" added successfully!`)
      setForm({ name: '', mobile: '', email: '', password: '', role: 'USER' })
      fetchUsers()
    } catch (err) {
      showMsg('❌ ' + (err.response?.data?.message || 'Failed to add user.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title">👤 Add New Member</h1>
        <p className="section-subtitle">Create accounts for room members</p>
      </div>

      <Row className="g-4">
        {/* Add User Form */}
        <Col xs={12} lg={5}>
          <div className="glass-card p-4">
            <h5 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              ➕ New Member Details
            </h5>

            {msg && (
              <div className={msgType === 'success' ? 'alert-success-custom' : 'alert-danger-custom'}
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 500 }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col xs={12}>
                  <label className="form-label-custom">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="adduser-name" type="text" className="form-control input-dark"
                    placeholder="e.g., Dinesh Kumar"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </Col>
                <Col xs={12}>
                  <label className="form-label-custom">Mobile Number <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="adduser-mobile" type="text" className="form-control input-dark"
                    placeholder="e.g., 9876543210"
                    value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} required />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    This will be used as the login username
                  </small>
                </Col>
                <Col xs={12}>
                  <label className="form-label-custom">Email <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
                  <input id="adduser-email" type="email" className="form-control input-dark"
                    placeholder="user@email.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </Col>
                <Col xs={12}>
                  <label className="form-label-custom">Password <span style={{ color: '#ef4444' }}>*</span></label>
                  <input id="adduser-password" type="password" className="form-control input-dark"
                    placeholder="Set initial password"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                </Col>
                <Col xs={12}>
                  <label className="form-label-custom">Role <span style={{ color: '#ef4444' }}>*</span></label>
                  <div className="d-flex gap-2">
                    {[{ val: 'USER', label: '👤 Member', desc: 'Can view & add expenditures' },
                      { val: 'FIN_MGR', label: '🛡️ Finance Manager', desc: 'Full access' }].map(r => (
                      <label key={r.val} id={`lbl-role-${r.val.toLowerCase()}`} style={{
                        flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem',
                        padding: '0.75rem', borderRadius: '10px', cursor: 'pointer',
                        border: `2px solid ${form.role === r.val ? 'var(--primary)' : 'var(--border)'}`,
                        background: form.role === r.val ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                      }}>
                        <input type="radio" name="role" value={r.val}
                          id={`radio-role-${r.val.toLowerCase()}`}
                          checked={form.role === r.val}
                          onChange={e => setForm({ ...form, role: e.target.value })}
                          style={{ display: 'none' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: form.role === r.val ? 'var(--primary-light)' : 'var(--text-primary)' }}>{r.label}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{r.desc}</span>
                      </label>
                    ))}
                  </div>
                </Col>
                <Col xs={12}>
                  <button id="btn-adduser-submit" type="submit" className="btn btn-primary-custom w-100" disabled={loading}>
                    {loading ? <Spinner size="sm" className="me-2" /> : null}
                    ➕ Create Account
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        </Col>

        {/* Existing Users */}
        <Col xs={12} lg={7}>
          <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>🧑‍🤝‍🧑 Room Members</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{users.length} member{users.length !== 1 ? 's' : ''}</span>
            </div>

            {fetchingUsers ? (
              <div className="spinner-wrapper"><Spinner color="primary" /></div>
            ) : users.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👤</div>
                <div>No members yet. Add the first member!</div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <Table className="table-dark-custom mb-0" id="users-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id}>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{i + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <div style={{
                              width: 32, height: 32, borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0
                            }}>
                              {u.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{u.mobile}</td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.email || '—'}</td>
                        <td>
                          <span className={u.role === 'FIN_MGR' ? 'badge-role-admin' : 'badge-role-user'}>
                            {u.role === 'FIN_MGR' ? '🛡️ Manager' : '👤 Member'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}
