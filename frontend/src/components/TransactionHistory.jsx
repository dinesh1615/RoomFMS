import React, { useState, useEffect } from 'react'
import { Row, Col, Spinner, Table } from 'reactstrap'
import api from '../api/axios'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [budgetHistory, setBudgetHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const today = new Date()
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const [startDate, setStartDate] = useState(firstOfMonth)
  const [endDate, setEndDate] = useState(today)
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalOwn, setTotalOwn] = useState(0)
  const [totalBudgetContributions, setTotalBudgetContributions] = useState(0)
  const [viewMode, setViewMode] = useState('expenditures') // 'expenditures' or 'budget'

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const from = startDate.toISOString().split('T')[0]
      const to = endDate.toISOString().split('T')[0]
      const res = await api.get(`/expenditures/history?startDate=${from}&endDate=${to}`)
      const data = res.data || []
      setTransactions(data)
      setTotalBudget(data.filter(t => t.paymentSource === 'BUDGET').reduce((s, t) => s + t.amount, 0))
      setTotalOwn(data.filter(t => t.paymentSource === 'OWN').reduce((s, t) => s + t.amount, 0))
    } catch {
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBudgetHistory = async () => {
    setLoading(true)
    try {
      const res = await api.get('/budget/history')
      const data = res.data || []
      setBudgetHistory(data)
      setTotalBudgetContributions(data.reduce((s, t) => s + t.amount, 0))
    } catch {
      setBudgetHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'expenditures') {
      fetchHistory()
    } else {
      fetchBudgetHistory()
    }
  }, [viewMode])

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  const formatAmt = (amt) => `₹${Number(amt).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="section-title">
            {viewMode === 'expenditures' ? '📋 Transaction History' : '💰 Budget History'}
          </h1>
          <p className="section-subtitle">
            {viewMode === 'expenditures'
              ? 'All room expenditures with details and date filters'
              : 'All budget contributions and part amounts entered by members'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button
            id="btn-toggle-expenditures"
            className={`btn ${viewMode === 'expenditures' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            onClick={() => setViewMode('expenditures')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            📋 Expenditures
          </button>
          <button
            id="btn-toggle-budget"
            className={`btn ${viewMode === 'budget' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            onClick={() => setViewMode('budget')}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            💰 Budget History
          </button>
        </div>
      </div>

      {/* Filters (Expenditures Only) */}
      {viewMode === 'expenditures' && (
        <div className="glass-card p-3 mb-4">
          <Row className="g-3 align-items-end">
            <Col xs={12} sm={4} md={3}>
              <label className="form-label-custom">From Date</label>
              <DatePicker
                selected={startDate}
                onChange={d => setStartDate(d)}
                dateFormat="dd/MM/yyyy"
                maxDate={endDate}
                className="form-control input-dark"
                id="filter-start-date"
              />
            </Col>
            <Col xs={12} sm={4} md={3}>
              <label className="form-label-custom">To Date</label>
              <DatePicker
                selected={endDate}
                onChange={d => setEndDate(d)}
                dateFormat="dd/MM/yyyy"
                minDate={startDate}
                maxDate={new Date()}
                className="form-control input-dark"
                id="filter-end-date"
              />
            </Col>
            <Col xs={12} sm={4} md={3}>
              <button
                id="btn-apply-filter"
                className="btn btn-primary-custom w-100"
                onClick={fetchHistory}
              >
                🔍 Apply Filter
              </button>
            </Col>
            <Col xs={12} sm={12} md={3}>
              <button
                id="btn-reset-filter"
                className="btn w-100"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-secondary)',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  padding: '0.55rem'
                }}
                onClick={() => {
                  setStartDate(firstOfMonth)
                  setEndDate(today)
                  setTimeout(fetchHistory, 100)
                }}
              >
                ↩️ Reset
              </button>
            </Col>
          </Row>
        </div>
      )}

      {/* Expenditure Summary Cards */}
      {viewMode === 'expenditures' && (
        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>📝</div>
              <div className="stat-label">Total Transactions</div>
              <div className="stat-value" style={{ color: 'var(--primary-light)' }}>{transactions.length}</div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🏦</div>
              <div className="stat-label">From Budget</div>
              <div className="stat-value" style={{ color: '#10b981', fontSize: '1.4rem' }}>{formatAmt(totalBudget)}</div>
            </div>
          </Col>
          <Col xs={12} sm={4}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)' }}>👛</div>
              <div className="stat-label">From Own Money</div>
              <div className="stat-value" style={{ color: '#f59e0b', fontSize: '1.4rem' }}>{formatAmt(totalOwn)}</div>
            </div>
          </Col>
        </Row>
      )}

      {/* Budget Summary Cards */}
      {viewMode === 'budget' && (
        <Row className="g-3 mb-4">
          <Col xs={12} sm={6}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>📝</div>
              <div className="stat-label">Total Contributions Count</div>
              <div className="stat-value" style={{ color: 'var(--primary-light)' }}>{budgetHistory.length}</div>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)' }}>🏦</div>
              <div className="stat-label">Total Amount Contributed</div>
              <div className="stat-value" style={{ color: '#10b981', fontSize: '1.4rem' }}>{formatAmt(totalBudgetContributions)}</div>
            </div>
          </Col>
        </Row>
      )}

      {/* Expenditure Table */}
      {viewMode === 'expenditures' && (
        <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              📊 Expenditure Records
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {transactions.length} record{transactions.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div className="spinner-wrapper">
              <Spinner color="primary" />
            </div>
          ) : transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontWeight: 600 }}>No transactions found for this date range</div>
              <div style={{ fontSize: '0.83rem', marginTop: '0.4rem' }}>Try adjusting the date filter</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table className="table-dark-custom mb-0" id="transaction-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Member</th>
                    <th>Description</th>
                    <th>Payment Source</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={t.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{i + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(t.date)}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t.user?.name || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.user?.mobile}</div>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{t.description}</div>
                      </td>
                      <td>
                        <span className={t.paymentSource === 'BUDGET' ? 'badge-budget' : 'badge-own'}>
                          {t.paymentSource === 'BUDGET' ? '🏦 Budget' : '👛 Own'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: t.paymentSource === 'BUDGET' ? '#10b981' : '#f59e0b' }}>
                        {formatAmt(t.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)' }}>
                    <td colSpan={5} style={{ fontWeight: 700, padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      Total Expenditure
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: 'var(--primary-light)', padding: '0.85rem 1rem' }}>
                      {formatAmt(totalBudget + totalOwn)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </div>
      )}

      {/* Budget Table */}
      {viewMode === 'budget' && (
        <div className="glass-card p-0" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              📊 Budget Entry Records
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {budgetHistory.length} record{budgetHistory.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div className="spinner-wrapper">
              <Spinner color="primary" />
            </div>
          ) : budgetHistory.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📭</div>
              <div style={{ fontWeight: 600 }}>No budget entries found</div>
              <div style={{ fontSize: '0.83rem', marginTop: '0.4rem' }}>Contributions will appear here once saved in Budget Manager</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <Table className="table-dark-custom mb-0" id="budget-history-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Member</th>
                    <th>Entry Type</th>
                    <th>Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetHistory.map((b, i) => (
                    <tr key={b.id}>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{i + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(b.date)}</td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{b.user?.name || '—'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.mobile}</div>
                      </td>
                      <td>
                        <span className={b.entryType === 'MONTHLY_PAY' ? 'badge-role-admin' : 'badge-own'}>
                          {b.entryType === 'MONTHLY_PAY' ? '📥 Monthly' : '➕ Part Pay'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '220px' }}>
                        <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{b.description}</div>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                        {formatAmt(b.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)' }}>
                    <td colSpan={5} style={{ fontWeight: 700, padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                      Total Budget Capital
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '1rem', color: '#10b981', padding: '0.85rem 1rem' }}>
                      {formatAmt(totalBudgetContributions)}
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
