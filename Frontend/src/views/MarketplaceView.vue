<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppTabBar from '../components/AppTabBar.vue'
import SecondhandProductCard from '../components/marketplace/SecondhandProductCard.vue'
import {
  createOrGetChatSession, createSecondhandItem, favoriteSecondhandItem,
  getChatSessions, getMySecondhandFavorites, getMySecondhandItems,
  getSecondhandCategories, getSecondhandItemDetail, getSecondhandItemList,
  getTradeNotifications, getTradeRecords, reserveSecondhandItem, unfavoriteSecondhandItem,
  confirmTradeRecord, completeTradeRecord, cancelTradeRecord,
} from '../api/secondhand'
import {
  MARKET_CATEGORY_ICONS,
  categoryIconByName,
  conditionLabel,
  normalizeCategory,
  statusLabel,
  statusTone,
} from '../utils/marketplaceCategories'

const router = useRouter()
const route = useRoute()
const tab = ref('market')
const loading = ref(true)
const error = ref('')
const items = ref([])
const categories = ref([])
const selectedCategory = ref('')
const keyword = ref('')
const selected = ref(null)
const sessions = ref([])
const trades = ref([])
const notifications = ref([])
const historyItems = ref([])
const showPublish = ref(false)
const publishing = ref(false)
const form = ref({ title: '', description: '', price: '', categoryId: '', condition: 3, tradeLocation: '', images: [] })

const tabs = [
  ['market', '逛市集'],
  ['mine', '我的发布'],
  ['favorites', '我的收藏'],
  ['history', '浏览记录'],
  ['chats', '我的消息'],
  ['trades', '交易记录'],
  ['notifications', '交易通知'],
]

const content = (value) => Array.isArray(value) ? value : value?.content || value?.records || value?.list || []
const parseImages = (value) => {
  if (Array.isArray(value)) return value
  try { return JSON.parse(value || '[]') } catch { return String(value || '').split(',').filter(Boolean) }
}

const normalizedCategories = computed(() => categories.value.map(normalizeCategory))

const shownItems = computed(() => {
  const query = keyword.value.trim().toLowerCase()
  return items.value.filter((item) => {
    if (!query) return true
    const categoryName = item.categoryName || ''
    return `${item.title} ${item.description || ''} ${categoryName}`.toLowerCase().includes(query)
  })
})

const listItems = computed(() => (tab.value === 'history' ? historyItems.value : shownItems.value))
const price = (value) => Number.isFinite(Number(value)) ? `¥${Number(value).toFixed(2)}` : '价格待确认'

function categoryNameOf(item) {
  return item?.categoryName || normalizedCategories.value.find((c) => String(c.id) === String(item?.categoryId))?.name || ''
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (tab.value === 'market') {
      items.value = content(await getSecondhandItemList({
        page: 0,
        size: 40,
        categoryId: selectedCategory.value || undefined,
      }))
    }
    if (tab.value === 'mine') items.value = content(await getMySecondhandItems({ page: 0, size: 40 }))
    if (tab.value === 'favorites') items.value = content(await getMySecondhandFavorites({ page: 0, size: 40 }))
    if (tab.value === 'chats') sessions.value = content(await getChatSessions({ page: 0, size: 50 }))
    if (tab.value === 'trades') trades.value = content(await getTradeRecords({ page: 0, size: 50 }))
    if (tab.value === 'notifications') notifications.value = content(await getTradeNotifications({ page: 0, size: 50 }))
    if (tab.value === 'history') {
      historyItems.value = JSON.parse(localStorage.getItem('marketBrowseHistory') || '[]')
    }
  } catch (cause) {
    error.value = cause.message
  } finally {
    loading.value = false
  }
}

async function openItem(id) {
  if (!id) return
  try {
    selected.value = await getSecondhandItemDetail(id)
    const next = [
      {
        id: selected.value.id,
        title: selected.value.title,
        price: selected.value.price,
        images: selected.value.images,
        description: selected.value.description,
        categoryName: selected.value.categoryName,
        viewedAt: new Date().toISOString(),
      },
      ...JSON.parse(localStorage.getItem('marketBrowseHistory') || '[]').filter((item) => String(item.id) !== String(id)),
    ].slice(0, 50)
    localStorage.setItem('marketBrowseHistory', JSON.stringify(next))
  } catch (cause) {
    error.value = cause.message
  }
}

async function toggleFavorite(item) {
  try {
    if (item.isFavorited) await unfavoriteSecondhandItem(item.id)
    else await favoriteSecondhandItem(item.id)
    item.isFavorited = !item.isFavorited
    if (selected.value?.id === item.id) selected.value.isFavorited = item.isFavorited
  } catch (cause) {
    error.value = cause.message
  }
}

async function contact(item) {
  try {
    const session = await createOrGetChatSession(item.id, item.sellerId)
    router.push({ path: '/marketplace/chat', query: { sessionId: session.sessionId || session.id, itemId: item.id } })
  } catch (cause) {
    error.value = cause.message
  }
}

async function reserve(item) {
  try {
    await reserveSecondhandItem(item.id)
    await openItem(item.id)
    await load()
  } catch (cause) {
    error.value = cause.message
  }
}

async function publish() {
  publishing.value = true
  try {
    await createSecondhandItem({
      ...form.value,
      price: Number(form.value.price),
      categoryId: Number(form.value.categoryId),
      location: form.value.tradeLocation,
    })
    showPublish.value = false
    form.value = { title: '', description: '', price: '', categoryId: '', condition: 3, tradeLocation: '', images: [] }
    tab.value = 'mine'
    await load()
  } catch (cause) {
    error.value = cause.message
  } finally {
    publishing.value = false
  }
}

async function tradeAction(record, action) {
  try {
    if (action === 'confirm') await confirmTradeRecord(record.id)
    if (action === 'complete') await completeTradeRecord(record.id)
    if (action === 'cancel') await cancelTradeRecord(record.id)
    await load()
  } catch (cause) {
    error.value = cause.message
  }
}

watch([tab, selectedCategory], load)
watch(() => route.query.itemId, (itemId) => {
  if (itemId) void openItem(itemId)
})
onMounted(async () => {
  try {
    categories.value = content(await getSecondhandCategories())
  } catch {
    categories.value = []
  }
  await load()
  if (route.query.itemId) {
    await openItem(route.query.itemId)
  }
})
</script>

<template>
  <div class="feature-page market-shell">
    <AppTabBar />
    <main class="feature-container market-page">
      <header class="feature-heading">
        <div>
          <h1>校园二手市集</h1>
          <p>发现闲置、沟通确认并完成线下交易</p>
        </div>
        <div class="feature-actions">
          <button class="feature-button" type="button" @click="router.push('/messages')">消息中心</button>
          <button class="feature-button feature-button--primary" type="button" @click="showPublish = true">发布闲置</button>
        </div>
      </header>

      <div class="market-layout">
        <aside class="market-sidebar feature-card">
          <h2>市集中心</h2>
          <nav class="market-tabs" aria-label="市集功能">
          <button
            v-for="[value, label] in tabs"
            :key="value"
            type="button"
            :class="{ active: tab === value }"
            @click="tab = value"
          >
            {{ label }}
          </button>
          </nav>
        </aside>

        <div class="market-content">
          <label v-if="tab === 'market'" class="market-search">
            <img src="/icons/search.svg" alt="" />
            <input v-model="keyword" type="search" placeholder="搜索商品名称、描述或分类" />
            <button v-if="keyword" type="button" aria-label="清除搜索" @click="keyword = ''">×</button>
          </label>

          <div v-if="error" class="feature-error">{{ error }}</div>
          <div v-if="loading" class="feature-empty">正在加载市集数据…</div>

          <template v-else>
        <section v-if="['market', 'mine', 'favorites', 'history'].includes(tab)">
          <div v-if="tab === 'market'" class="market-categories">
            <button
              type="button"
              class="market-category"
              :class="{ 'market-category--active': !selectedCategory }"
              @click="selectedCategory = ''"
            >
              <span class="market-category__icon" v-html="MARKET_CATEGORY_ICONS.all" />
              <span class="market-category__label">全部</span>
            </button>
            <button
              v-for="category in normalizedCategories"
              :key="category.id"
              type="button"
              class="market-category"
              :class="{ 'market-category--active': String(selectedCategory) === String(category.id) }"
              @click="selectedCategory = category.id"
            >
              <span class="market-category__icon" v-html="category.icon" />
              <span class="market-category__label">{{ category.name }}</span>
            </button>
          </div>

          <div v-if="!listItems.length" class="feature-empty market-empty">
            <p>{{ tab === 'history' ? '暂无浏览记录' : '暂无符合条件的商品' }}</p>
            <button v-if="tab === 'market'" class="feature-button feature-button--primary" type="button" @click="showPublish = true">发布第一件闲置</button>
          </div>

          <div v-else class="market-grid">
            <SecondhandProductCard
              v-for="item in listItems"
              :key="item.id || item.title + item.viewedAt"
              :item="item"
              @click="openItem(item.id)"
            />
          </div>
        </section>

        <section v-if="tab === 'chats'" class="feature-card feature-section">
          <div v-if="!sessions.length" class="feature-empty">暂无市集会话</div>
          <div v-else class="feature-list">
            <button
              v-for="session in sessions"
              :key="session.sessionId"
              type="button"
              class="feature-row chat-row"
              @click="router.push({ path: '/marketplace/chat', query: { sessionId: session.sessionId, itemId: session.itemId } })"
            >
              <div class="avatar">{{ (session.otherUsername || '用').slice(0, 1) }}</div>
              <div class="feature-row__copy">
                <strong>{{ session.otherUsername || '校园用户' }} · {{ session.itemTitle }}</strong>
                <span>{{ session.lastMessage || '暂无消息' }}</span>
              </div>
              <time>{{ session.lastTime }}</time>
            </button>
          </div>
        </section>

        <section v-if="tab === 'trades'" class="feature-card feature-section">
          <div v-if="!trades.length" class="feature-empty">暂无交易记录</div>
          <div v-else class="feature-list">
            <div v-for="record in trades" :key="record.id" class="feature-row trade-row">
              <div class="feature-row__copy">
                <strong>{{ record.itemTitle || `交易 ${record.id}` }}</strong>
                <span>{{ record.buyerName }} · {{ record.sellerName }} · {{ record.createTime }}</span>
              </div>
              <span class="feature-status feature-status--learning">{{ record.statusText || record.status }}</span>
              <div class="trade-actions">
                <button v-if="record.status === 'WAIT_CONFIRM'" type="button" @click="tradeAction(record, 'confirm')">确认</button>
                <button v-if="record.status === 'TRADING'" type="button" @click="tradeAction(record, 'complete')">完成</button>
                <button v-if="!['COMPLETED', 'CANCELLED'].includes(record.status)" type="button" @click="tradeAction(record, 'cancel')">取消</button>
              </div>
            </div>
          </div>
        </section>

        <section v-if="tab === 'notifications'" class="feature-card feature-section">
          <div v-if="!notifications.length" class="feature-empty">暂无交易通知</div>
          <div v-else class="feature-list">
            <div v-for="notice in notifications" :key="notice.id" class="feature-row">
              <div class="feature-row__copy">
                <strong>{{ notice.title || notice.eventType || '交易通知' }}</strong>
                <span>{{ notice.content || notice.message }} · {{ notice.createTime }}</span>
              </div>
              <span v-if="!notice.isRead" class="feature-status feature-status--learning">未读</span>
            </div>
          </div>
        </section>
          </template>
        </div>
      </div>
    </main>

    <div v-if="selected" class="detail-mask" @click.self="selected = null">
      <aside class="market-detail">
        <button type="button" class="feature-modal__close" aria-label="关闭详情" @click="selected = null">×</button>
        <div class="detail-gallery">
          <img v-if="parseImages(selected.images)[0]" :src="parseImages(selected.images)[0]" alt="" />
          <div v-else class="product-image__placeholder product-image__placeholder--large">
            <span class="product-image__icon" v-html="categoryIconByName(selected.categoryName)" />
            <span>暂无图片</span>
          </div>
        </div>
        <div class="detail-copy">
          <div class="detail-meta">
            <span v-if="selected.categoryName" class="product-category">{{ selected.categoryName }}</span>
            <span class="product-status product-status--sale">{{ statusLabel(selected) }}</span>
          </div>
          <div class="detail-price">{{ price(selected.price) }}</div>
          <h2>{{ selected.title }}</h2>
          <p>{{ selected.description || '卖家暂未填写详细描述' }}</p>
          <dl>
            <div><dt>成色</dt><dd>{{ conditionLabel(selected.condition, selected.conditionText) }}</dd></div>
            <div><dt>交易地点</dt><dd>{{ selected.tradeLocation || selected.pickupPoint || selected.location || '待确认' }}</dd></div>
            <div><dt>卖家</dt><dd>{{ selected.sellerName || '校园用户' }}</dd></div>
          </dl>
          <div class="detail-buttons">
            <button class="feature-button" type="button" @click="toggleFavorite(selected)">{{ selected.isFavorited ? '取消收藏' : '收藏' }}</button>
            <button class="feature-button" type="button" @click="contact(selected)">联系卖家</button>
            <button class="feature-button feature-button--primary" type="button" @click="reserve(selected)">预订商品</button>
          </div>
        </div>
      </aside>
    </div>

    <div v-if="showPublish" class="feature-modal-mask" @click.self="showPublish = false">
      <form class="feature-modal feature-form" @submit.prevent="publish">
        <div class="feature-modal__head">
          <h2>发布闲置</h2>
          <button type="button" class="feature-modal__close" aria-label="关闭" @click="showPublish = false">×</button>
        </div>
        <label>商品标题<input v-model="form.title" class="feature-input" required maxlength="80" /></label>
        <label>商品描述<textarea v-model="form.description" class="feature-textarea" required maxlength="1000" /></label>
        <label>价格<input v-model="form.price" class="feature-input" required type="number" min="0" step="0.01" /></label>
        <label>
          分类
          <select v-model="form.categoryId" class="feature-select" required>
            <option value="">请选择分类</option>
            <option v-for="item in normalizedCategories" :key="item.id" :value="item.id">{{ item.name }}</option>
          </select>
        </label>
        <label>
          成色
          <select v-model="form.condition" class="feature-select">
            <option :value="1">全新</option>
            <option :value="2">几乎全新</option>
            <option :value="3">轻微使用痕迹</option>
            <option :value="4">明显使用痕迹</option>
            <option :value="5">仅限零件</option>
          </select>
        </label>
        <label>交易地点<input v-model="form.tradeLocation" class="feature-input" maxlength="100" placeholder="例如：图书馆门口" /></label>
        <label>商品图片地址<input class="feature-input" placeholder="可填写已上传图片 URL" @change="form.images = $event.target.value ? [String($event.target.value)] : []" /></label>
        <button class="feature-button feature-button--primary" type="submit" :disabled="publishing">{{ publishing ? '发布中…' : '确认发布' }}</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.market-shell {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.market-shell::before {
  position: fixed;
  z-index: -1;
  inset: 60px 0 0;
  background:
    linear-gradient(180deg, rgba(250, 248, 240, 0.9) 0%, rgba(249, 247, 239, 0.82) 48%, rgba(247, 246, 239, 0.88) 100%);
  content: '';
  pointer-events: none;
}

.market-page {
  width: min(100%, 1320px);
  font-family: 'Source Han Sans SC', 'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif;
}

.market-page > .feature-heading {
  position: relative;
  padding: 12px 0 12px 22px;
}

.market-page > .feature-heading::before {
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 99px;
  background: linear-gradient(180deg, #d9b561, #a9792f);
  content: '';
}

.market-page > .feature-heading h1 {
  color: #123f49;
  font-family: 'STXingkai', '华文行楷', 'LXGW WenKai Screen', '霞鹜文楷 屏幕阅读版', 'STKaiti', 'KaiTi', serif;
  font-size: 40px;
  font-weight: 500;
  letter-spacing: 5px;
  line-height: 1.25;
  text-shadow: 0 1px 0 rgba(185, 138, 50, 0.16);
}

.market-page > .feature-heading p {
  color: #647b7c;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.market-page .feature-button {
  border-color: rgba(176, 132, 51, 0.42);
  color: #315f60;
  background: rgba(255, 253, 247, 0.94);
  box-shadow: 0 4px 12px rgba(75, 91, 78, 0.06);
  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.market-page .feature-button:hover {
  border-color: #bf9139;
  color: #815c1f;
  background: #fffaf0;
  box-shadow: 0 7px 18px rgba(155, 112, 35, 0.14);
  transform: translateY(-1px);
}

.market-page .feature-button--primary {
  border-color: #a97b2f;
  color: #fffdf6;
  background: linear-gradient(115deg, #174e58, #277b7d);
  box-shadow: 0 7px 18px rgba(25, 90, 91, 0.18);
}

.market-page .feature-button--primary:hover {
  border-color: #d4ad5a;
  color: #fff;
  background: linear-gradient(115deg, #123f49, #216c70);
}

.market-layout {
  display: grid;
  grid-template-columns: 256px minmax(0, 1fr);
  align-items: start;
  gap: 22px;
}

.market-sidebar {
  position: sticky;
  top: 84px;
  min-height: calc(100vh - 108px);
  padding: 22px 16px;
  overflow: hidden;
  border-color: rgba(190, 153, 79, 0.3);
  background: linear-gradient(180deg, rgba(255, 253, 248, 0.97) 0%, rgba(255, 253, 248, 0.95) 64%, rgba(245, 249, 244, 0.92) 100%);
  box-shadow: 0 10px 28px rgba(73, 91, 79, 0.07);
}

.market-sidebar::after {
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
  -webkit-mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.34) 32%, #000 100%);
  mask-image: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.34) 32%, #000 100%);
}

.market-sidebar > * {
  position: relative;
  z-index: 1;
}

.market-sidebar h2 {
  margin: 0 8px 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(185, 138, 50, 0.2);
  color: #123f49;
  font-size: 20px;
  letter-spacing: 1px;
}

.market-content {
  min-width: 0;
}

.market-tabs {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.market-tabs button {
  position: relative;
  min-height: 44px;
  padding: 0 14px 0 18px;
  border-radius: 8px;
  color: #597172;
  background: transparent;
  font-weight: 700;
  text-align: left;
  white-space: nowrap;
  transition: color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease;
}

.market-tabs button:hover {
  color: #8b6728;
  background: rgba(255, 250, 238, 0.76);
}

.market-tabs button.active {
  color: #744f19;
  background: linear-gradient(135deg, #fffdf7, #f6e8c4);
  box-shadow: inset 0 0 0 1px rgba(193, 148, 60, 0.28), 0 3px 10px rgba(144, 105, 38, 0.08);
}

.market-tabs button.active::before {
  position: absolute;
  inset: 8px auto 8px 0;
  width: 3px;
  border-radius: 99px;
  background: #b98a32;
  content: '';
}

.market-search {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0 18px;
  margin-bottom: 18px;
  border: 1px solid rgba(178, 145, 79, 0.32);
  border-radius: 11px;
  background: rgba(255, 253, 248, 0.95);
  box-shadow: 0 8px 24px rgba(73, 91, 79, 0.06);
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.market-search:focus-within {
  border-color: rgba(185, 138, 50, 0.7);
  box-shadow: 0 0 0 3px rgba(185, 138, 50, 0.1), 0 8px 24px rgba(73, 91, 79, 0.06);
}

.market-search img {
  width: 18px;
  height: 18px;
  opacity: 0.5;
}

.market-search input {
  flex: 1;
  min-width: 0;
  height: 52px;
  border: 0;
  outline: none;
  background: transparent;
  color: #17233a;
  font-size: 14px;
}

.market-search button {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #98a2b3;
  background: #eef2f6;
  font-size: 16px;
}

.market-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.market-category {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 108px;
  padding: 10px 14px;
  border: 1px solid rgba(179, 151, 94, 0.3);
  border-radius: 10px;
  color: #405d60;
  background: rgba(255, 253, 248, 0.94);
  box-shadow: 0 4px 14px rgba(73, 91, 79, 0.04);
  transition: border-color 0.18s, color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s;
}

.market-category:hover {
  transform: translateY(-2px);
  border-color: #c69b45;
  color: #835f20;
  box-shadow: 0 8px 18px rgba(154, 111, 34, 0.11);
}

.market-category--active {
  border-color: #c39742;
  color: #704d18;
  background: linear-gradient(135deg, #fffaf0, #f3dfae);
  box-shadow: inset 0 0 0 1px rgba(190, 142, 52, 0.18);
}

.market-category__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: #3f7472;
  background: #edf4ef;
}

.market-category__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.market-category--active .market-category__icon {
  color: #9a6d23;
  background: rgba(255, 253, 247, 0.86);
}

.market-category__label {
  font-size: 13px;
  font-weight: 700;
}

.market-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.product-card {
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.16s, box-shadow 0.16s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(30, 43, 76, 0.08);
}

.product-image {
  position: relative;
  height: 190px;
  background: linear-gradient(180deg, #f3f6f9 0%, #e9eef3 100%);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  color: #8a9bae;
  font-size: 12px;
}

.product-image__placeholder--large {
  min-height: 330px;
}

.product-image__icon {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  color: #6b8299;
  background: rgba(255, 255, 255, 0.72);
}

.product-image__icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.product-status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}

.product-status--sale {
  color: #315f8c;
  background: rgba(255, 255, 255, 0.94);
}

.product-status--reserved {
  color: #b45309;
  background: #fff7ed;
}

.product-status--sold,
.product-status--offline {
  color: #667085;
  background: rgba(255, 255, 255, 0.94);
}

.product-copy {
  padding: 16px;
}

.product-copy__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.product-copy > strong,
.product-copy__top strong {
  display: block;
  color: #26384d;
  font-size: 16px;
  line-height: 1.35;
}

.product-category {
  flex-shrink: 0;
  padding: 2px 7px;
  border-radius: 4px;
  color: #5f7895;
  background: #edf2f6;
  font-size: 11px;
  font-weight: 700;
}

.product-copy > p {
  height: 40px;
  margin: 0 0 14px;
  overflow: hidden;
  color: #718096;
  font-size: 13px;
  line-height: 1.55;
}

.product-copy__foot {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 10px;
}

.product-copy b {
  display: block;
  color: #b45249;
  font-size: 18px;
}

.product-copy small {
  display: block;
  margin-top: 2px;
  color: #98a2b3;
  font-size: 11px;
  text-decoration: line-through;
}

.product-copy__foot > span {
  color: #8593a2;
  font-size: 11px;
  text-align: right;
}

.market-empty p {
  margin: 0 0 14px;
}

.chat-row {
  width: 100%;
  text-align: left;
}

.avatar {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #315f8c;
  background: #e9f0f6;
  font-weight: 800;
}

.chat-row .feature-row__copy {
  flex: 1;
}

.chat-row time {
  color: #8996a3;
  font-size: 11px;
}

.trade-row {
  flex-wrap: wrap;
}

.trade-actions {
  display: flex;
  gap: 6px;
}

.trade-actions button {
  padding: 6px 10px;
  border-radius: 6px;
  color: #4b6379;
  background: #edf2f6;
  font-size: 12px;
  font-weight: 700;
}

.detail-mask {
  position: fixed;
  inset: 0;
  z-index: 1100;
  background: rgba(15, 23, 42, 0.4);
}

.market-detail {
  position: absolute;
  inset: 0 0 0 auto;
  width: min(620px, 100%);
  padding: 28px;
  overflow: auto;
  background: #fff;
}

.market-detail > .feature-modal__close {
  position: absolute;
  z-index: 2;
  top: 18px;
  right: 18px;
}

.detail-gallery {
  height: 330px;
  border-radius: 10px;
  background: #eef2f5;
  overflow: hidden;
}

.detail-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-copy {
  padding: 24px 4px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-meta .product-status {
  position: static;
}

.detail-price {
  color: #b45249;
  font-size: 25px;
  font-weight: 800;
}

.detail-copy h2 {
  margin: 8px 0;
}

.detail-copy > p {
  color: #65758a;
  line-height: 1.8;
}

.detail-copy dl {
  margin: 22px 0;
  border-block: 1px solid #e7ecf1;
}

.detail-copy dl div {
  display: flex;
  padding: 13px 0;
}

.detail-copy dt {
  width: 90px;
  color: #8794a1;
}

.detail-copy dd {
  margin: 0;
  color: #344a60;
}

.detail-buttons {
  display: flex;
  gap: 10px;
}

.detail-buttons .feature-button--primary {
  flex: 1;
}

@media (max-width: 1100px) {
  .market-layout {
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 16px;
  }

  .market-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .market-layout {
    display: block;
  }

  .market-sidebar {
    position: static;
    min-height: 0;
    padding: 10px;
    margin-bottom: 14px;
  }

  .market-sidebar::after {
    display: none;
  }

  .market-sidebar h2 {
    margin: 0 4px 8px;
    padding: 0 4px 8px;
    font-size: 17px;
  }

  .market-tabs {
    overflow-x: auto;
    flex-direction: row;
  }

  .market-tabs button {
    flex: 0 0 auto;
    min-height: 38px;
    padding: 0 12px;
    text-align: center;
  }

  .market-tabs button.active::before {
    inset: auto 10px 0;
    width: auto;
    height: 2px;
  }

  .market-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .market-search {
    width: 100%;
  }

  .market-categories {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }

  .market-category {
    flex-shrink: 0;
  }
}

@media (max-width: 500px) {
  .market-grid {
    grid-template-columns: 1fr;
  }
}
</style>
