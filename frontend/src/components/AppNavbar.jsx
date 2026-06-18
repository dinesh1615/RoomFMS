import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem,
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap'
import { useAuth } from '../context/AuthContext'

export default function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [budgetOpen, setBudgetOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const isMgr = user?.role === 'FIN_MGR'

  return (
    <Navbar className="app-navbar" expand="md" dark>
      <NavbarBrand href="/" className="navbar-brand-text">
        🏠 RoomFMS
      </NavbarBrand>
      <NavbarToggler onClick={() => setCollapsed(!collapsed)} />
      <Collapse isOpen={!collapsed} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              🏡 Home
            </NavLink>
          </NavItem>

          {isMgr && (
            <Dropdown
              nav
              isOpen={budgetOpen}
              toggle={() => setBudgetOpen(!budgetOpen)}
              className="dark-dropdown"
            >
              <DropdownToggle nav caret style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>
                💰 Budget
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => navigate('/budget?tab=entry')} id="nav-budget-entry">
                  📥 Budget Entry
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/budget?tab=part')} id="nav-part-amt">
                  ➕ Part Amount
                </DropdownItem>
                <DropdownItem onClick={() => navigate('/budget?tab=transfer')} id="nav-transfer">
                  🔄 Transfer Amount
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}

          <NavItem>
            <NavLink to="/expenditure" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              🧾 Expenditure
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink to="/history" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              📋 Transaction History
            </NavLink>
          </NavItem>

          {isMgr && (
            <NavItem>
              <NavLink to="/add-user" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                👤 Add User
              </NavLink>
            </NavItem>
          )}
        </Nav>

        <Nav navbar>
          <Dropdown
            nav
            isOpen={profileOpen}
            toggle={() => setProfileOpen(!profileOpen)}
            className="dark-dropdown"
          >
            <DropdownToggle nav id="profile-menu-toggle" style={{ padding: '0.4rem 0' }}>
              <div className="profile-avatar" title={user?.name}>
                {user?.profilePhoto
                  ? <img src={user.profilePhoto} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  : initials}
              </div>
            </DropdownToggle>
            <DropdownMenu end>
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.3rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{user?.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span className={`badge-role-${isMgr ? 'admin' : 'user'}`}>
                    {isMgr ? 'Finance Manager' : 'Member'}
                  </span>
                </div>
              </div>
              <DropdownItem id="nav-edit-profile" onClick={() => navigate('/profile')}>
                ✏️ Edit Profile
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem id="nav-logout" onClick={handleLogout} style={{ color: '#ef4444' }}>
                🚪 Logout
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Nav>
      </Collapse>
    </Navbar>
  )
}
