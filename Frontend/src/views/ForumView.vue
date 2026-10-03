<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppTabBar from '../components/AppTabBar.vue'
import { getHotPosts, getPostList, getTopicList, publishPost, togglePostLike } from '../api/forum'

const router = useRouter()
const posts = ref([])
const hotPosts = ref([])
const topics = ref([])
const topicId = ref('')
const keywordInput = ref('')
const keyword = ref('')
const loading = ref(true)
const error = ref('')
const showPublish = ref(false)
const publishing = ref(false)
const form = ref({ title: '', content: '', topicId: '', images: [] })
const rows = (value) => Array.isArray(value) ? value : value?.content || value?.records || value?.list || []
const parseImages = (value) => { if (Array.isArray(value)) return value; try { return JSON.parse(value || '[]') } catch { return [] } }

async function load() {
  loading.value = true
  error.value = ''
  try {
    const result = rows(await getPostList({ page: 0, size: 30, topicId: topicId.value || undefined, keyword: keyword.value || undefined }))
    const query = keyword.value.toLocaleLowerCase()
    posts.value = query ? result.filter((post) => String(post.title || '').toLocaleLowerCase().includes(query)) : result
  } catch (cause) { error.value = cause.message } finally { loading.value = false }
}
function searchPosts() { keyword.value = keywordInput.value.trim(); void load() }
function clearSearch() { keywordInput.value = ''; if (keyword.value) { keyword.value = ''; void load() } }
async function like(post) {
  try { const result = await togglePostLike(post.id); post.isLiked = result?.liked ?? !post.isLiked; post.likeCount = result?.likeCount ?? post.likeCount }
  catch (cause) { error.value = cause.message }
}
async function publish() {
  publishing.value = true
  try {
    await publishPost({ ...form.value, topicId: Number(form.value.topicId) })
    showPublish.value = false
    form.value = { title: '', content: '', topicId: '', images: [] }
    await load()
  } catch (cause) { error.value = cause.message } finally { publishing.value = false }
}
watch(topicId, load)
onMounted(async () => {
  try {
    const [topicData, hotData] = await Promise.all([getTopicList({ page: 0, size: 50 }), getHotPosts({ page: 0, size: 8 })])
    topics.value = rows(topicData)
    hotPosts.value = rows(hotData)
  } catch (cause) { error.value = cause.message }
  await load()
})
</script>

<template>
  <div class="feature-page forum-shell">
    <AppTabBar />
    <main class="feature-container forum-page">
      <header class="feature-heading forum-heading">
        <div><h1>校园论坛</h1><p>分享校园生活，围绕话题交流经验</p></div>
        <button class="feature-button feature-button--primary" type="button" @click="showPublish = true">发布帖子</button>
      </header>
      <div v-if="error" class="feature-error">{{ error }}</div>

      <div class="forum-layout">
        <aside class="feature-card hot-panel">
          <h2>热门讨论</h2>
          <button v-for="(post, index) in hotPosts" :key="post.id" type="button" @click="router.push(`/forum/posts/${post.id}`)">
            <b>{{ String(index + 1).padStart(2, '0') }}</b><span>{{ post.title || post.content }}</span>
          </button>
        </aside>

        <div class="forum-content">
          <form class="forum-search" role="search" @submit.prevent="searchPosts">
            <img src="/icons/search.svg" alt="" />
            <input v-model="keywordInput" type="search" placeholder="搜索帖子标题" aria-label="搜索帖子标题" />
            <button v-if="keywordInput" class="search-clear" type="button" aria-label="清除搜索" @click="clearSearch">×</button>
            <button class="search-submit" type="submit">搜索</button>
          </form>

          <nav class="topic-tabs" aria-label="论坛话题分类">
            <button type="button" :class="{ active: !topicId }" @click="topicId = ''"><span>全部动态</span></button>
            <button v-for="topic in topics" :key="topic.id" type="button" :class="{ active: String(topicId) === String(topic.id) }" @click="topicId = topic.id">
              <span>{{ topic.name || topic.topicName }}</span><small v-if="topic.postCount">{{ topic.postCount }}</small>
            </button>
          </nav>

          <section class="forum-feed">
            <div v-if="loading" class="feature-empty">正在加载帖子…</div>
            <div v-else-if="!posts.length" class="feature-empty forum-empty">{{ keyword ? `没有找到“${keyword}”相关帖子` : '暂无帖子' }}</div>
            <article v-for="post in posts" :key="post.id" class="feature-card post-card" @click="router.push(`/forum/posts/${post.id}`)">
              <header>
                <span class="avatar" @click.stop="router.push(`/forum/users/${post.userId}`)">{{ (post.username || '匿').slice(0, 1) }}</span>
                <div><strong @click.stop="router.push(`/forum/users/${post.userId}`)">{{ post.username || '匿名用户' }}</strong><small>{{ post.createTime }}</small></div>
                <em v-if="post.topicName">{{ post.topicName }}</em>
              </header>
              <h2 v-if="post.title">{{ post.title }}</h2><p>{{ post.content }}</p>
              <div v-if="parseImages(post.images).length" class="post-images"><img v-for="image in parseImages(post.images).slice(0, 3)" :key="image" :src="image" alt="" /></div>
              <footer><button type="button" @click.stop="like(post)"><i :class="{ active: post.isLiked }" />{{ post.likeCount || 0 }} 点赞</button><span>{{ post.commentCount || 0 }} 评论</span><span>{{ post.viewCount || 0 }} 浏览</span></footer>
            </article>
          </section>
        </div>
      </div>
    </main>

    <div v-if="showPublish" class="feature-modal-mask" @click.self="showPublish = false">
      <form class="feature-modal feature-form" @submit.prevent="publish">
        <div class="feature-modal__head"><h2>发布帖子</h2><button type="button" class="feature-modal__close" @click="showPublish = false">×</button></div>
        <label>话题<select v-model="form.topicId" class="feature-select" required><option value="">请选择话题</option><option v-for="topic in topics" :key="topic.id" :value="topic.id">{{ topic.name || topic.topicName }}</option></select></label>
        <label>标题<input v-model="form.title" class="feature-input" maxlength="100" /></label>
        <label>正文<textarea v-model="form.content" class="feature-textarea" required maxlength="3000" /></label>
        <button class="feature-button feature-button--primary" :disabled="publishing">{{ publishing ? '发布中…' : '确认发布' }}</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.forum-shell{position:relative;min-height:100vh;isolation:isolate}
.forum-shell::before{position:fixed;z-index:-1;inset:60px 0 0;background:linear-gradient(180deg,rgba(250,248,240,.9),rgba(247,246,239,.88));content:'';pointer-events:none}.forum-page{width:min(100%,1320px);font-family:'Source Han Sans SC','Noto Sans CJK SC','Microsoft YaHei',sans-serif}.forum-heading{position:relative;padding:12px 0 12px 22px}.forum-heading::before{position:absolute;left:0;top:12px;bottom:12px;width:4px;border-radius:99px;background:linear-gradient(180deg,#d9b561,#a9792f);content:''}.forum-heading h1{color:#123f49;font-family:'STXingkai','华文行楷','LXGW WenKai Screen','霞鹜文楷 屏幕阅读版','STKaiti','KaiTi',serif;font-size:40px;font-weight:500;letter-spacing:5px;line-height:1.25;text-shadow:0 1px 0 rgba(185,138,50,.16)}.forum-heading p{color:#647b7c;font-weight:500}.forum-page .feature-button{border-color:rgba(176,132,51,.42);color:#315f60;background:rgba(255,253,247,.94)}.forum-page .feature-button--primary{border-color:#a97b2f;color:#fffdf6;background:linear-gradient(115deg,#174e58,#277b7d);box-shadow:0 7px 18px rgba(25,90,91,.18)}
.forum-layout{display:grid;grid-template-columns:256px minmax(0,1fr);align-items:start;gap:22px}.hot-panel{position:sticky;top:84px;min-height:calc(100vh - 108px);padding:22px 18px;overflow:hidden;border-color:rgba(190,153,79,.3);background:linear-gradient(180deg,rgba(255,253,248,.97) 0%,rgba(255,253,248,.95) 64%,rgba(245,249,244,.92) 100%);box-shadow:0 10px 28px rgba(73,91,79,.07)}.hot-panel::after{position:absolute;z-index:0;right:-46px;bottom:-24px;left:-46px;height:260px;background:url('../assets/campus-portal-background-v2.png') center bottom/620px auto no-repeat;content:'';opacity:.14;pointer-events:none;mask-image:linear-gradient(180deg,transparent,#000)}.hot-panel>*{position:relative;z-index:1}.hot-panel h2{margin:0 6px 12px;padding-bottom:14px;border-bottom:1px solid rgba(185,138,50,.2);color:#123f49;font-size:20px;letter-spacing:1px}.hot-panel button{display:grid;grid-template-columns:30px minmax(0,1fr);gap:8px;width:100%;padding:12px 8px;border-bottom:1px solid rgba(185,138,50,.13);color:#506b6d;background:transparent;text-align:left;transition:.18s}.hot-panel button:hover{color:#815c1f;background:rgba(255,248,229,.68)}.hot-panel b{color:#b3832f;font-family:Georgia,serif;font-size:13px}.hot-panel span{display:-webkit-box;overflow:hidden;line-height:1.55;-webkit-box-orient:vertical;-webkit-line-clamp:2}
.forum-content{min-width:0}.forum-search{display:flex;align-items:center;gap:12px;width:100%;padding:0 8px 0 18px;margin-bottom:14px;border:1px solid rgba(178,145,79,.32);border-radius:11px;background:rgba(255,253,248,.95);box-shadow:0 8px 24px rgba(73,91,79,.06)}.forum-search:focus-within{border-color:rgba(185,138,50,.7);box-shadow:0 0 0 3px rgba(185,138,50,.1),0 8px 24px rgba(73,91,79,.06)}.forum-search img{width:18px;height:18px;opacity:.5}.forum-search input{flex:1;min-width:0;height:54px;border:0;outline:none;color:#263e42;background:transparent;font-size:14px}.search-clear{width:26px;height:26px;border-radius:50%;color:#8a7a62;background:#f4eee1;font-size:17px}.search-submit{min-width:82px;height:40px;border:1px solid #b98a32;border-radius:8px;color:#fffdf6;background:#1c6268;font-weight:750}
.topic-tabs{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:18px}.topic-tabs button{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:0 16px;border:1px solid rgba(179,151,94,.3);border-radius:10px;color:#405d60;background:rgba(255,253,248,.94);box-shadow:0 4px 14px rgba(73,91,79,.04);font-weight:700;transition:.18s}.topic-tabs button:hover{border-color:#c69b45;color:#835f20;box-shadow:0 8px 18px rgba(154,111,34,.1);transform:translateY(-1px)}.topic-tabs button.active{border-color:#c39742;color:#704d18;background:linear-gradient(135deg,#fffaf0,#f3dfae)}.topic-tabs small{min-width:20px;padding:2px 6px;border-radius:99px;color:#567375;background:#edf4ef;font-size:11px}
.forum-feed{display:grid;gap:14px}.post-card{padding:20px 22px;border-color:rgba(190,153,79,.24);background:rgba(255,254,250,.96);cursor:pointer;transition:.18s}.post-card:hover{border-color:rgba(190,142,52,.72);box-shadow:0 10px 24px rgba(133,100,39,.1);transform:translateY(-2px)}.post-card header{display:flex;align-items:center;gap:10px}.avatar{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;color:#2f6f70;background:#eaf3ef;font-weight:800}.post-card header>div{flex:1}.post-card header strong,.post-card header small{display:block}.post-card header strong{color:#294548}.post-card header small{margin-top:3px;color:#8b9895;font-size:11px}.post-card header em{padding:4px 9px;border-radius:999px;color:#846021;background:#f8efd9;font-size:11px;font-style:normal}.post-card h2{margin:17px 0 7px;color:#1f3c43;font-size:19px}.post-card>p{margin:0;color:#607477;line-height:1.75;white-space:pre-wrap}.post-images{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:14px}.post-images img{width:100%;height:150px;border-radius:7px;object-fit:cover}.post-card footer{display:flex;gap:24px;margin-top:17px;padding-top:14px;border-top:1px solid rgba(185,138,50,.13);color:#798b8b;font-size:12px}.post-card footer button{color:inherit;background:transparent}.post-card footer i{display:inline-block;width:9px;height:9px;margin-right:6px;border:1px solid #829895;border-radius:50%}.post-card footer i.active{border-color:#b98a32;background:#b98a32}.forum-empty{border:1px solid rgba(190,153,79,.25);background:rgba(255,253,248,.92)}
@media(max-width:900px){.forum-layout{grid-template-columns:210px minmax(0,1fr);gap:16px}}@media(max-width:700px){.forum-layout{display:flex;flex-direction:column}.hot-panel{position:static;order:2;width:100%;min-height:0}.hot-panel::after{display:none}.forum-content{order:1;width:100%}.topic-tabs{overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px}.topic-tabs button{flex:0 0 auto}.search-submit{min-width:68px}.forum-heading h1{font-size:34px}}
</style>
