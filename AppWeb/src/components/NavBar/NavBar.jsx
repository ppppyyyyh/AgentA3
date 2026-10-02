import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BookOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CommentOutlined,
  CompassOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  FundOutlined,
  GiftOutlined,
  HomeOutlined,
  LayoutOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MessageOutlined,
  MinusOutlined,
  MoreOutlined,
  NotificationOutlined,
  AudioOutlined,
  PieChartOutlined,
  PlusOutlined,
  PushpinOutlined,
  RobotOutlined,
  RocketOutlined,
  SafetyOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  VideoCameraOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { navigationSections } from '../../data/portalData'
import { clearAuth, getUserInfo } from '../../utils/storage'
import './NavBar.css'

const iconMap = {
  dashboard: <DashboardOutlined />,
  team: <TeamOutlined />,
  calendar: <CalendarOutlined />,
  tags: <TagsOutlined />,
  audit: <AuditOutlined />,
  environment: <EnvironmentOutlined />,
  notification: <NotificationOutlined />,
  message: <MessageOutlined />,
  comment: <CommentOutlined />,
  tag: <TagsOutlined />,
  alert: <AlertOutlined />,
  safety: <SafetyOutlined />,
  shop: <ShopOutlined />,
  thunder: <ThunderboltOutlined />,
  bank: <BankOutlined />,
  book: <BookOutlined />,
  home: <HomeOutlined />,
  'bar-chart': <BarChartOutlined />,
  compass: <CompassOutlined />,
  pushpin: <PushpinOutlined />,
  'line-chart': <LineChartOutlined />,
  shopping: <ShoppingOutlined />,
  'file-search': <FileSearchOutlined />,
  'file-text': <FileTextOutlined />,
  appstore: <AppstoreOutlined />,
  warning: <WarningOutlined />,
  gift: <GiftOutlined />,
  coupon: <TagsOutlined />,
  fund: <FundOutlined />,
  robot: <RobotOutlined />,
  'video-camera': <VideoCameraOutlined />,
  audio: <AudioOutlined />,
  layout: <LayoutOutlined />,
  'pie-chart': <PieChartOutlined />,
  rocket: <RocketOutlined />,
  tool: <ToolOutlined />,
  shield: <SafetyOutlined />,
  setting: <SettingOutlined />,
}

function NavBar({ mobileOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = getUserInfo()
  const defaultOpen = useMemo(
    () =>
      navigationSections.reduce((acc, section) => {
        const hasActiveChild = section.items.some((item) => (
          location.pathname === item.path ||
          (!item.exact && location.pathname.startsWith(`${item.path}/`)) ||
          (item.path === '/activity/manage' && location.pathname.startsWith('/activity/'))
        ))
        acc[section.label] = hasActiveChild || section.label === '总览'
        return acc
      }, {}),
    [location.pathname]
  )
  const [openSections, setOpenSections] = useState(defaultOpen)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    // Keep a section open when navigation activates one of its children.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenSections((prev) => ({
      ...prev,
      ...defaultOpen,
    }))
  }, [defaultOpen])

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!userMenuRef.current?.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }))
  }

  const handleLogout = () => {
    setUserMenuOpen(false)
    clearAuth()
    navigate('/')
  }

  return (
    <aside className={`navbar ${mobileOpen ? 'open' : ''}`}>
      <div
        className="navbar-brand"
        onClick={() => {
          navigate('/home')
          onClose?.()
        }}
        role="button"
        tabIndex={0}
      >
        <div className="navbar-brand-mark" aria-hidden="true">
          <svg viewBox="0 0 52 44" fill="none">
            <path d="M4 11c8 0 15 3 22 9v19C19 33 12 31 4 31V11Z" />
            <path d="M48 11c-8 0-15 3-22 9v19c7-6 14-8 22-8V11Z" />
            <path d="M9 7c7 1 12 4 17 9M43 7c-7 1-12 4-17 9M3 36c9 0 16 2 23 6 7-4 14-6 23-6" />
            <path d="m18 12 8-10 8 10" />
          </svg>
        </div>
        <div>
          <strong>校园智学</strong>
          <span>Campus Learning</span>
        </div>
      </div>

      <nav className="navbar-nav">
        {navigationSections.map((section) => (
          <section key={section.label} className="navbar-section">
            {section.path ? (
              <button
                type="button"
                className={`navbar-section-direct ${location.pathname.startsWith(section.path) ? 'active' : ''}`}
                onClick={() => {
                  navigate(section.path)
                  onClose?.()
                }}
              >
                {section.icon ? <span>{iconMap[section.icon] || <SettingOutlined />}</span> : null}
                <h4>{section.label}</h4>
              </button>
            ) : (
              <button
                type="button"
                className="navbar-section-toggle"
                onClick={() => toggleSection(section.label)}
              >
                <h4>{section.label}</h4>
                <span>{openSections[section.label] ? <MinusOutlined /> : <PlusOutlined />}</span>
              </button>
            )}
            {!section.path && <div className={`navbar-links ${openSections[section.label] ? 'expanded' : 'collapsed'}`}>
              {section.items.filter((item) => !item.hidden).map((item) => {
                const active = location.pathname === item.path ||
                  (!item.exact && location.pathname.startsWith(`${item.path}/`)) ||
                  (item.path === '/activity/manage' && location.pathname.startsWith('/activity/'))
                return (
                  <button
                    key={item.path}
                    type="button"
                    className={`navbar-link ${active ? 'active' : ''}`}
                    onClick={() => {
                      navigate(item.path)
                      onClose?.()
                    }}
                  >
                    <span className="navbar-link-icon">{iconMap[item.icon] || <SettingOutlined />}</span>
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>}
          </section>
        ))}
      </nav>

      <div className="navbar-user" ref={userMenuRef}>
        {userMenuOpen && (
          <div className="navbar-user-menu" role="menu">
            <button type="button" role="menuitem" className="navbar-logout" onClick={handleLogout}>
              <LogoutOutlined />
              <span>退出登录</span>
            </button>
          </div>
        )}
        <button
          type="button"
          className="navbar-user-trigger"
          aria-label="打开账号菜单"
          aria-expanded={userMenuOpen}
          onClick={() => setUserMenuOpen((open) => !open)}
        >
          <div className="navbar-user-avatar">{(userInfo?.username || 'A').slice(0, 1).toUpperCase()}</div>
          <div className="navbar-user-details">
            <strong>{userInfo?.username || '管理员'}</strong>
            <span>{userInfo?.role || 'System Operator'}</span>
          </div>
          <MoreOutlined className="navbar-user-more" />
        </button>
      </div>
    </aside>
  )
}

export default NavBar
