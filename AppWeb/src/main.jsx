import '@ant-design/v5-patch-for-react-19'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import './index.css'
import App from './App.jsx'
import AppErrorBoundary from './components/AppErrorBoundary/AppErrorBoundary.jsx'

// 确保 window.dayjs 存在，Ant Design 内部可能依赖它
window.dayjs = dayjs

// 千里江山主题：统一 Ant Design 组件为青绿、宣纸白和少量金色。
const appTheme = {
  token: {
    colorPrimary: '#148B88',
    colorInfo: '#148B88',
    colorLink: '#0F817E',
    colorBgLayout: '#EEF7F5',
    colorText: '#102F38',
    colorTextSecondary: '#526F72',
    colorBorder: '#D3E5DF',
    colorBorderSecondary: '#E2EEE9',
    borderRadius: 8,
    borderRadiusLG: 12,
    fontFamily: "'Plus Jakarta Sans', 'Avenir Next', 'PingFang SC', 'Microsoft YaHei', sans-serif",
    controlHeight: 38,
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: 'none',
    },
    Card: {
      headerBg: 'transparent',
    },
    Table: {
      headerBg: '#EDF7F4',
      headerColor: '#315D61',
      headerSplitColor: '#D3E5DF',
      rowHoverBg: '#F2FAF7',
      borderColor: '#D8E8E3',
    },
  },
}

createRoot(document.getElementById('root')).render(
  <ConfigProvider locale={zhCN} theme={appTheme}>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </ConfigProvider>,
)
