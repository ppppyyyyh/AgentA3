<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppTabBar from '../components/AppTabBar.vue'
import {
  claimDiscountActivity,
  favoriteActivity,
  getDiscountActivityDetail,
  getDiscountActivityList,
  getDiscountCategories,
  getMyClaims,
  getMyFavorites,
  unfavoriteActivity,
} from '../api/discount'

const loading = ref(true)
const route = useRoute()
const items = ref([])
const keyword = ref('')
const selected = ref(null)
const page = ref(1)
const pageSize = 9
const total = ref(0)
const activeSection = ref('offers')
const categories = ref([])
const selectedCategory = ref('')

const sections = [
  ['offers', '优惠广场'],
  ['favorites', '我的收藏'],
  ['claims', '领取记录'],
]

const STATUS_MAP = {
  0: { text: '未开始', cls: 'badge-default' },
  1: { text: '进行中', cls: 'badge-active' },
  2: { text: '已领完', cls: 'badge-warning' },
  3: { text: '已结束', cls: 'badge-ended' },
  4: { text: '已下架', cls: 'badge-offline' },
}

const STATUS_ORDER = { 1: 0, 0: 1, 2: 2, 3: 3, 4: 4 }

function resolveList(raw) {
  let records
  if (raw?.data?.records) {
    total.value = raw.data.total || 0
    records = raw.data.records
  } else if (raw?.records) {
    total.value = raw.total || 0
    records = raw.records
  } else if (Array.isArray(raw)) {
    total.value = raw.length
    records = raw
  } else {
    total.value = 0
    return []
  }
  records.sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))
  return records
}

const displayedItems = computed(() => {
  if (activeSection.value === 'offers') return items.value
  const query = keyword.value.trim().toLowerCase()
  if (!query) return items.value
  return items.value.filter((item) => `${item.title || ''} ${item.merchantName || ''}`.toLowerCase().includes(query))
})

const emptyText = computed(() => {
  if (activeSection.value === 'favorites') return '暂未收藏优惠'
  if (activeSection.value === 'claims') return '暂无领取记录'
  return '暂无优惠活动'
})

async function load() {
  loading.value = true
  try {
    if (activeSection.value === 'offers') {
      items.value = resolveList(await getDiscountActivityList({
        current: page.value,
        size: pageSize,
        categoryId: selectedCategory.value || undefined,
        keyword: keyword.value || undefined,
      }))
    } else if (activeSection.value === 'favorites') {
      items.value = resolveList(await getMyFavorites({ current: page.value, size: pageSize }))
    } else {
      items.value = resolveList(await getMyClaims({ current: page.value, size: pageSize }))
    }
  } catch {
    items.value = []
    total.value = 0
  }
  loading.value = false
}

function search() {
  page.value = 1
  if (activeSection.value === 'offers') load()
}

function switchSection(section) {
  activeSection.value = section
  page.value = 1
  keyword.value = ''
  load()
}

function openCategory(categoryId) {
  activeSection.value = 'offers'
  selectedCategory.value = categoryId
  keyword.value = ''
  page.value = 1
  load()
}

function goToPage(p) {
  page.value = p
  load()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function open(item) {
  const activityId = item.activityId || item.id
  try {
    const res = await getDiscountActivityDetail(activityId)
    selected.value = res?.data || res
  } catch { selected.value = item }
}

async function toggleFav(item) {
  try {
    if (item.isFavorited) {
      await unfavoriteActivity(item.id)
      item.isFavorited = false
    } else {
      await favoriteActivity(item.id)
      item.isFavorited = true
    }
    if (selected.value) selected.value.isFavorited = item.isFavorited
  } catch (e) { alert(e.message) }
}

async function claim(item) {
  try {
    await claimDiscountActivity(item.id)
    alert('领取成功，可在“领取记录”中查看')
    selected.value = null
    await load()
  } catch (e) { alert(e.message) }
}

function fmt(t) {
  if (!t) return ''
  const d = t.replace('T', ' ')
  return d.length >= 16 ? d.slice(0, 16) : d
}

onMounted(async () => {
  keyword.value = String(route.query.keyword || '')
  try {
    const response = await getDiscountCategories()
    const list = response?.data || response
    categories.value = Array.isArray(list) ? list.filter((item) => item.status === undefined || Number(item.status) === 1) : []
  } catch { categories.value = [] }
  await load()
})
</script>

<template>
  <div class="discount-page">
    <AppTabBar />

    <main class="discount-container">
      <header class="discount-heading">
        <div class="discount-heading__left">
          <h1>校园优惠</h1>
          <p>精选校园周边商家优惠券，线下领取享折扣</p>
        </div>
      </header>

      <div class="discount-layout">
        <aside class="discount-sidebar">
          <h2>优惠中心</h2>
          <nav class="discount-sidebar__nav" aria-label="优惠功能">
            <button
              v-for="[value, label] in sections"
              :key="value"
              type="button"
              :class="{ active: activeSection === value }"
              @click="switchSection(value)"
            >
              {{ label }}
            </button>
          </nav>

          <div class="discount-sidebar__group">
            <h3>优惠分类</h3>
            <button
              type="button"
              :class="{ active: !selectedCategory }"
              @click="openCategory('')"
            >
              全部优惠
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              :class="{ active: String(selectedCategory) === String(category.id) && activeSection === 'offers' }"
              @click="openCategory(category.id)"
            >
              {{ category.categoryName || category.name }}
            </button>
          </div>
        </aside>

        <section class="discount-content">
          <form class="discount-search" @submit.prevent="search">
            <img src="/icons/search.svg" alt="" />
            <input
              v-model="keyword"
              type="search"
              :placeholder="activeSection === 'offers' ? '搜索商家名称或优惠内容' : '搜索当前记录'"
            />
            <button v-if="keyword" type="button" class="discount-search__clear" aria-label="清除搜索" @click="keyword = ''; search()">×</button>
            <button class="discount-search__btn" type="submit">搜索</button>
          </form>

          <div v-if="loading" class="discount-empty">正在加载优惠数据…</div>

          <div v-else-if="!displayedItems.length" class="discount-empty">
            <span class="discount-empty__mark" aria-hidden="true">券</span>
            <p>{{ emptyText }}</p>
          </div>

          <div v-else class="discount-grid">
            <article
              v-for="item in displayedItems"
              :key="item.activityId || item.id"
              class="discount-card"
              tabindex="0"
              @click="open(item)"
              @keyup.enter="open(item)"
            >
              <div class="discount-card__visual">
                <img
                  v-if="item.coverImage"
                  :src="item.coverImage"
                  alt=""
                  class="discount-card__img"
                />
                <div v-else class="discount-card__placeholder"><span>券</span></div>
                <span
                  v-if="item.status !== undefined"
                  :class="['discount-badge', STATUS_MAP[item.status]?.cls]"
                >
                  {{ item.statusText || STATUS_MAP[item.status]?.text || '未知' }}
                </span>
                <button
                  v-if="activeSection !== 'claims'"
                  type="button"
                  class="discount-card__favorite"
                  :class="{ active: item.isFavorited }"
                  :aria-label="item.isFavorited ? '取消收藏' : '收藏优惠'"
                  @click.stop="toggleFav(item)"
                >
                  {{ item.isFavorited ? '★' : '☆' }}
                </button>
              </div>
              <div class="discount-card__body">
                <span class="discount-card__merchant">{{ item.merchantName || '校园商家' }}</span>
                <h3 class="discount-card__title">{{ item.title }}</h3>
                <div class="discount-card__meta">
                  <span v-if="activeSection === 'claims' && item.claimTime">领取于 {{ fmt(item.claimTime) }}</span>
                  <span v-else-if="item.endTime">有效期至 {{ fmt(item.endTime) }}</span>
                  <span v-else>查看优惠详情</span>
                  <span>查看详情 →</span>
                </div>
              </div>
            </article>
          </div>

          <div v-if="total > 0" class="discount-pagination">
            <button class="discount-pagination__btn" :disabled="page === 1" @click="goToPage(page - 1)">← 上一页</button>
            <span class="discount-pagination__info">第 {{ page }} / {{ Math.max(1, Math.ceil(total / pageSize)) }} 页（共 {{ total }} 条）</span>
            <button class="discount-pagination__btn" :disabled="page >= Math.ceil(total / pageSize)" @click="goToPage(page + 1)">下一页 →</button>
          </div>
        </section>
      </div>
    </main>

    <!-- Detail Modal -->
    <div
      v-if="selected"
      class="discount-overlay"
      @click.self="selected = null"
    >
      <div class="discount-detail">
        <button class="discount-detail__back" @click="selected = null">
          ← 返回
        </button>

        <img
          v-if="selected.coverImage"
          :src="selected.coverImage"
          alt=""
          class="discount-detail__img"
        />
        <div v-else class="discount-detail__img discount-detail__img--empty">🎫</div>

        <span
          v-if="selected.status !== undefined"
          :class="['discount-badge', STATUS_MAP[selected.status]?.cls]"
          style="margin-top: 12px; display: inline-flex;"
        >
          {{ STATUS_MAP[selected.status]?.text || '未知' }}
        </span>

        <h2>{{ selected.title }}</h2>

        <div class="discount-detail__merchant">
          <span class="discount-detail__merchant-icon">店</span>
          <span>{{ selected.merchantName || '校园商家' }}</span>
        </div>

        <p v-if="selected.description" class="discount-detail__desc">
          {{ selected.description }}
        </p>

        <dl v-if="selected.startTime || selected.endTime || selected.merchantAddress || selected.useRules">
          <div v-if="selected.startTime || selected.endTime">
            <dt>活动时间</dt>
            <dd>
              <template v-if="selected.startTime">{{ fmt(selected.startTime) }}</template>
              <template v-if="selected.startTime && selected.endTime"> ~ </template>
              <template v-if="selected.endTime">{{ fmt(selected.endTime) }}</template>
              <template v-if="!selected.startTime && !selected.endTime">时间待定</template>
            </dd>
          </div>
          <div v-if="selected.merchantAddress">
            <dt>领取地点</dt>
            <dd>{{ selected.merchantAddress }}</dd>
          </div>
          <div v-if="selected.useRules">
            <dt>使用规则</dt>
            <dd class="discount-detail__rules">{{ selected.useRules }}</dd>
          </div>
        </dl>

        <div class="discount-detail__actions">
          <button
            :class="['discount-detail__fav', { 'discount-detail__fav--active': selected.isFavorited }]"
            @click="toggleFav(selected)"
          >
            {{ selected.isFavorited ? '★ 已收藏' : '☆ 收藏' }}
          </button>
          <button
            v-if="selected.status === 1 && activeSection !== 'claims'"
            class="discount-detail__claim"
            type="button"
            @click="claim(selected)"
          >
            立即领取
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page Background ===== */
.discount-page {
  min-height: 100vh;
  background: linear-gradient(175deg, #f0f4fa 0%, #f5f8fc 35%, #fafbfd 100%);
  position: relative;
  overflow: hidden;
}

/* Subtle decorative blobs */
.discount-page::before {
  content: '';
  position: fixed;
  top: -180px;
  right: -120px;
  width: 520px;
  height: 520px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.025) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.discount-page::after {
  content: '';
  position: fixed;
  bottom: -120px;
  left: -80px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.02) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.discount-container {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 88px 24px 64px;
}

/* ===== Heading ===== */
.discount-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.discount-heading__left h1 {
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
  letter-spacing: -0.3px;
}

.discount-heading__left p {
  font-size: 14.5px;
  color: #7a8ca5;
  margin: 0;
}

/* ===== Search ===== */
.discount-search {
  display: flex;
  gap: 10px;
}

.discount-search input {
  width: 260px;
  height: 44px;
  padding: 0 16px;
  border: 1.5px solid rgba(100, 140, 180, 0.12);
  border-radius: 10px;
  font-size: 14px;
  background: #ffffff;
  outline: none;
  transition: all 0.25s;
  box-shadow: 0 2px 10px rgba(30, 80, 130, 0.06);
  box-sizing: border-box;
  color: #334155;
}

.discount-search input::placeholder {
  color: #b0bec5;
  font-weight: 400;
}

.discount-search input:focus {
  border-color: #3b82f6;
  box-shadow: 0 2px 16px rgba(59, 130, 246, 0.1);
}

.discount-search__btn {
  height: 44px;
  padding: 0 24px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.18);
  box-sizing: border-box;
  white-space: nowrap;
}

.discount-search__btn:hover {
  background: #3b82f6;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.3);
}

.discount-search__btn:active {
  transform: scale(0.97);
}

/* ===== Empty State ===== */
.discount-empty {
  text-align: center;
  padding: 72px 20px;
  background: #ffffff;
  border-radius: 16px;
  color: #7a8ca5;
  font-size: 14.5px;
  box-shadow: 0 2px 12px rgba(30, 70, 110, 0.04);
}

.discount-empty__icon {
  font-size: 52px;
  margin-bottom: 14px;
}

/* ===== Grid ===== */
.discount-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 800px) {
  .discount-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 520px) {
  .discount-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

/* ===== Card ===== */
.discount-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0 18px;
  border: 1px solid rgba(100, 140, 180, 0.08);
  border-radius: 16px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  font: inherit;
  color: inherit;
  box-shadow: 0 4px 18px rgba(30, 70, 110, 0.07);
}

.discount-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 14px 36px rgba(30, 70, 110, 0.13);
}

.discount-card:active {
  transform: translateY(-2px);
}

/* ===== Card Cover ===== */
.discount-card__img {
  display: block;
  width: 100%;
  height: 170px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.discount-card:hover .discount-card__img {
  transform: scale(1.03);
}

.discount-card__placeholder {
  width: 100%;
  height: 170px;
  background: linear-gradient(145deg, #e8f0fe 0%, #dce8fa 40%, #eef2ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 44px;
  position: relative;
  transition: transform 0.3s ease;
}

/* Subtle decorative circles on placeholder */
.discount-card__placeholder::before {
  content: '';
  position: absolute;
  top: -28px;
  right: -18px;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.discount-card__placeholder::after {
  content: '';
  position: absolute;
  bottom: -22px;
  left: -14px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  pointer-events: none;
}

.discount-card:hover .discount-card__placeholder {
  transform: scale(1.03);
}

/* ===== Status Badge (capsule) ===== */
.discount-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 600;
  margin: 14px 16px 0;
  letter-spacing: 0.2px;
  width: fit-content;
}

.badge-active {
  background: rgba(34, 197, 94, 0.12);
  color: #15803d;
}

.badge-warning {
  background: rgba(249, 115, 22, 0.12);
  color: #c2410c;
}

.badge-ended,
.badge-default {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

.badge-offline {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

/* ===== Card Info ===== */
.discount-card__merchant {
  display: block;
  margin: 8px 16px 0;
  font-size: 13px;
  color: #8a9aaf;
  font-weight: 500;
}

.discount-card__title {
  margin: 6px 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #17233c;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ===== Detail Overlay ===== */
.discount-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  overflow-y: auto;
}

.discount-detail {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 18px;
  padding: 28px;
  animation: detailIn 0.25s ease-out;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.18);
}

@keyframes detailIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.discount-detail__back {
  border: none;
  background: rgba(59, 130, 246, 0.06);
  color: #3b82f6;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 8px;
  margin-bottom: 18px;
  transition: background 0.2s;
}

.discount-detail__back:hover {
  background: rgba(59, 130, 246, 0.12);
}

.discount-detail__img {
  width: 100%;
  height: 210px;
  object-fit: cover;
  border-radius: 14px;
}

.discount-detail__img--empty {
  background: linear-gradient(145deg, #e8f0fe 0%, #dce8fa 40%, #eef2ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52px;
}

.discount-detail h2 {
  font-size: 21px;
  font-weight: 700;
  color: #0f172a;
  margin: 16px 0 8px;
  letter-spacing: -0.2px;
}

.discount-detail__merchant {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 14px;
}

.discount-detail__merchant-icon {
  font-size: 16px;
}

.discount-detail__desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 0 0 18px;
}

.discount-detail dl {
  border-top: 1px solid #eef1f5;
  padding-top: 14px;
  margin: 0;
}

.discount-detail dl div {
  display: flex;
  padding: 10px 0;
  font-size: 14px;
}

.discount-detail dt {
  width: 80px;
  flex-shrink: 0;
  color: #94a3b8;
  font-weight: 500;
}

.discount-detail dd {
  margin: 0;
  color: #334155;
}

.discount-detail__rules {
  white-space: pre-wrap;
}

.discount-detail__actions {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #eef1f5;
}

.discount-detail__fav {
  width: 100%;
  padding: 13px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.discount-detail__fav--active {
  border-color: #f43f5e;
  color: #f43f5e;
  background: rgba(244, 63, 94, 0.04);
}

.discount-detail__fav:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.discount-detail__fav--active:hover {
  border-color: #e11d48;
  color: #e11d48;
}

/* ===== Pagination ===== */
.discount-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 36px;
  padding: 20px;
}

.discount-pagination__btn {
  padding: 10px 22px;
  border: 1.5px solid rgba(100, 140, 180, 0.15);
  border-radius: 10px;
  background: #ffffff;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(30, 70, 110, 0.05);
}

.discount-pagination__btn:hover:not(:disabled) {
  border-color: #3b82f6;
  color: #2563eb;
  background: #f0f6ff;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.12);
}

.discount-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.discount-pagination__info {
  font-size: 13.5px;
  color: #7a8ca5;
  font-weight: 500;
  white-space: nowrap;
}

/* ===== Campus discount center redesign ===== */
.discount-page {
  min-height: 100vh;
  overflow: visible;
  color: #263e43;
  background: transparent;
  font-family: 'Source Han Sans SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif;
}

.discount-page::before {
  z-index: 0;
  inset: 60px 0 0;
  width: auto;
  height: auto;
  border-radius: 0;
  background: linear-gradient(180deg, rgba(250, 248, 240, 0.9), rgba(249, 247, 239, 0.82) 48%, rgba(247, 246, 239, 0.88));
}

.discount-page::after {
  display: none;
}

.discount-container {
  width: min(1320px, calc(100% - 40px));
  max-width: none;
  padding: 88px 0 56px;
}

.discount-heading {
  position: relative;
  align-items: flex-start;
  padding: 12px 0 12px 22px;
  margin-bottom: 22px;
}

.discount-heading::before {
  position: absolute;
  inset: 12px auto 12px 0;
  width: 4px;
  border-radius: 99px;
  background: linear-gradient(180deg, #d9b561, #a9792f);
  content: '';
}

.discount-heading__left h1 {
  margin: 0;
  color: #123f49;
  font-family: 'STXingkai', '华文行楷', 'LXGW WenKai Screen', '霞鹜文楷 屏幕阅读版', 'STKaiti', 'KaiTi', serif;
  font-size: 40px;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: 5px;
  text-shadow: 0 1px 0 rgba(185, 138, 50, 0.16);
}

.discount-heading__left p {
  margin-top: 8px;
  color: #647b7c;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.discount-layout {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.discount-sidebar {
  position: sticky;
  top: 84px;
  min-height: calc(100vh - 108px);
  padding: 22px 16px;
  overflow: hidden;
  border: 1px solid rgba(190, 153, 79, 0.3);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255, 253, 248, 0.97), rgba(255, 253, 248, 0.95) 64%, rgba(245, 249, 244, 0.92));
  box-shadow: 0 10px 28px rgba(73, 91, 79, 0.07);
}

.discount-sidebar::after {
  position: absolute;
  z-index: 0;
  right: -46px;
  bottom: -24px;
  left: -46px;
  height: 260px;
  background: url('../assets/campus-portal-background-v2.png') center bottom / 620px auto no-repeat;
  content: '';
  opacity: 0.16;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.34) 32%, #000);
  mask-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.34) 32%, #000);
}

.discount-sidebar > * {
  position: relative;
  z-index: 1;
}

.discount-sidebar h2 {
  margin: 0 8px 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(185, 138, 50, 0.2);
  color: #123f49;
  font-size: 20px;
  letter-spacing: 1px;
}

.discount-sidebar__nav,
.discount-sidebar__group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.discount-sidebar__nav button,
.discount-sidebar__group button {
  position: relative;
  min-height: 42px;
  padding: 0 14px 0 18px;
  border: 0;
  border-radius: 8px;
  color: #597172;
  background: transparent;
  font: inherit;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.discount-sidebar__nav button:hover,
.discount-sidebar__group button:hover {
  color: #8b6728;
  background: rgba(255, 250, 238, 0.76);
}

.discount-sidebar__nav button.active,
.discount-sidebar__group button.active {
  color: #744f19;
  background: linear-gradient(135deg, #fffdf7, #f6e8c4);
  box-shadow: inset 0 0 0 1px rgba(193, 148, 60, 0.28);
}

.discount-sidebar__nav button.active::before,
.discount-sidebar__group button.active::before {
  position: absolute;
  inset: 8px auto 8px 0;
  width: 3px;
  border-radius: 99px;
  background: #b98a32;
  content: '';
}

.discount-sidebar__group {
  padding-top: 18px;
  margin-top: 18px;
  border-top: 1px solid rgba(185, 138, 50, 0.2);
}

.discount-sidebar__group h3 {
  margin: 0 10px 6px;
  color: #315f60;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.discount-content {
  min-width: 0;
}

.discount-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0 8px 0 18px;
  margin-bottom: 18px;
  border: 1px solid rgba(178, 145, 79, 0.32);
  border-radius: 11px;
  background: rgba(255, 253, 248, 0.95);
  box-shadow: 0 8px 24px rgba(73, 91, 79, 0.06);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.discount-search:focus-within {
  border-color: rgba(185, 138, 50, 0.7);
  box-shadow: 0 0 0 3px rgba(185, 138, 50, 0.1), 0 8px 24px rgba(73, 91, 79, 0.06);
}

.discount-search > img {
  width: 18px;
  height: 18px;
  opacity: 0.5;
}

.discount-search input {
  flex: 1;
  width: auto;
  min-width: 0;
  height: 52px;
  padding: 0;
  border: 0;
  border-radius: 0;
  color: #263e43;
  background: transparent;
  box-shadow: none;
}

.discount-search input:focus {
  border: 0;
  box-shadow: none;
}

.discount-search__clear {
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  color: #7d8e8e;
  background: #eef3ef;
  font-size: 17px;
  cursor: pointer;
}

.discount-search__btn {
  height: 40px;
  padding: 0 22px;
  border: 1px solid #a97b2f;
  border-radius: 8px;
  color: #fffdf6;
  background: linear-gradient(115deg, #174e58, #277b7d);
  box-shadow: 0 5px 14px rgba(25, 90, 91, 0.16);
}

.discount-search__btn:hover {
  border-color: #d4ad5a;
  background: linear-gradient(115deg, #123f49, #216c70);
  box-shadow: 0 7px 18px rgba(25, 90, 91, 0.2);
}

.discount-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.discount-card {
  position: relative;
  padding: 0;
  border: 1px solid rgba(189, 162, 106, 0.32);
  border-radius: 13px;
  color: #263e43;
  background: rgba(255, 254, 250, 0.97);
  box-shadow: 0 7px 20px rgba(63, 79, 70, 0.07);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.discount-card:hover,
.discount-card:focus-visible {
  border-color: #c79a42;
  outline: none;
  box-shadow: 0 0 0 2px rgba(199, 154, 66, 0.22), 0 13px 28px rgba(127, 92, 31, 0.13);
  transform: translateY(-3px);
}

.discount-card__visual {
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
}

.discount-card__img,
.discount-card__placeholder {
  height: 178px;
}

.discount-card__placeholder {
  color: #8a6729;
  background: linear-gradient(145deg, #f2eee1, #e5f1ed);
}

.discount-card__placeholder::before,
.discount-card__placeholder::after {
  display: none;
}

.discount-card__placeholder span {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border: 1px solid rgba(185, 138, 50, 0.35);
  border-radius: 50%;
  background: rgba(255, 253, 248, 0.75);
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 24px;
}

.discount-card .discount-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
  margin: 0;
  backdrop-filter: blur(5px);
}

.discount-card__favorite {
  position: absolute;
  z-index: 2;
  top: 10px;
  right: 10px;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(185, 138, 50, 0.28);
  border-radius: 50%;
  color: #71807d;
  background: rgba(255, 254, 250, 0.9);
  font-size: 20px;
  cursor: pointer;
  backdrop-filter: blur(5px);
}

.discount-card__favorite.active,
.discount-card__favorite:hover {
  color: #a87420;
  border-color: rgba(185, 138, 50, 0.62);
  background: #fff8e8;
}

.discount-card__body {
  padding: 15px 16px 16px;
}

.discount-card__merchant {
  margin: 0;
  color: #738584;
  font-size: 12px;
}

.discount-card__title {
  min-height: 50px;
  margin: 7px 0 11px;
  color: #263e43;
  font-size: 17px;
  line-height: 1.45;
}

.discount-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 11px;
  border-top: 1px solid rgba(185, 138, 50, 0.14);
  color: #849291;
  font-size: 11px;
}

.discount-card__meta span:last-child {
  flex-shrink: 0;
  color: #966d28;
  font-weight: 700;
}

.discount-empty {
  border: 1px solid rgba(190, 153, 79, 0.24);
  color: #738584;
  background: rgba(255, 253, 248, 0.94);
  box-shadow: 0 8px 24px rgba(73, 91, 79, 0.06);
}

.discount-empty__mark {
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  margin: 0 auto 14px;
  border: 1px solid rgba(185, 138, 50, 0.36);
  border-radius: 50%;
  color: #9a702a;
  background: #fff9eb;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 24px;
}

.discount-pagination__btn {
  border-color: rgba(185, 138, 50, 0.3);
  color: #315f60;
  background: rgba(255, 253, 248, 0.95);
  box-shadow: none;
}

.discount-pagination__btn:hover:not(:disabled) {
  border-color: #bf9139;
  color: #815c1f;
  background: #fffaf0;
  box-shadow: 0 6px 14px rgba(155, 112, 35, 0.12);
}

.discount-pagination__info {
  color: #738584;
}

.discount-detail {
  border: 1px solid rgba(185, 138, 50, 0.3);
  color: #263e43;
  background: #fffefa;
}

.discount-detail__back {
  color: #315f60;
  background: #eef5f1;
}

.discount-detail__merchant-icon {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  color: #257473;
  background: #eaf4ef;
  font-size: 11px;
  font-weight: 800;
}

.discount-detail__actions {
  display: flex;
  gap: 10px;
}

.discount-detail__fav,
.discount-detail__claim {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
}

.discount-detail__fav {
  border: 1px solid rgba(185, 138, 50, 0.38);
  color: #7a602f;
  background: #fffaf0;
}

.discount-detail__fav--active,
.discount-detail__fav:hover,
.discount-detail__fav--active:hover {
  border-color: #b98a32;
  color: #895f19;
  background: #f7e9c7;
}

.discount-detail__claim {
  border: 1px solid #a97b2f;
  color: #fffdf6;
  background: linear-gradient(115deg, #174e58, #277b7d);
}

@media (max-width: 1100px) {
  .discount-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 16px;
  }

  .discount-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .discount-container {
    width: min(100% - 24px, 720px);
  }

  .discount-layout {
    display: block;
  }

  .discount-sidebar {
    position: static;
    min-height: 0;
    padding: 10px;
    margin-bottom: 14px;
  }

  .discount-sidebar::after {
    display: none;
  }

  .discount-sidebar h2 {
    margin: 0 4px 8px;
    padding: 0 4px 8px;
    font-size: 17px;
  }

  .discount-sidebar__nav,
  .discount-sidebar__group {
    overflow-x: auto;
    flex-direction: row;
  }

  .discount-sidebar__group {
    padding-top: 10px;
    margin-top: 10px;
  }

  .discount-sidebar__group h3 {
    display: none;
  }

  .discount-sidebar__nav button,
  .discount-sidebar__group button {
    flex: 0 0 auto;
    min-height: 38px;
    padding: 0 12px;
    text-align: center;
  }

  .discount-sidebar__nav button.active::before,
  .discount-sidebar__group button.active::before {
    inset: auto 10px 0;
    width: auto;
    height: 2px;
  }
}

@media (max-width: 520px) {
  .discount-heading__left h1 {
    font-size: 34px;
  }

  .discount-search {
    gap: 8px;
    padding-left: 12px;
  }

  .discount-search__btn {
    padding: 0 14px;
  }

  .discount-grid {
    grid-template-columns: 1fr;
  }

  .discount-pagination {
    gap: 8px;
    padding-inline: 0;
  }

  .discount-pagination__info {
    font-size: 11px;
  }
}
</style>
