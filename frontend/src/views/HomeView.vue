<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppTabBar from '../components/AppTabBar.vue'
import { getHotPosts } from '../api/forum'
import { getActivityList } from '../api/activity'
import { getDiscountActivityList } from '../api/discount'
import { getEnabledAnnouncements } from '../api/notice'
import { getLatestJobRecommendations, JOB_BOSS_CTA, JOB_SALARY_HINT, resolveBossJobSearchLink, resolveBossJobSearchLinkFromJob } from '../api/jobRecommendations'
import { getSecondhandItemList } from '../api/secondhand'

const router = useRouter()
const searchKeyword = ref('')
const searchMode = ref('all')
const hotJobsLoading = ref(true)
const hotJobs = ref([])
const overviewLoading = ref(true)
const overview = ref({ announcements: [], marketplace: [], activities: [], discounts: [], posts: [] })

const quickActions = [
  { label: '校园市集', description: '发现闲置与好物', example: '例：羽毛球拍、Nike 鞋', to: '/marketplace', tone: 'market' },
  { label: '校园活动', description: '查看近期活动', example: '例：社团活动与校园讲座', to: '/activities', tone: 'activity' },
  { label: '校园地图', description: '查找校园地点', example: '例：食堂、教学楼与服务点', to: '/map', tone: 'map' },
  { label: '校园优惠', description: '领取身边优惠', example: '例：校园商家折扣与优惠券', to: '/discount', tone: 'discount' },
  { label: '校园论坛', description: '参与校园讨论', example: '例：香樟食堂用餐体验', to: '/forum', tone: 'forum' },
  { label: 'AI 助手', description: '随时获得帮助', example: '例：整理资料与解答问题', to: '/ai', tone: 'ai' },
]

const searchModes = [
  { key: 'all', label: '全站' },
  { key: 'market', label: '二手商品' },
  { key: 'activity', label: '校园活动' },
  { key: 'discount', label: '校园优惠' },
]

const quickSearches = [
  { label: '教材资料', path: '/marketplace', mode: 'market' },
  { label: '校园活动', path: '/activities', mode: 'activity' },
  { label: '校园优惠', path: '/discount', mode: 'discount' },
  { label: '失物招领', path: '/marketplace', mode: 'market' },
  { label: '学习资料', path: '/forum', mode: 'all' },
]

function recordsOf(value) {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  return value?.data?.records || value?.data?.content || value?.records || value?.content || value?.list || []
}

function parseOverviewImages(value) {
  if (Array.isArray(value)) return value
  try { return JSON.parse(value || '[]') } catch { return String(value || '').split(',').filter(Boolean) }
}

function overviewPrice(value) {
  return Number.isFinite(Number(value)) ? `¥${Number(value).toFixed(2)}` : '价格待确认'
}

function activityDate(value) {
  if (!value) return '时间待公布'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function announcementDate(value) {
  if (!value) return ''
  const date = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function runUnifiedSearch() {
  const keyword = searchKeyword.value.trim()
  if (searchMode.value === 'job') {
    openBossSearch(keyword)
    return
  }
  if (searchMode.value === 'market') {
    router.push({ path: '/marketplace', query: keyword ? { keyword } : {} })
    return
  }
  if (searchMode.value === 'activity') {
    router.push({ path: '/activities', query: keyword ? { keyword } : {} })
    return
  }
  if (searchMode.value === 'discount') {
    router.push({ path: '/discount', query: keyword ? { keyword } : {} })
    return
  }
  router.push(keyword ? { path: '/forum', query: { keyword } } : '/forum')
}

function runQuickSearch(item) {
  searchKeyword.value = item.label
  searchMode.value = item.mode
  router.push({ path: item.path, query: { keyword: item.label } })
}

function handleHotSearch(item) {
  if (searchMode.value === 'job') {
    searchKeyword.value = item.label
    runUnifiedSearch()
    return
  }
  runQuickSearch(item)
}

async function loadOverview() {
  overviewLoading.value = true
  const [marketplace, activities, discounts, posts] = await Promise.allSettled([
    getSecondhandItemList({ page: 0, size: 4 }),
    getActivityList({ page: 1, size: 4, timePhase: 'upcoming' }),
    getDiscountActivityList({ current: 1, size: 4, status: 1 }),
    getHotPosts({ page: 0, size: 4 }),
  ])
  const announcements = await Promise.resolve().then(() => getEnabledAnnouncements()).catch(() => [])
  overview.value = {
    announcements: recordsOf(announcements).slice(0, 5),
    marketplace: marketplace.status === 'fulfilled' ? recordsOf(marketplace.value).slice(0, 4) : [],
    activities: activities.status === 'fulfilled' ? recordsOf(activities.value).slice(0, 4) : [],
    discounts: discounts.status === 'fulfilled' ? recordsOf(discounts.value).slice(0, 4) : [],
    posts: posts.status === 'fulfilled' ? recordsOf(posts.value).slice(0, 4) : [],
  }
  overviewLoading.value = false
}

const hotSearches = ['AI算法', 'Java开发', '前端架构', '云原生', '产品经理', '数据分析']

const categoryPages = [
  [
    {
      id: 'it_ai',
      main: '互联网与人工智能',
      sub: '前端 后端 AI算法 产品 运营',
    },
    {
      id: 'chip',
      main: '电子与通信技术',
      sub: '硬件 芯片 通信 网络',
    },
    {
      id: 'finance',
      main: '金融与保险',
      sub: '银行 投资 风控 审计',
    },
    {
      id: 'education',
      main: '教育与培训',
      sub: '教师 教研 留学 心理',
    },
    {
      id: 'health',
      main: '医疗与健康',
      sub: '临床 护理 医技 康复',
    },
    {
      id: 'biotech',
      main: '生物制药与化工',
      sub: '基因 制药 化学 质检',
    },
  ],
  [
    {
      id: 'manufacturing',
      main: '制造业与工业生产',
      sub: '机械 电气 生产 供应链',
    },
    {
      id: 'automobile',
      main: '汽车与交通装备',
      sub: '研发 测试 智驾 服务',
    },
    {
      id: 'construction',
      main: '建筑工程与地产',
      sub: '设计 施工 造价 物业',
    },
    {
      id: 'energy',
      main: '能源矿业与环保',
      sub: '电力 新能源 环保 安全',
    },
    {
      id: 'retail',
      main: '电商与零售',
      sub: '选品 运营 直播 门店',
    },
    {
      id: 'marketing',
      main: '市场广告与公关',
      sub: '品牌 投流 内容 活动',
    },
  ],
  [
    {
      id: 'media',
      main: '文化传媒与内容',
      sub: '编辑 摄像 编导 自媒体',
    },
    {
      id: 'design',
      main: '艺术与设计',
      sub: '平面 三维 室内 交互',
    },
    {
      id: 'legal',
      main: '法律咨询与知识产权',
      sub: '律师 法务 咨询 合规',
    },
    {
      id: 'admin',
      main: '企业管理与行政',
      sub: '行政 人事 秘书 经理',
    },
    {
      id: 'sales',
      main: '销售与客户服务',
      sub: '大客户 渠道 客服 商务',
    },
    {
      id: 'logistics',
      main: '物流仓储与供应链',
      sub: '仓储 配送 采购 报关',
    },
  ],
  [
    {
      id: 'hospitality',
      main: '餐饮酒店与旅游',
      sub: '厨师 酒店 导游 会展',
    },
    {
      id: 'public',
      main: '公共服务与政府',
      sub: '社区 外事 消防 应急',
    },
    {
      id: 'sports',
      main: '体育与健身',
      sub: '教练 康复 赛事 电竟',
    },
    {
      id: 'service',
      main: '家政与生活服务',
      sub: '月嫂 维修 美业 宠物',
    },
    {
      id: 'security',
      main: '安保与应急服务',
      sub: '安检 消防 安全 风险',
    },
    {
      id: 'freelance',
      main: '自由职业与新兴职业',
      sub: '自媒体 写手 AI创作 顾问',
    },
  ],
]

const categoryDetails = {
  it_ai: {
    title: '互联网与人工智能',
    groups: [
      { name: '开发与技术', tags: ['前端开发工程师', '后端开发工程师', '全栈工程师', '测试工程师', '运维工程师'] },
      { name: 'AI与算法', tags: ['算法工程师', '机器学习工程师', '大模型工程师', 'AI应用工程师', '提示词工程师'] },
      { name: '产品与设计', tags: ['产品经理', '数据分析师', 'UI设计师', 'UX设计师'] },
    ],
  },
  chip: {
    title: '电子与通信技术',
    groups: [
      { name: '研发与设计', tags: ['电子工程师', '通信工程师', '嵌入式工程师', 'PCB设计工程师'] },
      { name: '测试与运维', tags: ['射频工程师', '设备测试工程师', '网络优化工程师', '技术支持'] },
    ],
  },
  finance: {
    title: '金融与保险',
    groups: [
      { name: '金融业务', tags: ['投资经理', '风控专员', '财富顾问', '保险顾问'] },
      { name: '财务支持', tags: ['审计专员', '财务分析师', '税务专员', '会计'] },
    ],
  },
  education: {
    title: '教育与培训',
    groups: [
      { name: '教学岗位', tags: ['学科教师', '课程顾问', '教研老师', '升学顾问'] },
      { name: '支持岗位', tags: ['班主任', '教学运营', '心理咨询师'] },
    ],
  },
  health: {
    title: '医疗与健康',
    groups: [
      { name: '临床方向', tags: ['临床医生', '护士', '康复治疗师', '医技人员'] },
      { name: '健康服务', tags: ['健康管理师', '营养师', '心理咨询师'] },
    ],
  },
  biotech: {
    title: '生物制药与化工',
    groups: [
      { name: '研发岗位', tags: ['生物研发工程师', '制药工程师', '化学分析师'] },
      { name: '质量岗位', tags: ['质量专员', '检验工程师', '注册申报专员'] },
    ],
  },
  manufacturing: {
    title: '制造业与工业生产',
    groups: [
      { name: '生产方向', tags: ['机械工程师', '工艺工程师', '设备工程师', '生产主管'] },
      { name: '供应链方向', tags: ['计划专员', '采购专员', '质量工程师'] },
    ],
  },
  automobile: {
    title: '汽车与交通装备',
    groups: [
      { name: '研发方向', tags: ['整车工程师', '智驾工程师', '测试工程师'] },
      { name: '服务方向', tags: ['售后工程师', '服务顾问', '供应链专员'] },
    ],
  },
  construction: {
    title: '建筑工程与地产',
    groups: [
      { name: '工程方向', tags: ['建筑设计师', '施工员', '造价工程师', '项目经理'] },
      { name: '地产方向', tags: ['招商主管', '物业经理', '策划专员'] },
    ],
  },
  energy: {
    title: '能源矿业与环保',
    groups: [
      { name: '能源方向', tags: ['电气工程师', '新能源工程师', '储能工程师'] },
      { name: '环保方向', tags: ['环保工程师', 'EHS专员', '安全工程师'] },
    ],
  },
  retail: {
    title: '电商与零售',
    groups: [
      { name: '电商方向', tags: ['电商运营', '选品专员', '直播运营', '投流专员'] },
      { name: '零售方向', tags: ['门店店长', '陈列专员', '招商主管'] },
    ],
  },
  marketing: {
    title: '市场广告与公关',
    groups: [
      { name: '品牌方向', tags: ['品牌经理', '媒介经理', '活动策划', '广告优化师'] },
      { name: '内容方向', tags: ['内容运营', '文案策划', '公关专员'] },
    ],
  },
  media: {
    title: '文化传媒与内容',
    groups: [
      { name: '内容方向', tags: ['编辑', '编导', '摄像师', '新媒体运营'] },
      { name: '创作方向', tags: ['短视频策划', '主播', '后期剪辑'] },
    ],
  },
  design: {
    title: '艺术与设计',
    groups: [
      { name: '视觉方向', tags: ['平面设计师', '三维设计师', '插画师'] },
      { name: '空间方向', tags: ['室内设计师', '展陈设计师', '交互设计师'] },
    ],
  },
  legal: {
    title: '法律咨询与知识产权',
    groups: [
      { name: '法律方向', tags: ['律师', '法务', '合规专员', '知识产权顾问'] },
      { name: '咨询方向', tags: ['咨询顾问', '项目顾问'] },
    ],
  },
  admin: {
    title: '企业管理与行政',
    groups: [
      { name: '行政方向', tags: ['行政专员', '前台', '秘书', '总助'] },
      { name: '人力方向', tags: ['招聘专员', 'HRBP', '培训专员'] },
    ],
  },
  sales: {
    title: '销售与客户服务',
    groups: [
      { name: '销售方向', tags: ['大客户经理', '渠道经理', '招商主管', '商务经理'] },
      { name: '服务方向', tags: ['客服专员', '售后专员', '呼叫中心专员'] },
    ],
  },
  logistics: {
    title: '物流仓储与供应链',
    groups: [
      { name: '仓配方向', tags: ['仓储主管', '配送专员', '物流专员'] },
      { name: '供应链方向', tags: ['采购专员', '计划专员', '报关专员'] },
    ],
  },
  hospitality: {
    title: '餐饮酒店与旅游',
    groups: [
      { name: '餐饮方向', tags: ['厨师', '餐厅经理', '店长'] },
      { name: '文旅方向', tags: ['酒店管家', '导游', '会展执行'] },
    ],
  },
  public: {
    title: '公共服务与政府',
    groups: [
      { name: '服务方向', tags: ['社区工作者', '外事专员', '政务服务专员'] },
      { name: '应急方向', tags: ['消防员', '应急专员'] },
    ],
  },
  sports: {
    title: '体育与健身',
    groups: [
      { name: '训练方向', tags: ['健身教练', '体育教练', '康复师'] },
      { name: '赛事方向', tags: ['赛事运营', '裁判', '场馆管理员'] },
    ],
  },
  service: {
    title: '家政与生活服务',
    groups: [
      { name: '家庭服务', tags: ['家政服务员', '月嫂', '育婴师'] },
      { name: '生活服务', tags: ['维修师傅', '美甲师', '宠物美容师'] },
    ],
  },
  security: {
    title: '安保与应急服务',
    groups: [
      { name: '安保方向', tags: ['保安', '安检员', '安全管理员'] },
      { name: '风险方向', tags: ['风险评估师', '安全工程师'] },
    ],
  },
  freelance: {
    title: '自由职业与新兴职业',
    groups: [
      { name: '创作方向', tags: ['自由撰稿人', '独立设计师', '自媒体博主', 'AI内容创作者'] },
      { name: '服务方向', tags: ['线上顾问', '配音员', '翻译'] },
    ],
  },
}

const logoColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff9f43', '#a29bfe']

const displayHotJobs = computed(() => hotJobs.value.slice(0, 3))
const displayLatestJobs = computed(() => hotJobs.value.slice(0, 6))

const hotDirections = computed(() => {
  const directions = []
  const seen = new Set()
  for (const job of hotJobs.value) {
    const query = String(job?.jobTitle || '').trim()
    if (!query || seen.has(query)) continue
    seen.add(query)
    directions.push({
      label: query,
      query,
      skills: parseJobSkills(job.skills),
    })
  }
  if (directions.length) {
    return directions.slice(0, 6)
  }
  return hotSearches.map((item) => ({
    label: item,
    query: item,
    skills: [item],
  }))
})

const hotJobsWeekLabel = computed(() => {
  const first = hotJobs.value[0]
  if (!first?.weekStartDate || !first?.weekEndDate) return ''
  return `${String(first.weekStartDate).slice(0, 10)} — ${String(first.weekEndDate).slice(0, 10)}`
})

function parseJobSkills(skillsText) {
  return String(skillsText || '')
    .split(/[,，、]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function resolveJobSearchLink(job) {
  return resolveBossJobSearchLinkFromJob(job)
}

function openBossSearch(keyword) {
  const query = String(keyword || '').trim() || '软件工程师'
  window.open(resolveBossJobSearchLink(query), '_blank', 'noopener,noreferrer')
}

async function loadHotJobs() {
  hotJobsLoading.value = true
  try {
    const result = await getLatestJobRecommendations()
    hotJobs.value = Array.isArray(result?.data) ? result.data : []
  } catch {
    hotJobs.value = []
  } finally {
    hotJobsLoading.value = false
  }
}

onMounted(() => {
  loadHotJobs()
  loadOverview()
})

const currentPage = ref(0)
const activeCategoryId = ref('')
const detailPinned = ref(false)

const pageCount = computed(() => categoryPages.length)
const currentCategories = computed(() => categoryPages[currentPage.value] ?? [])
const activeCategory = computed(() => categoryDetails[activeCategoryId.value] ?? null)

function changePage(step) {
  const nextPage = currentPage.value + step
  if (nextPage < 0 || nextPage >= pageCount.value) {
    return
  }
  currentPage.value = nextPage
  activeCategoryId.value = ''
  detailPinned.value = false
}

function showCategory(id) {
  activeCategoryId.value = id
}

function resetPreview() {
  if (!detailPinned.value) {
    activeCategoryId.value = ''
  }
}

function keepPreview() {
  if (activeCategoryId.value) {
    detailPinned.value = true
  }
}

function releasePreview() {
  detailPinned.value = false
  activeCategoryId.value = ''
}
</script>

<template>
  <div class="home-view">
    <AppTabBar embedded />

    <section class="search-area">
      <div class="container">
        <div class="overview-intro">
          <div>
            <span class="overview-kicker">CAMPUS HUB</span>
            <h1>校园生活，一站掌握</h1>
            <p>从闲置交易、校园活动到学习与就业服务，找到你现在需要的内容。</p>
          </div>
          <button type="button" class="overview-primary" aria-label="进入校园市集" @click="router.push({ name: 'marketplace' })">逛校园市集</button>
          </div>
        <div class="search-mode-tabs" aria-label="搜索范围">
          <button
            v-for="mode in searchModes"
            :key="mode.key"
            type="button"
            :class="{ active: searchMode === mode.key }"
            @click="searchMode = mode.key"
          >{{ mode.label }}</button>
        </div>
        <div class="search-box-wrap">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索校园商品、活动或讨论内容"
            @keyup.enter="runUnifiedSearch"
          />
          <button type="button" @click="runUnifiedSearch">搜索</button>
        </div>
        <div class="hot-searches">
          <span>快捷搜索：</span>
          <span
            v-for="item in quickSearches"
            :key="item.label"
            class="hot-search-tag"
            @click="handleHotSearch(item)"
          >{{ item.label }}</span>
        </div>
        <div class="announcement-section announcement-section--search" aria-labelledby="announcement-title">
          <div class="announcement-mark" aria-hidden="true">公告</div>
          <div class="announcement-main">
            <div class="announcement-heading">
              <div><span class="section-eyebrow">CAMPUS NOTICE</span><h2 id="announcement-title">校园公告</h2></div>
              <span>重要通知与校园服务安排</span>
            </div>
            <div v-if="overviewLoading" class="announcement-empty">正在加载公告…</div>
            <div v-else-if="!overview.announcements.length" class="announcement-empty">暂无校园公告</div>
            <div v-else class="announcement-scroller" tabindex="0" aria-label="校园公告，可纵向滑动">
              <article v-for="notice in overview.announcements" :key="notice.id || notice.title" class="announcement-item">
                <div class="announcement-item__meta"><span v-if="notice.isTop" class="announcement-top">置顶</span><time>{{ announcementDate(notice.createTime) }}</time></div>
                <h3>{{ notice.title }}</h3>
                <p>{{ notice.content }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container quick-actions-section">
      <div class="service-heading"><div class="service-heading__title"><span aria-hidden="true"></span><h2>校园服务</h2></div><span>6 项常用服务 · 点击条目进入</span></div>
      <div class="quick-actions-grid">
        <button v-for="item in quickActions" :key="item.to" type="button" class="quick-action" :class="`quick-action--${item.tone}`" @click="router.push(item.to)">
          <span class="quick-action__content"><strong>{{ item.label }}</strong><small>{{ item.description }}</small><em>{{ item.example }}</em></span>
        </button>
      </div>
    </section>

    <section class="container overview-section">
      <div class="section-heading-inline"><div><span class="section-eyebrow">CAMPUS SNAPSHOT</span><h2>校园动态</h2></div><span>实时汇总各个校园服务</span></div>
      <div v-if="overviewLoading" class="overview-loading">正在加载校园动态…</div>
      <div v-else class="overview-grid">
        <article class="overview-panel overview-panel--market">
          <header><div><span class="panel-label">MARKETPLACE</span><h3>最新闲置</h3></div><button type="button" @click="router.push('/marketplace')">查看全部 ›</button></header>
          <div v-if="!overview.marketplace.length" class="panel-empty">暂无闲置商品</div>
          <button v-for="item in overview.marketplace" :key="item.id" type="button" class="market-row" @click="router.push({ path: '/marketplace', query: { itemId: item.id } })">
            <span class="market-row__image"><img v-if="parseOverviewImages(item.images)[0]" :src="parseOverviewImages(item.images)[0]" alt="" /><span v-else>闲置</span></span>
            <span class="market-row__copy"><strong>{{ item.title }}</strong><small>{{ item.campusName || item.tradeLocation || item.location || '校内交易' }}</small></span><b>{{ overviewPrice(item.price) }}</b>
          </button>
        </article>
        <article class="overview-panel overview-panel--activity">
          <header><div><span class="panel-label">ACTIVITIES</span><h3>近期活动</h3></div><button type="button" @click="router.push('/activities')">查看全部 ›</button></header>
          <div v-if="!overview.activities.length" class="panel-empty">暂无近期活动</div>
          <button v-for="item in overview.activities" :key="item.id" type="button" class="activity-row" @click="router.push(`/activities/${item.id}`)"><span class="activity-row__date">{{ activityDate(item.startTime) }}</span><span><strong>{{ item.title || item.activityName }}</strong><small>{{ item.location || item.place || '校园活动' }}</small></span></button>
        </article>
        <article class="overview-panel overview-panel--discount">
          <header><div><span class="panel-label">CAMPUS OFFERS</span><h3>校园优惠</h3></div><button type="button" @click="router.push('/discount')">去看看 ›</button></header>
          <div v-if="!overview.discounts.length" class="panel-empty">暂无可用优惠</div>
          <button v-for="item in overview.discounts" :key="item.id" type="button" class="discount-row" @click="router.push('/discount')"><span class="discount-row__badge">券</span><span><strong>{{ item.title }}</strong><small>{{ item.merchantName || '校园商家' }}</small></span></button>
        </article>
        <article class="overview-panel overview-panel--forum">
          <header><div><span class="panel-label">CAMPUS FORUM</span><h3>热门讨论</h3></div><button type="button" @click="router.push('/forum')">去论坛 ›</button></header>
          <div v-if="!overview.posts.length" class="panel-empty">暂无热门讨论</div>
          <button v-for="(item, index) in overview.posts" :key="item.id" type="button" class="post-row" @click="router.push(`/forum/posts/${item.id}`)"><b>{{ String(index + 1).padStart(2, '0') }}</b><span><strong>{{ item.title || item.content }}</strong><small>{{ item.commentCount || 0 }} 评论 · {{ item.viewCount || 0 }} 浏览</small></span></button>
        </article>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h4>关于我们</h4>
          <ul><li><a href="javascript:void(0)">公司简介</a></li><li><a href="javascript:void(0)">联系我们</a></li><li><a href="javascript:void(0)">加入我们</a></li></ul>
        </div>
        <div>
          <h4>产品与服务</h4>
          <ul><li><a href="javascript:void(0)">学习路径推荐</a></li></ul>
        </div>
        <div>
          <h4>帮助与支持</h4>
          <ul><li><a href="javascript:void(0)">帮助中心</a></li><li><a href="javascript:void(0)">常见问题</a></li><li><a href="javascript:void(0)">在线客服</a></li></ul>
        </div>
        <div>
          <h4>法律合规</h4>
          <ul><li><a href="javascript:void(0)">服务协议</a></li><li><a href="javascript:void(0)">隐私政策</a></li><li><a href="javascript:void(0)">免责声明</a></li></ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© 2026 数智诊断港 | 本平台数据仅用于学术研究与个人职业发展规划</p>
        <p>ICP备案号：粤 ICP 备 XXXXXXX 号</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-view {
  isolation: isolate;
  min-height: 100vh;
  background: transparent;
  color: #333;
  font-family: 'Source Han Sans SC', 'Noto Sans CJK SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  letter-spacing: .01em;
}

.home-view * {
  box-sizing: border-box;
}

.home-view button,
.home-view input {
  font-family: inherit;
}

.container {
  width: min(1200px, calc(100% - 40px));
  margin: 0 auto;
}

.overview-intro { display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:24px;text-align:left; }
.overview-kicker,.section-eyebrow,.panel-label { color:#b08032;font-size:11px;font-weight:800;letter-spacing:.18em; }
.overview-intro h1 { margin:7px 0 9px;color:#123f49;font-family:'STXingkai','华文行楷','LXGW WenKai Screen','霞鹜文楷 屏幕阅读版','STKaiti','KaiTi',serif;font-size:clamp(36px,4vw,54px);font-weight:500;letter-spacing:.08em;line-height:1.3; }
.overview-intro p { margin:0;color:#667f82;font-family:'Source Han Sans SC','Noto Sans CJK SC','Microsoft YaHei',sans-serif;font-size:16px;font-weight:500;line-height:1.7; }
.overview-primary { flex:0 0 auto;padding:12px 22px;border:1px solid rgba(180,132,44,.5);border-radius:10px;color:#fffdf6;background:#1d666b;font-weight:750;cursor:pointer;box-shadow:0 8px 18px rgba(28,93,98,.18); }
.search-mode-tabs { display:flex;gap:8px;margin:28px auto 10px; }
.search-mode-tabs button { padding:7px 15px;border:1px solid rgba(98,124,128,.18);border-radius:999px;color:#617477;background:rgba(255,255,255,.7);cursor:pointer; }
.search-mode-tabs button.active { border-color:#27787a;color:#fff;background:#27787a; }
.announcement-section { display:grid;grid-template-columns:104px minmax(0,1fr);margin-top:28px;overflow:hidden;border:1px solid rgba(180,145,74,.3);border-radius:15px;background:rgba(255,254,249,.97);box-shadow:0 10px 30px rgba(67,84,74,.065); }
.announcement-section--search { margin-top:24px; }
.announcement-mark { display:grid;place-items:center;min-height:100%;color:#fffaf0;background:linear-gradient(150deg,#1b5962,#2d7d7b);font-family:'STKaiti','KaiTi',serif;font-size:24px;letter-spacing:.14em;writing-mode:vertical-rl; }
.announcement-main { min-width:0;padding:20px 24px; }
.announcement-heading { display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:10px; }
.announcement-heading h2 { margin:3px 0 0;color:#173f49;font-size:24px;font-weight:650;letter-spacing:.04em; }.announcement-heading>span{color:#829092;font-size:12px}
.announcement-empty { padding:24px 0;color:#7d8d8f;text-align:center; }
.announcement-scroller { display:grid;gap:10px;max-height:244px;overflow-y:auto;padding:2px 9px 2px 3px;scroll-snap-type:y proximity;scrollbar-color:#bd9857 #f3f1e9;scrollbar-width:thin; }
.announcement-scroller:focus-visible{outline:2px solid #347e80;outline-offset:4px}
.announcement-item { min-height:130px;padding:15px 17px;border:1px solid rgba(179,146,78,.2);border-radius:11px;background:#fffdf8;scroll-snap-align:start;box-shadow:0 5px 14px rgba(67,84,74,.045); }
.announcement-item__meta { display:flex;align-items:center;justify-content:space-between;min-height:20px;gap:8px; }.announcement-item__meta time{color:#8b9899;font-size:11px}
.announcement-item h3 { margin:12px 0 8px;color:#334f54;font-size:15px;line-height:1.45; }.announcement-item p { display:-webkit-box;margin:0;color:#64777a;font-size:13px;line-height:1.7;white-space:pre-wrap;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden; }
.announcement-top { padding:3px 7px;border-radius:999px;color:#98611e;background:#f7e7c5;font-size:10px;font-weight:800; }
.announcement-item p { margin:0 28px 14px 4px;padding:12px 14px;border-radius:9px;color:#64777a;background:#f7f7f1;font-size:13px;line-height:1.7;white-space:pre-wrap; }
.quick-actions-section,.overview-section { padding:34px 0 6px; }
.quick-actions-section { padding-top:42px; }
.service-heading { display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:20px;padding-bottom:15px;border-bottom:1px solid rgba(103,93,76,.2); }
.service-heading__title { display:flex;align-items:center;gap:14px; }
.service-heading__title>span { display:block;width:5px;height:27px;border-radius:2px;background:#51735f; }
.service-heading h2 { margin:0;color:#3a403c;font-family:'STKaiti','KaiTi','Source Han Serif SC',serif;font-size:28px;font-weight:500;letter-spacing:.08em; }
.service-heading>span { color:#8b8a82;font-size:12px; }
.section-heading-inline { display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:18px; }
.section-heading-inline h2 { margin:4px 0 0;color:#173f49;font-size:27px;font-weight:650;letter-spacing:.04em; }
.section-heading-inline>span { color:#7a8b8d;font-size:13px; }
.quick-actions-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px; }
.quick-action { position:relative;display:flex;min-height:150px;padding:22px 24px 18px 27px;border:1px solid rgba(107,99,86,.25);border-radius:5px;color:#4b4c48;background:rgba(251,249,244,.76);text-align:left;cursor:pointer;box-shadow:0 2px 8px rgba(68,62,48,.025);transition:border-color .2s,background .2s,transform .2s; }
.quick-action::before { position:absolute;top:-1px;bottom:-1px;left:-1px;width:4px;border-radius:4px 0 0 4px;background:#8a6a46;content:''; }
.quick-action:hover { border-color:rgba(122,91,55,.55);background:#fcfaf5;transform:translateY(-1px); }
.quick-action__content { display:flex;flex-direction:column;min-width:0; }
.quick-action strong,.quick-action small,.quick-action em { display:block; }.quick-action strong{color:#3e403c;font-family:'STKaiti','KaiTi','Source Han Serif SC',serif;font-size:21px;font-weight:600;letter-spacing:.03em}.quick-action small{margin-top:10px;color:#8a715b;font-size:13px;line-height:1.5}.quick-action em{margin-top:12px;color:#62645e;font-size:13px;font-style:normal;line-height:1.7}.quick-action--activity::before{background:#8a6a46}.quick-action--map::before{background:#658174}.quick-action--discount::before{background:#9a7652}.quick-action--forum::before{background:#6b7d72}.quick-action--ai::before{background:#69745c}
.overview-loading,.panel-empty { padding:28px;text-align:center;color:#7b8c8f; }
.overview-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px; }
.overview-panel { padding:20px;border:1px solid rgba(172,143,84,.23);border-radius:14px;background:rgba(255,254,250,.97);box-shadow:0 9px 28px rgba(67,84,74,.06); }
.overview-panel>header { display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:12px;padding-bottom:13px;border-bottom:1px solid rgba(185,151,82,.16); }
.overview-panel h3 { margin:3px 0 0;color:#21474e;font-size:20px;font-weight:650;letter-spacing:.03em; }.overview-panel header button{border:0;color:#527578;background:transparent;font-size:12px;cursor:pointer}
.market-row,.activity-row,.discount-row,.post-row { display:grid;align-items:center;width:100%;padding:10px 5px;border:0;border-bottom:1px solid rgba(83,109,105,.09);color:#334e53;background:transparent;text-align:left;cursor:pointer; }
.market-row:last-child,.activity-row:last-child,.discount-row:last-child,.post-row:last-child{border-bottom:0}.market-row:hover,.activity-row:hover,.discount-row:hover,.post-row:hover{background:#f8f6ee}
.market-row{grid-template-columns:48px minmax(0,1fr) auto;gap:11px}.market-row__image{display:grid;width:48px;height:48px;place-items:center;overflow:hidden;border-radius:9px;color:#819094;background:#edf2ef;font-size:11px}.market-row__image img{width:100%;height:100%;object-fit:cover}.market-row__copy strong,.market-row__copy small,.activity-row strong,.activity-row small,.discount-row strong,.discount-row small,.post-row strong,.post-row small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.market-row__copy small,.activity-row small,.discount-row small,.post-row small{margin-top:4px;color:#879597;font-size:11px}.market-row>b{color:#a26d29;font-size:15px}
.activity-row{grid-template-columns:112px minmax(0,1fr);gap:12px}.activity-row__date{color:#9a6c28;font-size:12px}.discount-row{grid-template-columns:40px minmax(0,1fr);gap:11px}.discount-row__badge{display:grid;width:36px;height:36px;place-items:center;border-radius:9px;color:#9a642f;background:#f8ead8;font-weight:800}.post-row{grid-template-columns:30px minmax(0,1fr);gap:9px}.post-row>b{color:#b1843b;font-family:Georgia,serif;font-size:12px}

.footer a {
  color: inherit;
  text-decoration: none;
}

.footer a:hover {
  color: #fff;
}

.search-area {
  padding: 40px 0 30px;
  background: rgba(249, 247, 239, 0.36);
  border-bottom: 1px solid rgba(36, 118, 116, 0.16);
  backdrop-filter: blur(2px);
}

.search-box-wrap {
  display: flex;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 4px 4px 4px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-box-wrap input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 12px 0;
  font-size: 16px;
  letter-spacing: .02em;
  background: transparent;
}

.search-box-wrap:focus-within {
  box-shadow: 0 0 0 2px rgba(39, 120, 122, 0.18), 0 8px 22px rgba(39, 95, 90, 0.1);
}

.search-box-wrap button {
  border: 0;
  padding: 12px 32px;
  border-radius: 6px;
  background: #27787a;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
}

.hot-searches {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.hot-searches span {
  padding: 4px 12px;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  letter-spacing: .02em;
  color: #444;
}

.hot-search-tag {
  cursor: pointer;
}

.hot-search-tag:hover {
  color: #27787a;
}

.section-meta {
  margin: 8px 0 0;
  color: #667085;
  font-size: 13px;
}

.salary-hint {
  flex-shrink: 0;
  max-width: 42%;
  color: #667085;
  font-size: 12px;
  line-height: 1.4;
  text-align: right;
}

.salary-hint--link {
  color: #2f76bd;
  text-decoration: none;
}

.salary-hint--link:hover {
  text-decoration: underline;
}

.company-meta-link {
  display: inline-block;
  margin-top: 4px;
  text-align: left;
}

.section-empty {
  padding: 36px 20px;
  text-align: center;
  color: #667085;
}

.section-link-btn,
.view-more-btn {
  cursor: pointer;
}

.card-actions {
  margin-top: auto;
  padding-top: 12px;
}

.diagnosis-btn--ghost {
  margin-left: 12px;
  color: #0066ff;
  background: rgba(255, 255, 255, 0.92);
}

.cat-diagnosis-area {
  display: flex;
  gap: 20px;
  align-items: stretch;
  padding: 30px 0;
}

.left-panel {
  display: flex;
  flex-direction: column;
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #dae5f0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.cat-menu-page {
  display: flex;
  flex-direction: column;
}

.cat-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: 0;
  border-bottom: 1px solid #eef5fb;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.cat-menu-item:hover,
.cat-menu-item.active {
  background: #eaf3fc;
  color: #0066ff;
}

.cat-row {
  flex: 1;
  overflow: hidden;
}

.cat-main {
  font-size: 15px;
  font-weight: 600;
}

.cat-sub-list {
  display: inline-block;
  max-width: 150px;
  margin-left: 8px;
  overflow: hidden;
  color: #888;
  font-size: 12px;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;
}

.cat-arrow {
  margin-left: auto;
  color: #ccd5e4;
}

.cat-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding: 12px 16px;
  border-top: 1px solid #eef5fb;
}

.page-num {
  color: #0066ff;
  font-size: 14px;
  font-weight: 500;
}

.page-btns {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 4px;
  background: #dcecfb;
  color: #0066ff;
  cursor: pointer;
}

.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.right-panel {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;
}

.diagnosis-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
  padding: 30px;
  background-image: url('/banner-bg.jpg');
  background-position: center;
  background-size: cover;
  text-align: center;
}

.text-box {
  max-width: 85%;
  padding: 30px 40px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.text-box h2 {
  margin: 0 0 12px;
  color: #1e2b4c;
  font-size: 28px;
}

.text-box p {
  margin: 0 0 24px;
  color: #444;
  font-size: 15px;
  line-height: 1.7;
}

.diagnosis-btn {
  border: 0;
  padding: 12px 36px;
  border-radius: 30px;
  background: #1a5cff;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(26, 92, 255, 0.25);
}

.detail-panel {
  max-height: 380px;
  padding: 24px 30px;
  overflow-y: auto;
}

.detail-title {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef5fb;
  color: #0066ff;
  font-size: 18px;
  font-weight: 700;
}

.detail-item {
  margin-bottom: 18px;
}

.detail-item-title {
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.detail-tags,
.card-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-tags span,
.card-tags span {
  padding: 4px 12px;
  border-radius: 4px;
  background: #eaf3fc;
  color: #555;
  font-size: 13px;
}

.section-block {
  padding: 40px 0 20px;
}

.section-header {
  margin-bottom: 30px;
  text-align: center;
}

.section-header h2 {
  margin: 0;
  color: #222;
  font-size: 26px;
}

.section-header span,
.salary {
  color: #0066ff;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.info-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid #dae5f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.card-header-simple,
.company-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.card-header-simple {
  align-items: center;
  margin-bottom: 10px;
}

.card-header-simple.compact {
  margin-bottom: 6px;
}

.title {
  color: #222;
  font-size: 17px;
  font-weight: 600;
}

.title.small {
  font-size: 15px;
}

.company-header {
  align-items: flex-start;
  margin-bottom: 12px;
}

.company-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
}

.company-name {
  margin-bottom: 2px;
  font-size: 16px;
  font-weight: 600;
}

.company-meta {
  color: #999;
  font-size: 12px;
  line-height: 1.5;
}

.card-desc {
  margin-bottom: 10px;
  color: #555;
  font-size: 13px;
  line-height: 1.6;
}

.card-benefits {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eef5fb;
  color: #0066ff;
  font-size: 13px;
}

.card-benefits.no-border {
  padding-top: 0;
  border-top: 0;
}

.company-salary .salary {
  font-weight: 600;
}

.more-btn-wrap {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.more-btn,
.view-more-btn {
  display: inline-block;
  border: 1px solid #0066ff;
  color: #0066ff;
  text-decoration: none;
  text-align: center;
}

.more-btn {
  width: 100%;
  padding: 8px 0;
  border-radius: 4px;
}

.view-more-wrap {
  margin-top: 30px;
  padding-bottom: 10px;
  text-align: center;
}

.view-more-btn {
  padding: 10px 40px;
  border-radius: 6px;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.job-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border: 1px solid #dae5f0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.job-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.job-list-main {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.job-list-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.job-list-info {
  flex: 1;
  min-width: 0;
}

.job-list-title {
  color: #222;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

.job-list-meta {
  margin-top: 4px;
  color: #667085;
  font-size: 12px;
}

.job-list-tags {
  margin-top: 8px;
}

.job-list-btn {
  flex-shrink: 0;
  padding: 8px 18px;
  border: 1px solid #0066ff;
  border-radius: 4px;
  color: #0066ff;
  font-size: 14px;
  text-decoration: none;
  white-space: nowrap;
}

.job-list-btn:hover {
  background: #f0f7ff;
}

.footer {
  margin-top: 20px;
  padding: 40px 0 20px;
  border-top: 1px solid #3a3a3a;
  background: #222;
  color: #d0d0d0;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.footer h4 {
  margin: 0 0 15px;
  color: #fff;
  font-size: 16px;
}

.footer ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  line-height: 2.2;
}

.footer-bottom {
  padding-top: 20px;
  border-top: 1px solid #3a3a3a;
  color: #888;
  font-size: 12px;
  text-align: center;
}

@media (max-width: 992px) {
  .cat-diagnosis-area {
    flex-direction: column;
    align-items: stretch;
  }

  .left-panel {
    width: 100%;
  }

  .grid-3,
  .footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .quick-actions-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
}

@media (max-width: 680px) {
  .container {
    width: min(100%, calc(100% - 24px));
  }

  .search-box-wrap {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .search-box-wrap button {
    width: 100%;
  }

  .grid-3,
  .footer-grid,
  .overview-grid,
  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
  .overview-intro,.section-heading-inline{align-items:flex-start;flex-direction:column}.overview-primary{width:100%}.search-mode-tabs{overflow-x:auto;margin-top:22px}.activity-row{grid-template-columns:1fr}.activity-row__date{margin-bottom:-4px}
  .announcement-section{grid-template-columns:1fr}.announcement-mark{min-height:48px;writing-mode:horizontal-tb}.announcement-main{padding:18px 16px}.announcement-heading{align-items:flex-start;flex-direction:column;gap:4px}.announcement-scroller{max-height:260px}.service-heading{align-items:flex-start;flex-direction:column;gap:8px}.quick-actions-grid{grid-template-columns:1fr}.quick-action{min-height:136px;padding:19px 18px 16px 22px}

  .job-list-item {
    flex-direction: column;
    align-items: stretch;
  }

  .job-list-btn {
    width: 100%;
    text-align: center;
  }

  .text-box {
    max-width: 100%;
    padding: 24px;
  }
}
</style>
