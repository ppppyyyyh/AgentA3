import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { login } from '../../api/user'
import { setToken, setUserInfo } from '../../utils/storage'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  // 开发默认账号：Web 后台仅限管理员/商家登录（weblogin），故默认填 test_admin
  const [formData, setFormData] = useState({
    username: 'test_admin',
    password: 'admin123',
  })
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    if (errorText) setErrorText('')
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorText('')

    if (!formData.username || !formData.password) {
      const warning = '请输入用户名和密码'
      setErrorText(warning)
      message.warning(warning)
      return
    }

    setLoading(true)
    try {
      const res = await login({
        username: formData.username,
        password: formData.password,
      })

      if (res.code === 200) {
        const { token, username, role, phone } = res.data
        setToken(token)
        setUserInfo({ username, role, phone })
        message.success('登录成功')
        navigate('/home')
      }
    } catch (error) {
      console.error('登录失败:', error)
      const loginError = error?.message || '登录失败，请检查用户名和密码'
      setErrorText(loginError)
      message.error(loginError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <header className="page-brand" aria-label="校园智学">
        <svg className="brand-mark" viewBox="0 0 52 44" fill="none" aria-hidden="true">
          <path d="M4 11c8 0 15 3 22 9v19C19 33 12 31 4 31V11Z" />
          <path d="M48 11c-8 0-15 3-22 9v19c7-6 14-8 22-8V11Z" />
          <path d="M9 7c7 1 12 4 17 9M43 7c-7 1-12 4-17 9M3 36c9 0 16 2 23 6 7-4 14-6 23-6" />
          <path d="m18 12 8-10 8 10" />
        </svg>
        <div>
          <strong>校园智学</strong>
          <span>SMART CAMPUS</span>
        </div>
      </header>

      <div className="login-box">
        <div className="login-header">
          <span className="header-ornament" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="header-line" aria-hidden="true"><b></b></span>
          <h1>校园智学</h1>
          <span className="header-line header-line-right" aria-hidden="true"><b></b></span>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">用户名</label>
            <div className="input-shell">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
              <input
                id="login-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="账号"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">密码</label>
            <div className="input-shell">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                <circle cx="12" cy="15.5" r="1" />
              </svg>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="密码"
                required
              />
              <svg className="password-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </div>
          </div>

          {errorText && (
            <div className="login-error" role="alert">
              {errorText}
            </div>
          )}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
