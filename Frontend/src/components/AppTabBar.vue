<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { clearAuth, getUserInfo } from '../utils/auth'

defineProps({
  embedded: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()
const showProfilePanel = ref(false)
const userInfo = computed(() => getUserInfo() || {})
const avatarUrl = computed(() => userInfo.value.avatar || '')
const displayName = computed(() => userInfo.value.realName || userInfo.value.username || '未登录')
const studentId = computed(() => userInfo.value.studentId || userInfo.value.personalNumber || '—')
const avatarText = computed(() => {
  return displayName.value.slice(0, 1).toUpperCase()
})

function toggleProfilePanel() {
  showProfilePanel.value = !showProfilePanel.value
}

function openProfileRoute(path) {
  showProfilePanel.value = false
  router.push(path)
}

function handleLogout() {
  showProfilePanel.value = false
  clearAuth()
  router.replace('/login')
}

const shortcutItems = [
  { label: '我的消息', to: '/mine/messages' },
  { label: '我的课表', to: '/mine/schedule' },
  { label: '会议日程', to: '/mine/meeting-schedule' },
  { label: '我的活动', to: '/mine/activities' },
  { label: 'AI 会话历史', to: '/mine/ai-history' },
  { label: '我的试卷', to: '/mine/papers' },
  { label: '账户设置', to: '/mine/account-settings' },
]
</script>

<template>
  <header class="app-site-header" :class="{ 'app-site-header--embedded': embedded }">
    <div class="app-site-header__inner">
      <RouterLink class="app-site-header__brand" to="/home">
        数智<span>诊断</span>港
      </RouterLink>

      <nav class="app-site-header__nav" aria-label="主导航">
        <RouterLink to="/home">首页</RouterLink>
        <RouterLink to="/map">校园地图</RouterLink>
        <RouterLink to="/activities">校园活动</RouterLink>
        <RouterLink to="/meetings">会议</RouterLink>
        <RouterLink to="/marketplace">校园市集</RouterLink>
        <RouterLink to="/discount">校园优惠</RouterLink>
        <RouterLink to="/forum">校园论坛</RouterLink>
        <RouterLink to="/ai">AI 助手</RouterLink>
        <RouterLink to="/ai-tools">AI 工具</RouterLink>
      </nav>

      <div class="app-tab-nav__profile">
        <button class="app-tab-nav__avatar" type="button" aria-label="个人头像" @click="toggleProfilePanel">
          <img v-if="avatarUrl" :src="avatarUrl" alt="" />
          <span v-else>{{ avatarText }}</span>
        </button>
        <transition name="profile-panel">
          <div v-if="showProfilePanel" class="app-tab-nav__panel">
            <section class="app-tab-nav__panel-section">
              <p class="app-tab-nav__name">{{ displayName }}</p>
              <p class="app-tab-nav__student">学号 {{ studentId }}</p>
            </section>

            <section class="app-tab-nav__panel-section app-tab-nav__panel-section--list">
              <button
                v-for="item in shortcutItems"
                :key="item.to"
                class="app-tab-nav__panel-row"
                type="button"
                @click="openProfileRoute(item.to)"
              >
                <span>{{ item.label }}</span>
                <span class="app-tab-nav__panel-arrow">›</span>
              </button>
            </section>

            <section class="app-tab-nav__panel-section">
              <button class="app-tab-nav__logout" type="button" @click="handleLogout">
                退出登录
              </button>
            </section>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  height: 60px;
  border-bottom: 1px solid rgba(223, 193, 128, 0.78);
  background: linear-gradient(105deg, #153f50 0%, #1c5f70 42%, #318898 72%, #69b4b8 100%);
  color: #f6f1df;
  box-shadow: 0 6px 22px rgba(17, 65, 74, 0.2);
  backdrop-filter: blur(14px);
  overflow: hidden;
}

.app-site-header::before {
  position: absolute;
  inset: 6px 14px;
  border: 1px solid rgba(232, 205, 146, 0.52);
  border-radius: 10px;
  content: '';
  pointer-events: none;
}

.app-site-header::after {
  position: absolute;
  right: 58px;
  bottom: 0;
  width: 250px;
  height: 58px;
  background: url('../assets/nav-mountain-ornament.svg') right bottom / contain no-repeat;
  content: '';
  opacity: 0.76;
  pointer-events: none;
}

.app-site-header--embedded {
  position: static;
}

.app-site-header__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: min(1480px, calc(100% - 40px));
  height: 100%;
  margin: 0 auto;
  gap: 18px;
}

.app-site-header__brand {
  flex: 0 0 auto;
  color: #f9f4e6;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 1px;
  text-decoration: none;
  white-space: nowrap;
}

.app-site-header__brand span {
  color: #e0ba6b;
}

.app-site-header__nav {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
  gap: 6px;
  overflow-x: auto;
  padding-right: 6px;
  scrollbar-width: none;
}

.app-site-header__nav::-webkit-scrollbar {
  display: none;
}

.app-site-header__nav a {
  display: grid;
  place-items: center;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  color: rgba(244, 246, 238, 0.82);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  flex: 0 0 auto;
  transition: all 0.2s ease;
}

.app-site-header__nav a:hover {
  color: #fffaf0;
  background: rgba(255, 255, 255, 0.1);
}

.app-site-header__nav a.router-link-active {
  color: #153f46;
  background: linear-gradient(110deg, #f5edda, #dfc17f);
  box-shadow: 0 5px 14px rgba(7, 40, 47, 0.28);
}

.app-tab-nav__avatar {
  border-color: rgba(224, 186, 107, 0.75);
  color: #f8f3e7;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 680px) {
  .app-site-header__inner {
    width: min(100%, calc(100% - 24px));
    gap: 10px;
  }

  .app-site-header__brand {
    font-size: 16px;
  }
}
</style>
