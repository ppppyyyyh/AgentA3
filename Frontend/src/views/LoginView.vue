<script setup>
import loginBg from '@/assets/campus-login-landscape-v2.png'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login, register } from '../api/user'
import { setToken, setUserInfo } from '../utils/auth'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const mode = ref('login')
const form = reactive({ username: 'test_student', password: 'admin123' })
const registerForm = reactive({ username: '', password: '', confirmPassword: '' })

function togglePassword() { showPassword.value = !showPassword.value }
function switchMode(target) {
  mode.value = target
  errorMessage.value = ''
  successMessage.value = ''
  showPassword.value = false
}

async function handleLogin() {
  errorMessage.value = ''
  if (!form.username.trim()) return void (errorMessage.value = '请输入用户名')
  if (!form.password || form.password.length < 6) return void (errorMessage.value = '密码长度至少6位')
  loading.value = true
  try {
    const result = await login({ username: form.username.trim(), password: form.password })
    const user = result.data || {}
    setToken(user.token)
    setUserInfo({
      id: user.id, userId: user.id, username: user.username, role: user.role,
      phone: user.phone, realName: user.realName, college: user.college,
      major: user.major, className: user.className, personalNumber: user.personalNumber,
      studentId: user.personalNumber, avatar: user.avatar,
    })
    router.replace('/home')
  } catch (error) {
    errorMessage.value = error.message || '登录失败'
  } finally { loading.value = false }
}

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''
  if (registerForm.username.trim().length < 3) return void (errorMessage.value = '用户名长度至少3位')
  if (!registerForm.password || registerForm.password.length < 6) return void (errorMessage.value = '密码长度至少6位')
  if (registerForm.password !== registerForm.confirmPassword) return void (errorMessage.value = '两次输入的密码不一致')
  loading.value = true
  try {
    await register({ username: registerForm.username.trim(), password: registerForm.password, role: 'STUDENT' })
    form.username = registerForm.username.trim()
    form.password = ''
    registerForm.password = ''
    registerForm.confirmPassword = ''
    mode.value = 'login'
    showPassword.value = false
    successMessage.value = '注册成功，请使用新账号登录'
  } catch (error) {
    errorMessage.value = error.message || '注册失败'
  } finally { loading.value = false }
}
</script>

<template>
  <main class="login-page" :style="{ backgroundImage: `url(${loginBg})` }">
    <header class="site-brand" aria-label="校园智学">
      <svg viewBox="0 0 64 56" fill="none" aria-hidden="true">
        <path d="M9 31V14c9 0 17 3 23 9v24C25 40 17 37 9 37v-6Z" />
        <path d="M55 31V14c-9 0-17 3-23 9v24c7-7 15-10 23-10v-6Z" />
        <path d="M6 43c10-1 19 1 26 7 7-6 16-8 26-7" />
        <path class="brand-gold" d="M18 13 32 3l14 10" />
      </svg>
      <strong>校园智学</strong>
    </header>

    <section class="login-panel">
      <div class="panel-title">
        <small>{{ mode === 'login' ? 'WELCOME' : 'JOIN US' }}</small>
        <h1>{{ mode === 'login' ? '欢迎登录' : '注册账号' }}</h1>
        <i></i>
      </div>

      <form v-if="mode === 'login'" class="login-form" @submit.prevent="handleLogin">
        <label class="input-field">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4.2 3.3-6.3 7.5-6.3s6.7 2.1 7.5 6.3"/></svg>
          <input v-model="form.username" autocomplete="username" placeholder="手机号 / 学号 / 用户名" />
        </label>
        <label class="input-field">
          <svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="密码" />
          <button type="button" class="password-toggle" :aria-label="showPassword ? '隐藏密码' : '显示密码'" @click="togglePassword">
            <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none"><path d="m3 3 18 18M10.5 6.2c.5-.1 1-.2 1.5-.2 6 0 9.5 6 9.5 6a16 16 0 0 1-2.1 2.8M6.1 6.2C3.7 8 2.5 12 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.7-.4"/></svg>
          </button>
        </label>
        <p v-if="successMessage" class="form-message success">{{ successMessage }}</p>
        <p v-if="errorMessage" class="form-message error">{{ errorMessage }}</p>
        <div class="button-group">
          <button class="submit-btn" :disabled="loading" type="submit">
            <span v-if="loading" class="spinner"></span><span>{{ loading ? '登录中...' : '登录' }}</span>
            <svg v-if="!loading" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5"/></svg>
          </button>
          <button class="register-btn" type="button" @click="switchMode('register')">注册账号</button>
        </div>
      </form>

      <form v-else class="login-form" @submit.prevent="handleRegister">
        <label class="input-field"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4.2 3.3-6.3 7.5-6.3s6.7 2.1 7.5 6.3"/></svg><input v-model="registerForm.username" autocomplete="username" placeholder="请设置账号（3-50位）" /></label>
        <label class="input-field"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input v-model="registerForm.password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="请设置密码（至少6位）" /><button type="button" class="password-toggle" @click="togglePassword"><svg viewBox="0 0 24 24" fill="none"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg></button></label>
        <label class="input-field"><svg viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input v-model="registerForm.confirmPassword" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="请再次输入密码" /></label>
        <p v-if="errorMessage" class="form-message error">{{ errorMessage }}</p>
        <div class="button-group">
          <button class="submit-btn" :disabled="loading" type="submit"><span v-if="loading" class="spinner"></span><span>{{ loading ? '注册中...' : '注册账号' }}</span></button>
          <button class="register-btn" type="button" @click="switchMode('login')">返回登录</button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
/* 校园智学登录页 */
.login-page {
  position: relative; display: flex; min-height: 100vh; align-items: center; justify-content: flex-end;
  padding: clamp(92px, 10vh, 140px) clamp(48px, 8vw, 140px) 48px; overflow: hidden;
  background-color: #dff4f1; background-position: center; background-size: cover;
  color: #123d43; font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
}
.login-page::after { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(224,247,244,.06), transparent 45%, rgba(226,246,242,.12)); content: ''; pointer-events: none; }
.site-brand { position: absolute; top: clamp(28px, 5vh, 62px); left: clamp(34px, 5vw, 86px); z-index: 2; display: flex; align-items: center; gap: 15px; color: #103b42; }
.site-brand svg { width: 58px; height: 52px; stroke: #237f77; stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
.site-brand .brand-gold { stroke: #c99e51; }
.site-brand strong { font-family: "STKaiti", "KaiTi", serif; font-size: clamp(27px, 2.2vw, 38px); font-weight: 700; letter-spacing: .12em; }
.login-panel { position: relative; z-index: 2; width: min(100%, 470px); padding: 54px 52px 44px; border: 1px solid rgba(255,255,255,.68); border-radius: 28px; background: rgba(255,255,252,.9); box-shadow: 0 24px 65px rgba(38,105,98,.16); backdrop-filter: blur(18px); }
.panel-title { margin-bottom: 34px; }
.panel-title small { display: block; margin-bottom: 6px; color: #3b8c83; font-size: 11px; font-weight: 700; letter-spacing: .22em; }
.panel-title h1 { margin: 0; color: #112f35; font-family: "STKaiti", "KaiTi", serif; font-size: 42px; line-height: 1.2; }
.panel-title i { display: block; width: 48px; height: 3px; margin-top: 12px; border-radius: 99px; background: #218b7d; }
.login-form { display: grid; gap: 18px; }
.input-field { display: flex; min-height: 58px; align-items: center; gap: 14px; padding: 0 18px; border: 1px solid rgba(85,118,124,.28); border-radius: 12px; background: rgba(255,255,255,.72); transition: border-color .2s, box-shadow .2s, background .2s; }
.input-field:hover { border-color: rgba(33,139,125,.42); }
.input-field:focus-within { border-color: #278d80; background: rgba(255,255,255,.94); box-shadow: 0 0 0 3px rgba(39,141,128,.1); }
.input-field > svg, .password-toggle svg { width: 22px; height: 22px; flex: 0 0 auto; stroke: #75878b; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.input-field input { width: 100%; min-width: 0; height: 56px; border: 0; outline: 0; background: transparent; color: #153d42; font: inherit; font-size: 15px; }
.input-field input::placeholder { color: #879397; }
.password-toggle { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; padding: 0; border: 0; border-radius: 8px; background: transparent; cursor: pointer; }
.password-toggle:hover { background: rgba(35,127,119,.08); }
.form-message { margin: 0; padding: 10px 13px; border-radius: 9px; font-size: 13px; }
.form-message.error { border: 1px solid #f2c7bd; background: #fff5f2; color: #ad4337; }
.form-message.success { border: 1px solid #b9ddcf; background: #f1faf6; color: #26725f; }
.button-group { display: grid; gap: 14px; margin-top: 8px; }
.submit-btn, .register-btn { display: flex; height: 58px; align-items: center; justify-content: center; border-radius: 12px; font: inherit; font-size: 16px; font-weight: 700; letter-spacing: .12em; cursor: pointer; transition: transform .2s, box-shadow .2s, background .2s; }
.submit-btn { position: relative; gap: 12px; border: 0; background: linear-gradient(110deg,#3ba493,#267b70); color: #fff; box-shadow: 0 10px 22px rgba(31,126,113,.22); }
.submit-btn > svg { position: absolute; right: 14px; width: 28px; height: 28px; padding: 6px; border-radius: 50%; background: rgba(255,255,255,.88); stroke: #267b70; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.submit-btn:hover:not(:disabled), .register-btn:hover { transform: translateY(-1px); }
.submit-btn:disabled { opacity: .65; cursor: not-allowed; }
.register-btn { border: 1.5px solid #278779; background: rgba(255,255,255,.55); color: #267b70; }
.register-btn:hover { background: rgba(239,250,246,.9); }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 900px) {
  .login-page { justify-content: center; padding: 112px 24px 34px; background-position: 42% center; }
  .login-page::before { position: absolute; inset: 0; background: rgba(228,247,244,.26); content: ''; }
  .site-brand { top: 28px; left: 28px; }
  .site-brand svg { width: 46px; height: 42px; }
  .login-panel { width: min(100%,440px); padding: 42px 34px 34px; }
}
@media (max-width: 520px) {
  .login-page { align-items: flex-start; padding: 105px 14px 24px; }
  .site-brand strong { font-size: 25px; }
  .login-panel { padding: 34px 24px 28px; border-radius: 22px; }
  .panel-title { margin-bottom: 26px; }
  .panel-title h1 { font-size: 34px; }
  .input-field, .submit-btn { min-height: 54px; }
}
</style>
