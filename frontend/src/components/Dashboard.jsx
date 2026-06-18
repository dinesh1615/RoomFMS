import React, { useEffect, useState } from 'react'
import { Row, Col, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button, Table } from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function StatCard({ icon, label, value, color, prefix = '₹' }) {
  return (
    <div className="stat-card h-100">
      <div className="stat-icon" style={{ background: `rgba(${color},0.15)` }}>
        {icon}
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: `rgb(${color})` }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editModal, setEditModal] = useState(false)
  const [newAmt, setNewAmt] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const isMgr = user?.role === 'FIN_MGR'

  const fetchStats = async () => {
    try {
      const res = await api.get(`/dashboard/${user.id}`)
      setStats(res.data)
      setNewAmt(res.data.monthlyAmount)
    } catch {
      setStats({ roomBalance: 0, ownAmountPaid: 0, monthlyAmount: 5000, nextMonthPay: 5000 })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStats() }, [])

  const handleSaveAmount = async () => {
    setSaving(true)
    setMsg('')
    try {
      await api.put(`/budget/config?amount=${newAmt}`)
      setMsg('✅ Monthly amount updated!')
      setEditModal(false)
      fetchStats()
    } catch {
      setMsg('❌ Failed to update amount.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="spinner-wrapper">
      <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h1 className="section-title">
            👋 Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="section-subtitle">Here's your financial overview for this month</p>
        </div>
        <div style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '0.5rem 1rem',
          fontSize: '0.82rem',
          color: 'var(--text-secondary)'
        }}>
          📅 {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            icon="🏦"
            label="Room Balance"
            value={stats?.roomBalance}
            color="99,102,241"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            icon="💸"
            label="Your Own Amt Paid"
            value={stats?.ownAmountPaid}
            color="245,158,11"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <div className="stat-card h-100">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>💰</div>
            <div className="stat-label">Amt Per Month</div>
            <div className="stat-value" style={{ color: '#10b981' }}>
              ₹{stats?.monthlyAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            {isMgr && (
              <button
                id="btn-edit-monthly-amt"
                className="btn btn-sm mt-2"
                onClick={() => setEditModal(true)}
                style={{
                  background: 'rgba(16,185,129,0.15)',
                  border: '1px solid rgba(16,185,129,0.3)',
                  color: '#10b981',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}
              >
                ✏️ Edit Amount
              </button>
            )}
          </div>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <StatCard
            icon="📆"
            label="Next Month Pay"
            value={stats?.nextMonthPay}
            color="14,165,233"
          />
        </Col>
      </Row>

      {/* Remaining Budgets Section */}
      {stats?.remainingBudgets && stats.remainingBudgets.length > 0 && (
        <div className="glass-card p-4 mb-4" id="remaining-budgets-section">
          <h5 style={{ fontWeight: 700, marginBottom: '1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Leftover Budget in Previous Months
          </h5>
          <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            The following months have remaining budget amounts. You can transfer these balances to the current month's budget.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <Table className="table-dark-custom mb-0 align-middle">
              <thead>
                <tr>
                  <th>Month / Year</th>
                  <th>Remaining Balance</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.remainingBudgets.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>
                      {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][b.month - 1]} {b.year}
                    </td>
                    <td style={{ fontWeight: 700, color: '#10b981' }}>
                      ₹{b.totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-sm btn-primary-custom"
                        style={{ padding: '0.35rem 0.85rem', fontSize: '0.78rem' }}
                        onClick={() => navigate(`/budget?tab=transfer&fromMonth=${b.month}&fromYear=${b.year}`)}
                      >
                        🔄 Transfer Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}

      {/* Info Panel */}
      <Row className="g-3">
        <Col xs={12} md={6}>
          <div className="glass-card p-4 h-100">
            <h5 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
              📊 Monthly Summary
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Total Budget (this month)', value: stats?.monthlyAmount, icon: '🎯' },
                { label: 'Your own pocket expenses', value: stats?.ownAmountPaid, icon: '👛' },
                { label: 'Next month you need to pay', value: stats?.nextMonthPay, icon: '📤' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{(item.value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <div className="glass-card p-4 h-100">
            <h5 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>
              ℹ️ How It Works
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                '💰 Monthly amount is shared among all room members',
                '📥 Budget entries track who has paid into the room fund',
                '🧾 Expenditures can be paid from Budget or your own pocket',
                '👛 "Own Amt Paid" shows what you personally spent for the room this month',
                '📆 "Next Month Pay" = Monthly Amt − Your own pocket expenses',
              ].map((tip, i) => (
                <div key={i} style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  padding: '0.5rem 0.75rem',
                  borderLeft: '3px solid var(--primary)',
                  background: 'rgba(99,102,241,0.05)',
                  borderRadius: '0 6px 6px 0'
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Edit Monthly Amount Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)} centered>
        <ModalHeader toggle={() => setEditModal(false)}
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
          ✏️ Edit Monthly Amount
        </ModalHeader>
        <ModalBody style={{ background: 'var(--bg-card)' }}>
          {msg && <div className={msg.startsWith('✅') ? 'alert-success-custom' : 'alert-danger-custom'} style={{ padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{msg}</div>}
          <label className="form-label-custom">New Monthly Amount (₹)</label>
          <input
            id="input-monthly-amount"
            type="number"
            className="form-control input-dark"
            value={newAmt}
            onChange={e => setNewAmt(e.target.value)}
            min={0}
          />
        </ModalBody>
        <ModalFooter style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <Button id="btn-save-monthly-amt" className="btn-primary-custom" onClick={handleSaveAmount} disabled={saving}>
            {saving ? <Spinner size="sm" /> : '💾 Save'}
          </Button>
          <Button color="secondary" onClick={() => setEditModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
