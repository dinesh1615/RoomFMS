import React, { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'reactstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const TABS = [
  { key: 'entry', label: '📥 Budget Entry', id: 'tab-budget-entry' },
  { key: 'part', label: '➕ Part Amount', id: 'tab-part-amt' },
  { key: 'transfer', label: '🔄 Transfer Amount', id: 'tab-transfer' },
]

export default function BudgetManager() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)
  const [activeTab, setActiveTab] = useState(params.get('tab') || 'entry')

  const [users, setUsers] = useState([])
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('success')
  const [loading, setLoading] = useState(false)

  // Budget Entry form
  const [entryForm, setEntryForm] = useState({ userId: '', amount: '', date: new Date(), description: '' })
  // Part Amount form
  const [partForm, setPartForm] = useState({ userId: '', amount: '', date: new Date(), description: '' })
  // Transfer form
  const today = new Date()
  const [transferForm, setTransferForm] = useState({
    fromMonth: today.getMonth() + 1,
    fromYear: today.getFullYear(),
    toMonth: today.getMonth() === 11 ? 1 : today.getMonth() + 2,
    toYear: today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear(),
  })

  useEffect(() => {
    api.get('/auth/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    const qParams = new URLSearchParams(location.search)
    const tab = qParams.get('tab') || 'entry'
    setActiveTab(tab)
    setMsg('')

    const qFromMonth = qParams.get('fromMonth')
    const qFromYear = qParams.get('fromYear')
    if (qFromMonth || qFromYear) {
      setTransferForm(prev => ({
        ...prev,
        fromMonth: qFromMonth ? parseInt(qFromMonth) : prev.fromMonth,
        fromYear: qFromYear ? parseInt(qFromYear) : prev.fromYear,
      }))
    }
  }, [location.search])

  const showMsg = (text, type = 'success') => {
    setMsg(text)
    setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  const handleEntrySubmit = async (e, isPartPay) => {
    e.preventDefault()
    setLoading(true)
    const form = isPartPay ? partForm : entryForm
    const payload = {
      user: { id: parseInt(form.userId) },
      amount: parseFloat(form.amount),
      date: form.date.toISOString().split('T')[0],
      entryType: isPartPay ? 'PART_PAY' : 'MONTHLY_PAY',
      description: form.description || (isPartPay ? 'Part payment' : 'Monthly payment')
    }
    try {
      await api.post('/budget/entry', payload)
      showMsg('✅ Budget entry saved successfully!')
      if (isPartPay) setPartForm({ userId: '', amount: '', date: new Date(), description: '' })
      else setEntryForm({ userId: '', amount: '', date: new Date(), description: '' })
    } catch (err) {
      showMsg('❌ ' + (err.response?.data || 'Failed to save entry.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleTransfer = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/budget/transfer?fromMonth=${transferForm.fromMonth}&fromYear=${transferForm.fromYear}&toMonth=${transferForm.toMonth}&toYear=${transferForm.toYear}`)
      showMsg('✅ Amount transferred successfully!')
    } catch (err) {
      showMsg('❌ ' + (err.response?.data || 'Transfer failed.'), 'error')
    } finally {
      setLoading(false)
    }
  }

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const currentYear = today.getFullYear()
  const years = [currentYear - 1, currentYear, currentYear + 1]

  const AlertMsg = () => msg ? (
    <div className={msgType === 'success' ? 'alert-success-custom' : 'alert-danger-custom'}
      style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontWeight: 500 }}>
      {msg}
    </div>
  ) : null

  const renderEntryForm = (isPartPay) => {
    const form = isPartPay ? partForm : entryForm
    const setForm = isPartPay ? setPartForm : setEntryForm
    const prefix = isPartPay ? 'part' : 'entry'

    return (
      <form onSubmit={e => handleEntrySubmit(e, isPartPay)}>
        <Row className="g-3">
          <Col xs={12} md={6}>
            <label className="form-label-custom">Member</label>
            <select id={`${prefix}-user`} className="form-select input-dark" value={form.userId}
              onChange={e => setForm({ ...form, userId: e.target.value })} required>
              <option value="">— Select Member —</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.mobile})</option>)}
            </select>
          </Col>
          <Col xs={12} md={6}>
            <label className="form-label-custom">Amount (₹)</label>
            <input id={`${prefix}-amount`} type="number" className="form-control input-dark"
              placeholder="Enter amount" value={form.amount} min={1}
              onChange={e => setForm({ ...form, amount: e.target.value })} required />
          </Col>
          <Col xs={12} md={6}>
            <label className="form-label-custom">Date</label>
            <DatePicker
              selected={form.date}
              onChange={date => setForm({ ...form, date })}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              className="form-control input-dark"
              id={`${prefix}-date`}
            />
          </Col>
          <Col xs={12} md={6}>
            <label className="form-label-custom">
              Description {isPartPay ? <span style={{ color: '#ef4444' }}>*</span> : '(Optional)'}
            </label>
            <input id={`${prefix}-desc`} type="text" className="form-control input-dark"
              placeholder={isPartPay ? 'e.g., Emergency repair, etc.' : 'Monthly contribution'}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required={isPartPay} />
          </Col>
          <Col xs={12}>
            <button id={`btn-${prefix}-submit`} type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
              {loading ? <Spinner size="sm" className="me-2" /> : null}
              {isPartPay ? '➕ Add Part Amount' : '📥 Save Budget Entry'}
            </button>
          </Col>
        </Row>
      </form>
    )
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="section-title">💰 Budget Manager</h1>
        <p className="section-subtitle">Manage room budget entries and transfers</p>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.key} id={tab.id}
            onClick={() => navigate(`/budget?tab=${tab.key}`)}
            style={{
              padding: '0.55rem 1.2rem',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeTab === tab.key
                ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))'
                : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.key ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card p-4">
        <AlertMsg />

        {activeTab === 'entry' && (
          <>
            <h5 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              📥 Monthly Budget Entry
              <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                — Record monthly contributions from members
              </span>
            </h5>
            {renderEntryForm(false)}
          </>
        )}

        {activeTab === 'part' && (
          <>
            <h5 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              ➕ Part Amount Entry
              <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                — Record additional contributions when room needs extra money
              </span>
            </h5>
            {renderEntryForm(true)}
          </>
        )}

        {activeTab === 'transfer' && (
          <>
            <h5 style={{ fontWeight: 700, marginBottom: '1.5rem', fontSize: '1rem' }}>
              🔄 Transfer Remaining Balance
              <span style={{ marginLeft: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                — Carry forward remaining budget to next month
              </span>
            </h5>
            <form onSubmit={handleTransfer}>
              <Row className="g-3">
                <Col xs={12}>
                  <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ⚠️ This will transfer the entire remaining balance from the selected month to the next month's budget. The source month balance will be reset to ₹0.
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <label className="form-label-custom">From Month</label>
                  <div className="d-flex gap-2">
                    <select id="transfer-from-month" className="form-select input-dark"
                      value={transferForm.fromMonth} onChange={e => setTransferForm({ ...transferForm, fromMonth: parseInt(e.target.value) })}>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select id="transfer-from-year" className="form-select input-dark" style={{ maxWidth: '110px' }}
                      value={transferForm.fromYear} onChange={e => setTransferForm({ ...transferForm, fromYear: parseInt(e.target.value) })}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <label className="form-label-custom">To Month</label>
                  <div className="d-flex gap-2">
                    <select id="transfer-to-month" className="form-select input-dark"
                      value={transferForm.toMonth} onChange={e => setTransferForm({ ...transferForm, toMonth: parseInt(e.target.value) })}>
                      {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                    <select id="transfer-to-year" className="form-select input-dark" style={{ maxWidth: '110px' }}
                      value={transferForm.toYear} onChange={e => setTransferForm({ ...transferForm, toYear: parseInt(e.target.value) })}>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </Col>
                <Col xs={12}>
                  <button id="btn-transfer-submit" type="submit" className="btn btn-primary-custom px-4" disabled={loading}>
                    {loading ? <Spinner size="sm" className="me-2" /> : null}
                    🔄 Transfer Balance
                  </button>
                </Col>
              </Row>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
