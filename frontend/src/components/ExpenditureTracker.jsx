import React, { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'reactstrap'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function ExpenditureTracker() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    amount: '',
    date: new Date(),
    description: '',
    paymentSource: 'BUDGET',
  })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')

  const showMsg = (text, type = 'success') => {
    setMsg(text)
    setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const payload = {
      user: { id: user.id },
      amount: parseFloat(form.amount),
      date: form.date.toISOString().split('T')[0],
      description: form.description,
      paymentSource: form.paymentSource,
    }
    try {
      await api.post('/expenditures', payload)
      showMsg('✅ Expenditure recorded successfully!')
      setForm({ amount: '', date: new Date(), description: '', paymentSource: 'BUDGET' })
    } catch (err) {
      showMsg('❌ ' + (err.response?.data || 'Failed to save expenditure.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title">🧾 Add Expenditure</h1>
        <p className="section-subtitle">Record a room expense — from budget or your own pocket</p>
      </div>

      <Row className="g-4">
        <Col xs={12} lg={7}>
          <div className="glass-card p-4">
            {msg && (
              <div className={msgType === 'success' ? 'alert-success-custom' : 'alert-danger-custom'}
                style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 500 }}>
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Row className="g-3">
                {/* Payment Source */}
                <Col xs={12}>
                  <label className="form-label-custom">Payment By</label>
                  <div className="d-flex gap-3">
                    {['BUDGET', 'OWN'].map(src => (
                      <label key={src} id={`lbl-source-${src.toLowerCase()}`} style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: `2px solid ${form.paymentSource === src ? 'var(--primary)' : 'var(--border)'}`,
                        background: form.paymentSource === src ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                        transition: 'all 0.2s ease',
                      }}>
                        <input
                          type="radio"
                          id={`radio-source-${src.toLowerCase()}`}
                          name="paymentSource"
                          value={src}
                          checked={form.paymentSource === src}
                          onChange={e => setForm({ ...form, paymentSource: e.target.value })}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '1.4rem' }}>{src === 'BUDGET' ? '🏦' : '👛'}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: form.paymentSource === src ? 'var(--primary-light)' : 'var(--text-primary)' }}>
                            {src === 'BUDGET' ? 'Budget' : 'Own Money'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {src === 'BUDGET' ? 'Deducted from room budget' : 'Added to your own amt'}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </Col>

                <Col xs={12} md={6}>
                  <label className="form-label-custom">Amount (₹)</label>
                  <input
                    id="exp-amount"
                    type="number"
                    className="form-control input-dark"
                    placeholder="Enter amount"
                    value={form.amount}
                    min={1}
                    step="0.01"
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </Col>

                <Col xs={12} md={6}>
                  <label className="form-label-custom">Date</label>
                  <DatePicker
                    selected={form.date}
                    onChange={date => setForm({ ...form, date })}
                    dateFormat="dd/MM/yyyy"
                    maxDate={new Date()}
                    className="form-control input-dark"
                    id="exp-date"
                  />
                </Col>

                <Col xs={12}>
                  <label className="form-label-custom">Description <span style={{ color: '#ef4444' }}>*</span></label>
                  <textarea
                    id="exp-description"
                    className="form-control input-dark"
                    placeholder="What was this expense for? (e.g., Groceries, Electricity bill, etc.)"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    required
                  />
                </Col>

                <Col xs={12}>
                  <button id="btn-exp-submit" type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
                    {loading ? <Spinner size="sm" className="me-2" /> : null}
                    🧾 Record Expenditure
                  </button>
                </Col>
              </Row>
            </form>
          </div>
        </Col>

        {/* Side Info */}
        <Col xs={12} lg={5}>
          <div className="glass-card p-4">
            <h6 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              💡 Payment Source Guide
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(99,102,241,0.08)', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--primary-light)' }}>🏦 Budget</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Select this when paying from the room's common budget pool. The amount will be deducted from the current month's room balance.
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.08)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.4rem', color: '#f59e0b' }}>👛 Own Money</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Select this when you paid from your personal money for a room expense. This amount will be tracked in your "Own Amt Paid" on the dashboard and reduce your next month's payment.
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
