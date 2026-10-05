/**
 * 移动端全局配置（API 地址等）
 */
const trimTrailingSlash = value => String(value || '').replace(/\/+$/, '')

function detectLocalDevApiBase() {
  try {
    if (typeof location === 'undefined') return ''
    const host = location.hostname || ''
    // H5 开发环境统一走 Vite 同源代理，避免手机/模拟器把 127.0.0.1
    // 解析成自身，也避免浏览器跨域直连后端。
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') {
      return '/__backend_api__'
    }
    // 局域网访问（手机/其它设备）：前端 192.168.x.x → 同主机 8080
    if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
      return `http://${host}:8080`
    }
  } catch (error) {
    return ''
  }
  return ''
}

export function getApiBaseUrl() {
  const injected = import.meta.env?.VITE_API_BASE_URL || ''
  if (injected) return trimTrailingSlash(injected)

  const localDev = detectLocalDevApiBase()
  if (localDev) return localDev

  // #ifdef H5
  return '/__backend_api__'
  // #endif
  // #ifndef H5
  // App/小程序真机：线上经 :3000 Nginx 反代 /api → Java。
  // 可用 VITE_API_BASE_URL（.env.production）覆盖。
  return 'http://129.211.82.112:3000'
  // #endif
}

export const BASE_URL = getApiBaseUrl()

// PPT 模板配置缓存调试开关：
// true  = 跳过并清除本地缓存，每次进入 PPT 页面都请求后端，方便联调。
// false = 启用后端 TTL 缓存策略，用于线上环境。
export const PPT_OPTIONS_BYPASS_CACHE = false

// Keep this list aligned with AppBackend's AI_ASSISTANT_PUBLIC_RESOURCE_HOSTS.
// Empty is intentionally fail-closed: only same-origin /uploads and owned exports remain usable.
export const ASSISTANT_PUBLIC_RESOURCE_HOSTS = []
export const MAP_PROVIDER = 'amap'
