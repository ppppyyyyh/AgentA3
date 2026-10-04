<template>
	<view class="home-page">
		<view class="home-topbar">
			<view class="home-location" @click="navigate('/pages/map/map')">
				<view class="home-location__pin"></view>
				<text class="home-location__text">校园</text>
				<view class="home-location__chevron"></view>
			</view>
			<view class="home-search" @click="navigate('/subpackage_lostfound/marketplaceHome/marketplaceHome')">
				<view class="home-search__icon"></view>
				<text class="home-search__placeholder">搜索校园好物</text>
			</view>
			<view class="home-scan" aria-label="更多">
				<view class="home-scan__dot"></view>
				<view class="home-scan__dot"></view>
				<view class="home-scan__ring"></view>
			</view>
		</view>

		<view class="redesign-shell">
			<view class="redesign-hero">
				<image class="redesign-hero__image" src="/static/index/landscape-ink-mountains.png" mode="aspectFill" />
				<view class="redesign-hero__mist redesign-hero__mist--one"></view>
				<view class="redesign-hero__mist redesign-hero__mist--two"></view>
				<view class="redesign-hero__sun"></view>
				<view class="redesign-hero__ridge redesign-hero__ridge--back"></view>
				<view class="redesign-hero__ridge redesign-hero__ridge--front"></view>
				<view class="redesign-hero__copy">
					<text class="redesign-hero__eyebrow">校园生活志</text>
					<text class="redesign-hero__title">一站式校园生活</text>
					<text class="redesign-hero__desc">发现校园里的每一件好事物</text>
				</view>
			</view>

			<view class="redesign-content">
				<view class="redesign-section-head">
					<view>
						<text class="redesign-section-kicker">今日校园</text>
						<text class="redesign-section-title">慢下来，逛一逛</text>
					</view>
					<view class="redesign-brush-mark"></view>
				</view>

				<view class="redesign-entry-grid">
					<view class="redesign-entry redesign-entry--wide" @click="navigate('/subpackage_lostfound/marketplaceHome/marketplaceHome')">
						<image class="redesign-entry__image" src="/static/index/landscape-blue-lake.png" mode="aspectFill" />
						<view class="redesign-entry__copy">
							<text class="redesign-entry__label">校园集市</text>
							<text class="redesign-entry__desc">闲置好物，遇见新主人</text>
						</view>
						<view class="redesign-entry__fan"></view>
					</view>
					<view class="redesign-entry redesign-entry--food" @click="navigate('/subpackage_facility/restaurantDetail/restaurantDetail')">
						<image class="redesign-entry__image" src="/static/index/landscape-lake.png" mode="aspectFill" />
						<text class="redesign-entry__label">食味校园</text>
						<text class="redesign-entry__desc">附近美食</text>
						<view class="redesign-entry__dish"></view>
					</view>
					<view class="redesign-entry redesign-entry--activity" @click="navigate('/subpackage_community/communityActivity/communityActivity')">
						<image class="redesign-entry__image" src="/static/index/activity-sunset.png" mode="aspectFill" />
						<text class="redesign-entry__label">校园活动</text>
						<text class="redesign-entry__desc">去参加喜欢的事</text>
						<view class="redesign-entry__leaf"></view>
					</view>
					<view class="redesign-entry redesign-entry--forum" @click="navigate('/subpackage_forum/forumList/forumList', 'reLaunch')">
						<image class="redesign-entry__image" src="/static/index/forum-bamboo.png" mode="aspectFill" />
						<text class="redesign-entry__label">同窗雅集</text>
						<text class="redesign-entry__desc">看看大家在聊什么</text>
						<view class="redesign-entry__ink"></view>
					</view>
					<view class="redesign-entry redesign-entry--promotion" @click="navigate('/subpackage_promotion/promotion/promotion')">
						<image class="redesign-entry__image" src="/static/index/landscape-market.png" mode="aspectFill" />
						<text class="redesign-entry__label">惠享校园</text>
						<text class="redesign-entry__desc">今日优惠</text>
					</view>
				</view>

				<view class="redesign-notice redesign-scroll-card" @click="goToNotice">
					<view class="redesign-notice__stamp">闻</view>
					<view class="redesign-notice__copy">
						<text class="redesign-notice__label">校园见闻</text>
						<text class="redesign-notice__text">{{ headline || '暂无公告' }}</text>
					</view>
				</view>

				<view class="redesign-ai redesign-ink-card" @click="toggleCampusAi(true)">
					<image class="redesign-ai__image" src="/static/index/landscape-boat.png" mode="aspectFill" />
					<view class="redesign-ai__seal">AI</view>
					<view class="redesign-ai__copy">
						<text class="redesign-ai__title">校园智囊</text>
						<text class="redesign-ai__desc">记录、创作与安排，都交给它</text>
					</view>
				</view>

				<view v-if="campusAiExpanded" class="redesign-ai-panel">
					<view class="redesign-ai-panel__head">
						<text>今日想做什么？</text>
						<text class="redesign-ai-panel__close" @click.stop="toggleCampusAi(false)">×</text>
					</view>
					<view class="redesign-ai-panel__actions">
						<view @click.stop="navigate('/subpackage_meeting/meetingRoom/meetingRoom')"><text>记录会议</text><text>语音转写与纪要</text></view>
						<view @click.stop="navigate('/subpackage_ai/aiCreate/aiCreate')"><text>灵感创作</text><text>海报、文案、PPT</text></view>
					</view>
				</view>

				<view class="redesign-schedule-head">
					<text>今日行程</text>
					<text class="redesign-schedule-more" @click="navigate('/subpackage_meeting/meetingSchedule/meetingSchedule')">查看全部 →</text>
				</view>
				<home-schedule-card />
			</view>
		</view>
		<view class="hero-shell">
			<swiper
				class="hero-swiper"
				indicator-dots
				autoplay
				circular
				interval="3200"
				duration="500"
			>
				<swiper-item v-for="item in heroSlides" :key="item.title">
					<view class="poster-card" :class="`poster-card--${item.theme}`">
						<image class="poster-image" :src="item.image" mode="aspectFill" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="main-content">
			<view class="home-quick-entry">
				<view
					class="home-quick-entry__item home-quick-entry__item--activity"
					aria-label="活动"
					@click="navigate('/subpackage_community/communityActivity/communityActivity')"
				>
					<image class="home-quick-entry__icon" src="/static/index/quick-entry/activity.png" mode="aspectFit" />
					<text class="home-quick-entry__text">活动</text>
				</view>

				<view
					class="home-quick-entry__item home-quick-entry__item--food"
					aria-label="美食"
					@click="navigate('/subpackage_facility/restaurantDetail/restaurantDetail')"
				>
					<image class="home-quick-entry__icon" src="/static/index/quick-entry/food.png" mode="aspectFit" />
					<text class="home-quick-entry__text">美食</text>
				</view>

				<view
					class="home-quick-entry__item home-quick-entry__item--trade"
					aria-label="交易"
					@click="navigate('/subpackage_lostfound/marketplaceHome/marketplaceHome')"
				>
					<image class="home-quick-entry__icon" src="/static/index/quick-entry/trade.png" mode="aspectFit" />
					<text class="home-quick-entry__text">交易</text>
				</view>

				<view
					class="home-quick-entry__item home-quick-entry__item--forum"
					aria-label="论坛"
					@click="navigate('/subpackage_forum/forumList/forumList', 'reLaunch')"
				>
					<image class="home-quick-entry__icon" src="/static/index/quick-entry/forum.png" mode="aspectFit" />
					<text class="home-quick-entry__text">论坛</text>
				</view>

				<view
					class="home-quick-entry__item home-quick-entry__item--promotion"
					aria-label="优惠"
					@click="navigate('/subpackage_promotion/promotion/promotion')"
				>
					<image class="home-quick-entry__icon" src="/static/index/quick-entry/promotion.png" mode="aspectFit" />
					<text class="home-quick-entry__text">优惠</text>
				</view>
			</view>

			<view class="headline-card" @click="goToNotice">
				<view class="headline-left">
					<view class="headline-dot"></view>
					<text class="headline-label">公告</text>
				</view>
				<view class="headline-marquee">
					<view class="headline-track">
						<text class="headline-text">{{ headline }}</text>
						<text class="headline-separator">·</text>
						<text class="headline-text">{{ headline }}</text>
					</view>
				</view>
				<view class="headline-arrow">
					<view class="arrow-line"></view>
				</view>
			</view>

			<view class="campus-ai-module">
				<view
					v-if="!campusAiExpanded"
					class="campus-ai-fold-card"
					@click="toggleCampusAi(true)"
					@touchstart="captureCampusAiTouchStart"
					@touchend="handleCampusAiTouchEnd"
				>
					<view class="campus-ai-fold-main">
						<view class="campus-ai-mark">
							<text class="campus-ai-mark__spark">✦</text>
						</view>
						<view class="campus-ai-copy">
							<text class="campus-ai-title">校园 AI</text>
							<text class="campus-ai-subtitle">记录会议 · 生成内容 · 智能总结</text>
						</view>
					</view>
					<text class="campus-ai-chevron">⌄</text>
				</view>

				<view v-else class="campus-ai-expand-card">
					<view class="campus-ai-expand-head">
						<text class="campus-ai-question">今天想做什么?</text>
						<view class="campus-ai-close" @click.stop="toggleCampusAi(false)">×</view>
					</view>

					<view class="campus-ai-actions">
						<view class="campus-ai-action campus-ai-action--meeting" @click.stop="navigate('/subpackage_meeting/meetingRoom/meetingRoom')">
							<view class="campus-ai-action-icon campus-ai-action-icon--meeting">
								<view class="campus-ai-mic">
									<view class="campus-ai-mic__stem"></view>
								</view>
							</view>
							<view class="campus-ai-action-copy">
								<text class="campus-ai-action-title">记录会议</text>
								<text class="campus-ai-action-desc">语音转写 / 纪要生成</text>
							</view>
						</view>

						<view class="campus-ai-action campus-ai-action--create" @click.stop="navigate('/subpackage_ai/aiCreate/aiCreate')">
							<view class="campus-ai-action-icon campus-ai-action-icon--create">
								<view class="campus-ai-pen">
									<view class="campus-ai-pen__body"></view>
									<view class="campus-ai-pen__tip"></view>
								</view>
							</view>
							<view class="campus-ai-action-copy">
								<text class="campus-ai-action-title">灵感创作</text>
								<text class="campus-ai-action-desc">海报 / 文案 / PPT</text>
							</view>
						</view>
					</view>

					<view class="campus-ai-recent-label">最近使用</view>
					<view class="campus-ai-recent" @click.stop="navigate('/subpackage_meeting/meetingSchedule/meetingSchedule')">
						<view class="campus-ai-doc-icon"></view>
						<view class="campus-ai-recent-copy">
							<text class="campus-ai-recent-title">会议日程与历史</text>
							<text class="campus-ai-recent-desc">查看最近会议记录与 AI 纪要</text>
						</view>
						<text class="campus-ai-recent-arrow">›</text>
					</view>
				</view>
			</view>

			<home-schedule-card />
		</view>

		<ai-float-assistant />

		<app-main-tab-bar current="index" />
	</view>
</template>

<script>
import AppMainTabBar from '@/components/app-main-tab-bar/app-main-tab-bar.vue'
import AiFloatAssistant from '@/components/ai-float-assistant/ai-float-assistant.vue'
import HomeScheduleCard from '@/components/home-schedule-card/home-schedule-card.vue'
import { getEnabledAnnouncements } from '@/api/notice.js'

export default {
	components: { AppMainTabBar, HomeScheduleCard, AiFloatAssistant },
	data() {
		return {
			headline: '',
			announcements: [],
			campusAiExpanded: false,
			campusAiTouchStartY: 0,

			heroSlides: [
				{
					title: '节约用水',
					image: '/static/index/hero-water-conservation.jpg',
					theme: 'blue'
				},
				{
					title: '珍惜粮食',
					image: '/static/index/hero-food-day.jpg',
					theme: 'orange'
				},
				{
					title: '烈士纪念日',
					image: '/static/index/hero-martyrs-day.jpg',
					theme: 'red'
				},
				{
					title: '校园建筑',
					image: '/static/index/hero-campus-building.jpg',
					theme: 'green'
				}
			]
		}
	},
	onLoad() {
		this.checkLogin()
		this.fetchAnnouncements()
	},
	onShow() {
		this.checkLogin()
		this.fetchAnnouncements()
	},
	methods: {
		checkLogin() {
			const token = uni.getStorageSync('token')
			const userInfoStr = uni.getStorageSync('userInfo')
			if (!token || !userInfoStr) {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		},
		navigate(path, mode = 'navigateTo') {
			if (mode === 'reLaunch') {
				uni.reLaunch({ url: path })
				return
			}
			uni.navigateTo({ url: path })
		},
		toggleCampusAi(expanded) {
			this.campusAiExpanded = typeof expanded === 'boolean' ? expanded : !this.campusAiExpanded
		},
		captureCampusAiTouchStart(event) {
			const point = event.changedTouches?.[0] || event.touches?.[0]
			this.campusAiTouchStartY = point ? point.clientY : 0
		},
		handleCampusAiTouchEnd(event) {
			const point = event.changedTouches?.[0] || event.touches?.[0]
			const endY = point ? point.clientY : 0
			if (this.campusAiTouchStartY && this.campusAiTouchStartY - endY > 24) {
				this.toggleCampusAi(true)
			}
			this.campusAiTouchStartY = 0
		},
		goToNotice() {
			uni.navigateTo({
				url: '/pages/notice/notice'
			})
		},
		async fetchAnnouncements() {
			try {
				const res = await getEnabledAnnouncements()
				if (res.code === 200 && res.data && res.data.length > 0) {
					this.announcements = res.data
					this.headline = res.data[0].title
				} else {
					this.headline = '暂无公告'
				}
			} catch (err) {
				console.error('获取公告失败:', err)
				this.headline = '暂无公告'
			}
		},


	},

}
</script>

<style lang="scss">
.home-page {
	min-height: 100vh;
	background:
		radial-gradient(circle at 6% 18%, rgba(255, 220, 88, 0.20), transparent 24%),
		radial-gradient(circle at 96% 38%, rgba(56, 190, 139, 0.18), transparent 26%),
		linear-gradient(180deg, #e8f7ed 0%, #f8fcf9 58%, #edf8f1 100%);
	padding-bottom: 240rpx;
}

.hero-shell {
	padding: 0;
	position: relative;
}

.hero-swiper {
	height: 602rpx;
}

.hero-swiper :deep(.uni-swiper-dots),
.hero-swiper ::v-deep .uni-swiper-dots {
	bottom: 56rpx !important;
}

.poster-card {
	position: relative;
	overflow: hidden;
	border-radius: 0;
	background: transparent;
	height: 602rpx;
}

.poster-card--violet {
	background: transparent;
}

.poster-card--green {
	background: transparent;
}

.poster-image {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.main-content {
	padding: 20rpx 28rpx 0;
	margin-top: -46rpx;
	position: relative;
	z-index: 3;
}

.home-quick-entry {
	display: grid;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 12rpx;
	width: 100%;
	margin-top: 46rpx;
}

.home-quick-entry__item {
	position: relative;
	min-width: 0;
	height: 142rpx;
	overflow: hidden;
	border-radius: 24rpx;
	border: 2rpx solid rgba(255, 255, 255, 0.96);
	background: linear-gradient(155deg, #ffffff, rgba(247, 255, 250, 0.96));
	box-shadow: 0 10rpx 22rpx rgba(28, 101, 77, 0.14);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	transition: transform 0.16s ease, box-shadow 0.16s ease;
}

.home-quick-entry__item:active {
	transform: translateY(2rpx) scale(0.98);
	box-shadow: 0 5rpx 12rpx rgba(28, 101, 77, 0.12);
}

.home-quick-entry__icon {
	width: 98rpx;
	height: 98rpx;
	display: block;
	pointer-events: none;
}

.home-quick-entry__text {
	margin-top: -7rpx;
	font-size: 22rpx;
	font-weight: 800;
	line-height: 1;
	color: #176a57;
}

.home-quick-entry__item--food .home-quick-entry__text,
.home-quick-entry__item--promotion .home-quick-entry__text {
	color: #9a7007;
}

.home-quick-entry__item--forum .home-quick-entry__text {
	color: #25739e;
}

.headline-card {
	position: relative;
	margin-top: 26rpx;
	background: linear-gradient(90deg, #ffffff, rgba(251, 255, 252, 0.96));
	border: 1rpx solid rgba(211, 231, 221, 0.92);
	border-radius: 22rpx;
	padding: 20rpx 24rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 12rpx 25rpx rgba(31, 91, 71, 0.11);
	overflow: hidden;
}

.headline-card::before {
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	bottom: 0;
	width: 6rpx;
	background: linear-gradient(180deg, #0aa87a, #24a7e5, #f1bd3c);
}

/* 左侧标签区域 */
.headline-left {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	gap: 12rpx;
	margin-right: 20rpx;
}

.headline-dot {
	width: 6rpx;
	height: 6rpx;
	border-radius: 50%;
	background: #5C7A99;
}

.headline-label {
	font-size: 24rpx;
	color: #5C7A99;
	font-weight: 500;
}

.headline-marquee {
	flex: 1;
	overflow: hidden;
	min-width: 0;
}

.headline-track {
	display: inline-flex;
	align-items: center;
	white-space: nowrap;
	animation: headline-marquee 16s linear infinite;
	will-change: transform;
}

.headline-text {
	font-size: 28rpx;
	color: #4b585d;
	flex-shrink: 0;
}

.headline-separator {
	margin: 0 34rpx;
	font-size: 28rpx;
	color: #88a2a4;
}

/* 右侧简约箭头 */
.headline-arrow {
	flex-shrink: 0;
	margin-left: 16rpx;
	width: 40rpx;
	height: 40rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.arrow-line {
	width: 8rpx;
	height: 8rpx;
	border-right: 2rpx solid #B0B8C0;
	border-bottom: 2rpx solid #B0B8C0;
	transform: rotate(-45deg);
}

@keyframes headline-marquee {
	0% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(-100%);
	}
}

.campus-ai-module {
	margin-top: 28rpx;
}

.campus-ai-fold-card,
.campus-ai-expand-card {
	position: relative;
	box-sizing: border-box;
	border: 1rpx solid rgba(226, 235, 239, 0.92);
	background: linear-gradient(145deg, rgba(244, 255, 249, 0.98), #ffffff 52%, rgba(241, 247, 255, 0.98));
	box-shadow: 0 18rpx 46rpx rgba(31, 98, 75, 0.14);
}

.campus-ai-fold-card {
	min-height: 144rpx;
	padding: 26rpx 30rpx;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	overflow: hidden;
}

.campus-ai-fold-card::before {
	content: '';
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 48rpx;
	background: linear-gradient(90deg, rgba(216, 251, 230, 0.88), rgba(226, 240, 255, 0.86));
	opacity: 0.7;
	pointer-events: none;
}

.campus-ai-fold-card:active,
.campus-ai-action:active,
.campus-ai-recent:active {
	transform: translateY(2rpx);
}

.campus-ai-fold-main {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	min-width: 0;
}

.campus-ai-mark {
	width: 58rpx;
	height: 58rpx;
	border-radius: 20rpx;
	background: linear-gradient(135deg, #dff9e8, #e6f1ff);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.82);
	flex-shrink: 0;
}

.campus-ai-mark__spark {
	color: #2476f2;
	font-size: 30rpx;
	font-weight: 900;
	line-height: 1;
}

.campus-ai-copy {
	margin-left: 18rpx;
	display: flex;
	flex-direction: column;
	min-width: 0;
}

.campus-ai-title {
	font-size: 29rpx;
	font-weight: 900;
	color: #17242b;
	line-height: 1.25;
}

.campus-ai-subtitle {
	margin-top: 6rpx;
	font-size: 22rpx;
	line-height: 1.35;
	color: #6d7d86;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 500rpx;
}

.campus-ai-chevron {
	position: relative;
	z-index: 1;
	width: 42rpx;
	height: 42rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #5e6e78;
	font-size: 34rpx;
	line-height: 1;
}

.campus-ai-expand-card {
	min-height: 380rpx;
	padding: 26rpx 30rpx 28rpx;
	border-radius: 24rpx;
	overflow: hidden;
	background:
		linear-gradient(145deg, rgba(234, 255, 242, 0.72) 0%, rgba(255, 255, 255, 0.90) 42%),
		linear-gradient(35deg, rgba(255, 255, 255, 0) 40%, rgba(238, 245, 255, 0.92) 100%),
		#ffffff;
}

.campus-ai-expand-head {
	position: relative;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 42rpx;
}

.campus-ai-question {
	font-size: 28rpx;
	font-weight: 900;
	color: #1d282f;
	line-height: 1.3;
}

.campus-ai-close {
	position: absolute;
	right: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #687986;
	font-size: 32rpx;
	line-height: 1;
}

.campus-ai-actions {
	position: relative;
	z-index: 1;
	margin-top: 28rpx;
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18rpx;
}

.campus-ai-action {
	position: relative;
	min-width: 0;
	min-height: 122rpx;
	padding: 22rpx 20rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	border: 1rpx solid rgba(228, 238, 243, 0.92);
	box-shadow: 0 12rpx 28rpx rgba(43, 99, 78, 0.10);
	overflow: hidden;
}

.campus-ai-action::before {
	content: '';
	position: absolute;
	left: 0;
	top: 22rpx;
	bottom: 22rpx;
	width: 5rpx;
	border-radius: 999rpx;
	background: #20b46b;
}

.campus-ai-action--create::before {
	background: linear-gradient(180deg, #3b82d9, #8669d7);
}

.campus-ai-action--meeting {
	background: linear-gradient(135deg, rgba(244, 255, 247, 0.96), rgba(255, 255, 255, 0.94));
}

.campus-ai-action--create {
	background: linear-gradient(135deg, rgba(246, 250, 255, 0.96), rgba(255, 255, 255, 0.96));
}

.campus-ai-action-icon {
	width: 66rpx;
	height: 66rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.campus-ai-action-icon--meeting {
	background: #dff9e6;
}

.campus-ai-action-icon--create {
	background: linear-gradient(145deg, #e4efff, #f1eafe);
}

.campus-ai-mic {
	position: relative;
	width: 38rpx;
	height: 48rpx;
}

.campus-ai-mic::before {
	content: '';
	position: absolute;
	top: 2rpx;
	left: 50%;
	width: 18rpx;
	height: 30rpx;
	border-radius: 999rpx;
	background: #20b46b;
	transform: translateX(-50%);
}

.campus-ai-mic::after {
	content: '';
	position: absolute;
	top: 20rpx;
	left: 50%;
	width: 32rpx;
	height: 22rpx;
	border: 4rpx solid #20b46b;
	border-top: 0;
	border-radius: 0 0 18rpx 18rpx;
	transform: translateX(-50%);
	box-sizing: border-box;
}

.campus-ai-mic__stem {
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 18rpx;
	height: 4rpx;
	border-radius: 999rpx;
	background: #20b46b;
	transform: translateX(-50%);
}

.campus-ai-mic__stem::before {
	content: '';
	position: absolute;
	left: 50%;
	bottom: 0;
	width: 4rpx;
	height: 14rpx;
	border-radius: 999rpx;
	background: #20b46b;
	transform: translateX(-50%);
}

.campus-ai-pen {
	position: relative;
	width: 38rpx;
	height: 38rpx;
	transform: rotate(-42deg);
}

.campus-ai-pen__body {
	position: absolute;
	left: 13rpx;
	top: 2rpx;
	width: 14rpx;
	height: 27rpx;
	border-radius: 7rpx 7rpx 3rpx 3rpx;
	background: linear-gradient(180deg, #8669d7, #3b82d9);
	box-shadow: inset 0 0 0 2rpx rgba(255, 255, 255, 0.4);
}

.campus-ai-pen__tip {
	position: absolute;
	left: 14rpx;
	top: 27rpx;
	width: 0;
	height: 0;
	border-left: 6rpx solid transparent;
	border-right: 6rpx solid transparent;
	border-top: 10rpx solid #f2b94b;
}

.campus-ai-action-copy {
	margin-left: 16rpx;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.campus-ai-action-title {
	font-size: 25rpx;
	font-weight: 900;
	color: #1f2d35;
	line-height: 1.32;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.campus-ai-action-desc {
	margin-top: 6rpx;
	font-size: 20rpx;
	line-height: 1.3;
	color: #697a84;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.campus-ai-recent-label {
	position: relative;
	z-index: 1;
	margin-top: 26rpx;
	font-size: 22rpx;
	color: #687986;
	line-height: 1.35;
}

.campus-ai-recent {
	position: relative;
	z-index: 1;
	margin-top: 12rpx;
	min-height: 78rpx;
	padding: 16rpx 18rpx;
	border-radius: 18rpx;
	background: rgba(255, 255, 255, 0.86);
	border: 1rpx solid rgba(226, 235, 239, 0.95);
	display: flex;
	align-items: center;
	box-sizing: border-box;
	box-shadow: 0 10rpx 24rpx rgba(73, 96, 106, 0.06);
}

.campus-ai-doc-icon {
	position: relative;
	width: 30rpx;
	height: 34rpx;
	border-radius: 6rpx;
	border: 3rpx solid #3478f6;
	box-sizing: border-box;
	flex-shrink: 0;
}

.campus-ai-doc-icon::before,
.campus-ai-doc-icon::after {
	content: '';
	position: absolute;
	left: 6rpx;
	right: 6rpx;
	height: 3rpx;
	border-radius: 999rpx;
	background: #3478f6;
}

.campus-ai-doc-icon::before {
	top: 9rpx;
}

.campus-ai-doc-icon::after {
	top: 18rpx;
}

.campus-ai-recent-copy {
	margin-left: 16rpx;
	min-width: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
}

.campus-ai-recent-title {
	font-size: 23rpx;
	font-weight: 800;
	color: #21313a;
	line-height: 1.3;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.campus-ai-recent-desc {
	margin-top: 4rpx;
	font-size: 19rpx;
	line-height: 1.3;
	color: #788892;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.campus-ai-recent-arrow {
	margin-left: 12rpx;
	color: #748590;
	font-size: 38rpx;
	line-height: 1;
	flex-shrink: 0;
}

.meeting-entry-card {
	position: relative;
	margin-top: 28rpx;
	padding: 28rpx;
	border-radius: 32rpx;
	overflow: hidden;
	background:
		radial-gradient(circle at 78% 18%, rgba(255, 214, 125, 0.42), transparent 28%),
		linear-gradient(135deg, #153f49 0%, #1e665f 48%, #d39d51 100%);
	box-shadow: 0 18rpx 38rpx rgba(31, 93, 91, 0.18);
}

.meeting-entry-card__glow {
	position: absolute;
	right: -70rpx;
	top: -86rpx;
	width: 260rpx;
	height: 260rpx;
	border-radius: 50%;
	border: 2rpx solid rgba(255, 255, 255, 0.22);
	box-shadow: inset 0 0 36rpx rgba(255, 255, 255, 0.18);
}

.meeting-entry-card__content {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 18rpx;
}

.meeting-entry-card__copy {
	flex: 1;
	min-width: 0;
	display: flex;
	flex-direction: column;
}

.meeting-entry-card__eyebrow {
	align-self: flex-start;
	padding: 6rpx 14rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.16);
	color: rgba(255, 255, 255, 0.82);
	font-size: 19rpx;
	font-weight: 800;
	letter-spacing: 2rpx;
}

.meeting-entry-card__title {
	margin-top: 14rpx;
	font-size: 46rpx;
	line-height: 1.1;
	color: #FFFFFF;
	font-weight: 900;
	letter-spacing: 3rpx;
}

.meeting-entry-card__desc {
	margin-top: 12rpx;
	max-width: 390rpx;
	font-size: 24rpx;
	line-height: 1.58;
	color: rgba(255, 255, 255, 0.86);
}

.meeting-entry-card__agents {
	display: flex;
	gap: 10rpx;
	margin-top: 18rpx;
}

.meeting-entry-card__tag {
	padding: 7rpx 16rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.14);
	border: 1rpx solid rgba(255, 255, 255, 0.22);
	color: rgba(255, 255, 255, 0.92);
	font-size: 20rpx;
	font-weight: 700;
}

.meeting-entry-card__visual {
	position: relative;
	width: 220rpx;
	height: 190rpx;
	flex-shrink: 0;
}

.meeting-board {
	position: absolute;
	right: 12rpx;
	top: 36rpx;
	width: 154rpx;
	height: 112rpx;
	border-radius: 28rpx;
	background: rgba(255, 255, 255, 0.92);
	box-shadow: 0 18rpx 28rpx rgba(12, 48, 49, 0.22);
	transform: rotate(-5deg);
}

.meeting-board::before {
	content: '';
	position: absolute;
	left: 24rpx;
	top: -16rpx;
	width: 58rpx;
	height: 28rpx;
	border-radius: 18rpx;
	background: #ffd67d;
}

.meeting-board__line {
	position: absolute;
	left: 24rpx;
	right: 30rpx;
	height: 8rpx;
	border-radius: 999rpx;
	background: rgba(30, 102, 95, 0.18);
}

.meeting-board__line--wide {
	top: 42rpx;
	right: 18rpx;
	background: rgba(30, 102, 95, 0.42);
}

.meeting-board__line:not(.meeting-board__line--wide) {
	top: 66rpx;
}

.meeting-board__spark {
	position: absolute;
	right: 22rpx;
	bottom: 18rpx;
	width: 22rpx;
	height: 22rpx;
	border-radius: 50%;
	background: #d39d51;
	box-shadow: 0 0 18rpx rgba(211, 157, 81, 0.78);
}

.meeting-avatar {
	position: absolute;
	width: 58rpx;
	height: 58rpx;
	border-radius: 22rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #153f49;
	font-size: 22rpx;
	font-weight: 900;
	background: #fff7df;
	box-shadow: 0 12rpx 24rpx rgba(11, 49, 52, 0.2);
}

.meeting-avatar--one {
	left: 10rpx;
	top: 20rpx;
	transform: rotate(8deg);
}

.meeting-avatar--two {
	left: 28rpx;
	bottom: 20rpx;
	background: #dff6ed;
	transform: rotate(-8deg);
}

.meeting-avatar--three {
	right: 0;
	bottom: 8rpx;
	background: #ffe6b8;
	transform: rotate(10deg);
}

.meeting-entry-card__action {
	position: relative;
	margin-top: 22rpx;
	display: inline-flex;
	align-items: center;
	gap: 12rpx;
	padding: 14rpx 20rpx;
	border-radius: 999rpx;
	background: rgba(255, 255, 255, 0.16);
	color: #FFFFFF;
	font-size: 24rpx;
	font-weight: 800;
}

.meeting-entry-card__arrow {
	width: 32rpx;
	height: 32rpx;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.24);
	font-size: 20rpx;
}

.supplement-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 18rpx;
	margin-top: 28rpx;
}

.supplement-card {
	position: relative;
	min-height: 168rpx;
	border-radius: 28rpx;
	padding: 28rpx 24rpx;
	box-shadow: 0 16rpx 30rpx rgba(193, 198, 182, 0.18);
}

.supplement-card--ai {
	background: linear-gradient(135deg, #6B8BA4 0%, #5C7A99 50%, #4A6278 100%);
	overflow: hidden;
	min-height: 240rpx;
}

.ai-card-content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 8rpx 0;
}

.ai-card-text {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	position: relative;
}

/* 标题装饰 */
.title-deco {
	display: flex;
	align-items: center;
	gap: 8rpx;
	margin-bottom: 4rpx;
}

.t-deco-line {
	width: 30rpx;
	height: 3rpx;
	background: linear-gradient(90deg, #FFD700, transparent);
	border-radius: 2rpx;
}

.t-deco-dot {
	width: 6rpx;
	height: 6rpx;
	background: #FFD700;
	border-radius: 50%;
	box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.8);
}

.ai-card-title {
	font-size: 48rpx;
	font-weight: 900;
	color: #FFFFFF;
	letter-spacing: 4rpx;
	text-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
}

.ai-card-subtitle {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.5;
	letter-spacing: 1rpx;
}

/* 功能标签 */
.feature-tags {
	display: flex;
	gap: 12rpx;
	margin-top: 8rpx;
}

.f-tag {
	padding: 8rpx 16rpx;
	background: rgba(255, 255, 255, 0.15);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 24rpx;
	font-size: 20rpx;
	color: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(4rpx);
	display: flex;
	align-items: center;
	gap: 6rpx;
}

.tag-icon {
	font-size: 18rpx;
	opacity: 0.9;
}

/* 底部数据展示 */
.data-show {
	display: flex;
	align-items: center;
	gap: 20rpx;
	margin-top: 20rpx;
	padding-top: 16rpx;
	border-top: 1rpx solid rgba(255, 255, 255, 0.15);
}

.data-item {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.data-num {
	font-size: 28rpx;
	font-weight: 800;
	color: #FFD700;
	text-shadow: 0 2rpx 8rpx rgba(255, 215, 0, 0.4);
}

.data-label {
	font-size: 18rpx;
	color: rgba(255, 255, 255, 0.7);
}

.data-divider {
	width: 1rpx;
	height: 30rpx;
	background: rgba(255, 255, 255, 0.2);
}

.ai-card-btn {
	margin-top: 24rpx;
	align-self: flex-start;
	background: linear-gradient(135deg, #8FA8B8, #6B8BA4);
	padding: 16rpx 36rpx;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	gap: 12rpx;
	box-shadow: 
		0 8rpx 24rpx rgba(92, 122, 153, 0.4),
		inset 0 2rpx 4rpx rgba(255, 255, 255, 0.3);
	position: relative;
	overflow: hidden;
}

.ai-card-btn::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
	animation: btn-shine 2s ease-in-out infinite;
}

@keyframes btn-shine {
	0% { left: -100%; }
	50%, 100% { left: 100%; }
}

.ai-card-btn-text {
	font-size: 26rpx;
	font-weight: 700;
	color: #FFFFFF;
	letter-spacing: 2rpx;
}

.btn-arrow {
	width: 32rpx;
	height: 32rpx;
	background: rgba(255, 255, 255, 0.25);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 20rpx;
	color: #FFFFFF;
	font-weight: 700;
}

.ai-card-visual {
	position: relative;
	width: 300rpx;
	height: 200rpx;
	flex-shrink: 0;
}

.ai-scene {
	position: relative;
	width: 100%;
	height: 100%;
}

/* 背景装饰圆 */
.bg-circles {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.bg-circle {
	position: absolute;
	border-radius: 50%;
	border: 1rpx solid rgba(255, 255, 255, 0.1);
}

.c-1 {
	width: 120rpx;
	height: 120rpx;
	top: 20rpx;
	left: 20rpx;
}

.c-2 {
	width: 160rpx;
	height: 160rpx;
	top: 0;
	left: 60rpx;
	border-color: rgba(255, 255, 255, 0.08);
}

.c-3 {
	width: 80rpx;
	height: 80rpx;
	bottom: 10rpx;
	right: 30rpx;
	border-color: rgba(255, 255, 255, 0.12);
}

/* 轨道装饰 */
.orbit-ring {
	position: absolute;
	border: 2rpx dashed rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

.orbit-1 {
	width: 140rpx;
	height: 140rpx;
	top: 15rpx;
	left: 40rpx;
	animation: orbit-rotate 10s linear infinite;
}

.orbit-2 {
	width: 180rpx;
	height: 180rpx;
	top: -5rpx;
	left: 20rpx;
	border-color: rgba(255, 255, 255, 0.1);
	animation: orbit-rotate 15s linear infinite reverse;
}

.orbit-dot {
	position: absolute;
	width: 8rpx;
	height: 8rpx;
	background: #FFD700;
	border-radius: 50%;
	box-shadow: 0 0 12rpx rgba(255, 215, 0, 0.8);
}

.orbit-1 .orbit-dot {
	top: -4rpx;
	left: 50%;
	transform: translateX(-50%);
}

.orbit-2 .orbit-dot {
	bottom: -4rpx;
	left: 30%;
}

@keyframes orbit-rotate {
	0% { transform: rotate(0deg); }
	100% { transform: rotate(360deg); }
}

/* 3D AI 盾牌 */
.ai-shield {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 120rpx;
	height: 140rpx;
}

.shield-body {
	position: absolute;
	inset: 0;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7));
	clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 
		0 20rpx 40rpx rgba(0, 0, 0, 0.3),
		inset 0 2rpx 10rpx rgba(255, 255, 255, 0.8);
}

.shield-text {
	font-size: 44rpx;
	font-weight: 900;
	color: #5C7A99;
	letter-spacing: 2rpx;
	text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.shield-shine {
	position: absolute;
	top: 10rpx;
	left: 20rpx;
	width: 30rpx;
	height: 40rpx;
	background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), transparent);
	clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
	pointer-events: none;
}

.shield-glow {
	position: absolute;
	inset: -20rpx;
	background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
	border-radius: 50%;
	pointer-events: none;
	animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
	0%, 100% { opacity: 0.5; transform: scale(1); }
	50% { opacity: 0.8; transform: scale(1.1); }
}

/* 功能图标环绕 */
.feature-orbit {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.orbit-icon {
	position: absolute;
	width: 36rpx;
	height: 36rpx;
	background: rgba(255, 255, 255, 0.15);
	border: 1rpx solid rgba(255, 255, 255, 0.3);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 16rpx;
	color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(4rpx);
}

.icon-1 {
	top: 20rpx;
	right: 40rpx;
	animation: icon-float 3s ease-in-out infinite;
}

.icon-2 {
	top: 80rpx;
	right: 10rpx;
	animation: icon-float 3s ease-in-out 1s infinite;
}

.icon-3 {
	bottom: 30rpx;
	right: 50rpx;
	animation: icon-float 3s ease-in-out 2s infinite;
}

@keyframes icon-float {
	0%, 100% { transform: translateY(0) scale(1); }
	50% { transform: translateY(-10rpx) scale(1.05); }
}

/* 上升箭头 */
.trend-arrow {
	position: absolute;
	bottom: 20rpx;
	right: 10rpx;
	width: 60rpx;
	height: 50rpx;
}

.arrow-body {
	position: absolute;
	bottom: 0;
	left: 20rpx;
	width: 8rpx;
	height: 40rpx;
	background: linear-gradient(180deg, #FFA94D, #FF8C42);
	border-radius: 4rpx;
	transform: rotate(-30deg);
	transform-origin: bottom center;
}

.arrow-head {
	position: absolute;
	top: 0;
	left: 8rpx;
	width: 0;
	height: 0;
	border-left: 16rpx solid transparent;
	border-right: 16rpx solid transparent;
	border-bottom: 24rpx solid #FF8C42;
	transform: rotate(-30deg);
}

/* 粒子效果 */
.particles {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.particle {
	position: absolute;
	width: 4rpx;
	height: 4rpx;
	background: rgba(255, 255, 255, 0.6);
	border-radius: 50%;
	animation: particle-float 4s ease-in-out infinite;
}

.p-1 { top: 20%; left: 10%; animation-delay: 0s; }
.p-2 { top: 40%; left: 5%; animation-delay: 0.5s; }
.p-3 { top: 60%; left: 15%; animation-delay: 1s; }
.p-4 { top: 30%; right: 5%; animation-delay: 1.5s; }
.p-5 { top: 70%; right: 15%; animation-delay: 2s; }
.p-6 { top: 50%; left: 20%; animation-delay: 2.5s; }

@keyframes particle-float {
	0%, 100% { 
		opacity: 0.3; 
		transform: translateY(0) scale(1); 
	}
	50% { 
		opacity: 0.8; 
		transform: translateY(-20rpx) scale(1.5); 
	}
}

/* 装饰线条 */
.deco-lines {
	position: absolute;
	top: 20rpx;
	left: 10rpx;
	width: 40rpx;
	height: 60rpx;
}

.d-line {
	position: absolute;
	width: 3rpx;
	background: rgba(255, 255, 255, 0.4);
	border-radius: 2rpx;
}

.d-line-1 {
	height: 20rpx;
	left: 10rpx;
	top: 0;
}

.d-line-2 {
	height: 35rpx;
	left: 20rpx;
	top: 10rpx;
}

.d-line-3 {
	height: 25rpx;
	left: 30rpx;
	top: 5rpx;
}

/* 光点装饰 */
.sparkles {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.sparkle-dot {
	position: absolute;
	width: 8rpx;
	height: 8rpx;
	background: #FFD700;
	border-radius: 50%;
	box-shadow: 0 0 16rpx 4rpx rgba(255, 215, 0, 0.8);
}

.s-1 {
	top: 20rpx;
	right: 30rpx;
	animation: sparkle-blink 1.5s ease-in-out infinite;
}

.s-2 {
	top: 60rpx;
	left: 20rpx;
	animation: sparkle-blink 1.5s ease-in-out 0.5s infinite;
}

.s-3 {
	bottom: 40rpx;
	right: 50rpx;
	width: 6rpx;
	height: 6rpx;
	animation: sparkle-blink 1.5s ease-in-out 1s infinite;
}

.s-4 {
	top: 40rpx;
	left: 50rpx;
	width: 5rpx;
	height: 5rpx;
	animation: sparkle-blink 2s ease-in-out 0.3s infinite;
}

.s-5 {
	bottom: 60rpx;
	left: 35rpx;
	width: 4rpx;
	height: 4rpx;
	animation: sparkle-blink 2s ease-in-out 0.8s infinite;
}

@keyframes sparkle-blink {
	0%, 100% {
		opacity: 0.4;
		transform: scale(0.8);
	}
	50% {
		opacity: 1;
		transform: scale(1.2);
	}
}

/* 环形装饰 */
.ring-deco {
	position: absolute;
	inset: 0;
	pointer-events: none;
}

.r-ring {
	position: absolute;
	border: 2rpx solid rgba(255, 255, 255, 0.2);
	border-radius: 50%;
}

.r-ring-1 {
	width: 60rpx;
	height: 60rpx;
	top: 30rpx;
	left: 30rpx;
	animation: ring-rotate 8s linear infinite;
}

.r-ring-2 {
	width: 80rpx;
	height: 80rpx;
	bottom: 20rpx;
	right: 20rpx;
	border-color: rgba(255, 255, 255, 0.1);
	animation: ring-rotate 10s linear infinite reverse;
}

@keyframes ring-rotate {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.supplement-card--course {
	background: linear-gradient(180deg, #eef5ff, #f8fbff);
}

.supplement-title {
	display: block;
	font-size: 38rpx;
	font-weight: 800;
	color: #57737d;
}

.supplement-desc {
	display: block;
	margin-top: 12rpx;
	font-size: 24rpx;
	line-height: 1.6;
	color: #93a2a7;
}

.supplement-arrow {
	position: absolute;
	right: 20rpx;
	bottom: 18rpx;
	width: 34rpx;
	height: 34rpx;
	border-radius: 50%;
	background: rgba(113, 137, 145, 0.12);
	color: #66828b;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 22rpx;
}

/* 青色古风首页覆写：保留原有数据和交互，仅统一视觉语言 */
.home-page {
	background: #f5f3eb;
	color: #244b4c;
	padding-bottom: 220rpx;
}

.home-topbar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 8;
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: calc(24rpx + env(safe-area-inset-top)) 28rpx 20rpx;
	background: linear-gradient(180deg, rgba(41, 121, 126, .94), rgba(41, 121, 126, .42), transparent);
}

.home-location {
	display: flex;
	align-items: center;
	flex-shrink: 0;
	color: #f8f5e9;
}

.home-location__pin {
	width: 14rpx;
	height: 14rpx;
	margin-right: 9rpx;
	border: 3rpx solid currentColor;
	border-radius: 50% 50% 50% 0;
	transform: rotate(-45deg);
}

.home-location__text {
	font-size: 25rpx;
	font-weight: 700;
	letter-spacing: 2rpx;
}

.home-location__chevron {
	width: 10rpx;
	height: 10rpx;
	margin-left: 10rpx;
	border-right: 2rpx solid currentColor;
	border-bottom: 2rpx solid currentColor;
	transform: rotate(45deg) translateY(-3rpx);
}

.home-search {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	height: 66rpx;
	padding: 0 22rpx;
	border-radius: 36rpx;
	background: rgba(255, 255, 255, .92);
	box-shadow: 0 8rpx 20rpx rgba(28, 76, 75, .12);
}

.home-search__icon {
	width: 22rpx;
	height: 22rpx;
	margin-right: 12rpx;
	border: 3rpx solid #8da7a1;
	border-radius: 50%;
	position: relative;
}

.home-search__icon::after {
	content: '';
	position: absolute;
	right: -8rpx;
	bottom: -5rpx;
	width: 10rpx;
	height: 3rpx;
	background: #8da7a1;
	transform: rotate(45deg);
}

.home-search__placeholder {
	color: #9aaca7;
	font-size: 23rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.home-scan {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	flex-shrink: 0;
	width: 76rpx;
	height: 62rpx;
	border: 1rpx solid rgba(255, 255, 255, .74);
	border-radius: 32rpx;
	background: rgba(255, 255, 255, .86);
}

.home-scan__dot {
	width: 8rpx;
	height: 8rpx;
	border-radius: 50%;
	background: #2e6668;
}

.home-scan__ring {
	width: 22rpx;
	height: 22rpx;
	border: 3rpx solid #2e6668;
	border-radius: 50%;
}

.hero-shell {
	background: #6eb4b5;
}

.hero-swiper {
	height: 560rpx;
}

.poster-card {
	height: 560rpx;
	background: #6eb4b5;
}

.poster-image {
	opacity: .78;
	filter: saturate(.72) sepia(.1) hue-rotate(120deg);
}

.poster-card::after {
	content: '';
	position: absolute;
	inset: 0;
	background:
		linear-gradient(180deg, rgba(37, 116, 121, .28), transparent 34%, rgba(239, 244, 224, .78) 100%),
		linear-gradient(90deg, rgba(30, 107, 111, .18), transparent 65%);
	pointer-events: none;
}

.main-content {
	padding: 0 28rpx;
	margin-top: -18rpx;
}

.home-quick-entry {
	position: relative;
	grid-template-columns: repeat(5, minmax(0, 1fr));
	gap: 20rpx 8rpx;
	margin: 0 -4rpx;
	padding: 26rpx 10rpx 20rpx;
	background: rgba(255, 254, 247, .97);
	border-radius: 28rpx 28rpx 12rpx 12rpx;
	box-shadow: 0 -6rpx 20rpx rgba(44, 104, 101, .08);
}

.home-quick-entry__item {
	height: 114rpx;
	border: 0;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
}

.home-quick-entry__item:active {
	box-shadow: none;
	transform: translateY(2rpx);
}

.home-quick-entry__icon {
	width: 72rpx;
	height: 72rpx;
	margin-bottom: 2rpx;
	filter: saturate(.75) hue-rotate(115deg);
}

.home-quick-entry__text {
	margin-top: 2rpx;
	font-size: 21rpx;
	font-weight: 600;
	color: #315f5d !important;
}

.headline-card {
	margin-top: 18rpx;
	padding: 18rpx 22rpx;
	border: 1rpx solid #d7dfd1;
	border-radius: 14rpx;
	background: #fbfaf2;
	box-shadow: none;
}

.headline-card::before {
	width: 4rpx;
	background: #5faaa3;
}

.headline-label,
.headline-text {
	color: #4f7470;
}

.campus-ai-module {
	margin-top: 18rpx;
}

.campus-ai-fold-card,
.campus-ai-expand-card {
	border: 1rpx solid #d7dfd1;
	border-radius: 18rpx;
	background: #fbfaf2;
	box-shadow: 0 10rpx 20rpx rgba(48, 91, 86, .08);
}

.campus-ai-fold-card::before {
	background: linear-gradient(90deg, rgba(174, 215, 202, .42), rgba(239, 231, 190, .3));
}

.campus-ai-mark {
	border-radius: 50%;
	background: #d5ebe2;
}

.campus-ai-mark__spark {
	color: #418f89;
}

.campus-ai-title,
.campus-ai-question {
	color: #285657;
}

.campus-ai-subtitle,
.campus-ai-recent-desc {
	color: #77918a;
}

/* 完整变种布局：旧结构保留以便回退，但不参与当前首页渲染 */
.hero-shell,
.main-content {
	display: none;
}

.redesign-shell {
	min-height: 100vh;
	background: #f3f0e5;
	padding-bottom: 32rpx;
}

.redesign-hero {
	position: relative;
	height: 566rpx;
	overflow: hidden;
	background: linear-gradient(180deg, #3e979b 0%, #72b5b0 58%, #d9e6d0 100%);
}

.redesign-hero::before {
	content: '';
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(116deg, transparent 0 42rpx, rgba(255, 255, 255, .06) 43rpx 45rpx, transparent 46rpx 78rpx);
	opacity: .65;
}

.redesign-hero__sun {
	position: absolute;
	top: 150rpx;
	right: 84rpx;
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	background: #efc978;
	box-shadow: 0 0 0 16rpx rgba(239, 201, 120, .12), 0 0 60rpx rgba(255, 226, 151, .42);
}

.redesign-hero__mist {
	position: absolute;
	border-radius: 50%;
	background: rgba(240, 247, 224, .45);
	filter: blur(2rpx);
}

.redesign-hero__mist--one {
	left: -80rpx;
	bottom: 136rpx;
	width: 620rpx;
	height: 130rpx;
}

.redesign-hero__mist--two {
	right: -180rpx;
	bottom: 100rpx;
	width: 700rpx;
	height: 154rpx;
}

.redesign-hero__ridge {
	position: absolute;
	bottom: 42rpx;
	width: 820rpx;
	height: 300rpx;
	border-radius: 48% 52% 0 0;
	transform: rotate(-7deg);
}

.redesign-hero__ridge--back {
	left: -220rpx;
	background: #5e9c9b;
	box-shadow: 260rpx 42rpx 0 #669f9b, 520rpx 4rpx 0 #579391;
}

.redesign-hero__ridge--front {
	right: -310rpx;
	bottom: -26rpx;
	background: #327b7f;
	box-shadow: -300rpx 56rpx 0 #438b88;
	opacity: .9;
}

.redesign-hero__copy {
	position: absolute;
	top: 246rpx;
	left: 48rpx;
	z-index: 2;
	display: flex;
	flex-direction: column;
	color: #f7f3df;
	text-shadow: 0 3rpx 8rpx rgba(32, 93, 94, .2);
}

.redesign-hero__eyebrow {
	font-size: 23rpx;
	letter-spacing: 8rpx;
	opacity: .9;
}

.redesign-hero__title {
	margin-top: 18rpx;
	font-family: serif;
	font-size: 48rpx;
	font-weight: 700;
	letter-spacing: 5rpx;
}

.redesign-hero__desc {
	margin-top: 12rpx;
	font-size: 24rpx;
	letter-spacing: 2rpx;
	opacity: .86;
}

.redesign-hero__seal {
	position: absolute;
	right: 48rpx;
	top: 290rpx;
	z-index: 3;
	width: 72rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 4rpx solid rgba(189, 72, 57, .8);
	color: rgba(189, 72, 57, .9);
	font-family: serif;
	font-size: 24rpx;
	transform: rotate(-8deg);
}

.redesign-content {
	position: relative;
	z-index: 4;
	margin: -28rpx 24rpx 0;
	padding: 32rpx 24rpx 40rpx;
	border-radius: 32rpx 32rpx 0 0;
	background: #f8f6ec;
	box-shadow: 0 -12rpx 26rpx rgba(40, 91, 88, .1);
}

.redesign-section-head,
.redesign-schedule-head {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}

.redesign-section-head {
	margin-bottom: 22rpx;
}

.redesign-section-head > view:first-child {
	display: flex;
	flex-direction: column;
}

.redesign-section-kicker {
	color: #8d9f91;
	font-size: 20rpx;
	letter-spacing: 4rpx;
}

.redesign-section-title {
	margin-top: 8rpx;
	color: #285c5d;
	font-family: serif;
	font-size: 38rpx;
	font-weight: 700;
	letter-spacing: 3rpx;
}

.redesign-brush-mark {
	width: 74rpx;
	height: 14rpx;
	margin-bottom: 12rpx;
	border-top: 4rpx solid #a8c6b4;
	border-bottom: 2rpx solid #d5ad70;
	transform: rotate(-6deg);
}

.redesign-entry-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 16rpx;
}

.redesign-entry {
	position: relative;
	min-height: 176rpx;
	padding: 24rpx 22rpx;
	border-radius: 20rpx;
	overflow: hidden;
	box-sizing: border-box;
	box-shadow: 0 8rpx 16rpx rgba(77, 99, 78, .08);
	transition: transform .16s ease;
}

.redesign-entry:active,
.redesign-notice:active,
.redesign-ai:active {
	transform: translateY(3rpx);
}

.redesign-entry--wide {
	grid-column: 1 / -1;
	min-height: 188rpx;
	background: #d9ebe2;
}

.redesign-entry--food { background: #efe2c4; }
.redesign-entry--activity { background: #dcebdc; }
.redesign-entry--forum { background: #e8dfc9; }
.redesign-entry--promotion { background: #e9e4c9; }

.redesign-entry__copy {
	position: relative;
	z-index: 2;
}

.redesign-entry__label {
	display: block;
	color: #295c5c;
	font-family: serif;
	font-size: 31rpx;
	font-weight: 700;
	letter-spacing: 2rpx;
}

.redesign-entry__desc {
	display: block;
	margin-top: 12rpx;
	color: #6d8980;
	font-size: 20rpx;
}

.redesign-entry__fan,
.redesign-entry__dish,
.redesign-entry__leaf,
.redesign-entry__ink {
	position: absolute;
	right: -16rpx;
	bottom: -28rpx;
	width: 210rpx;
	height: 132rpx;
	border-radius: 50% 50% 8% 50%;
	transform: rotate(-18deg);
	opacity: .58;
}

.redesign-entry__fan {
	background: repeating-conic-gradient(from 12deg, #b5d8cd 0 10deg, #f5f1df 11deg 21deg);
	border: 6rpx solid #76a8a0;
}

.redesign-entry__dish {
	background: radial-gradient(ellipse at center, #e7c17b 0 28%, #b57950 29% 37%, #f2e6c9 38% 60%, #a4c7ae 61%);
}

.redesign-entry__leaf {
	background: #8ab9a0;
	box-shadow: -38rpx 22rpx 0 #b6d1a5, -72rpx 4rpx 0 #6eaa96;
}

.redesign-entry__ink {
	right: -54rpx;
	background: #9b9480;
	box-shadow: -80rpx -12rpx 0 #bab19a;
}

.redesign-entry__coin {
	position: absolute;
	right: 28rpx;
	bottom: 20rpx;
	width: 70rpx;
	height: 70rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 5rpx solid #b7b083;
	border-radius: 50%;
	color: #9e956c;
	font-family: serif;
	font-size: 28rpx;
	opacity: .7;
}

.redesign-notice {
	display: flex;
	align-items: center;
	margin-top: 20rpx;
	padding: 18rpx 20rpx;
	border-top: 1rpx solid #d9dfcf;
	border-bottom: 1rpx solid #d9dfcf;
	transition: transform .16s ease;
}

.redesign-notice__stamp,
.redesign-ai__seal {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	border: 2rpx solid #7da99e;
	color: #4f837b;
	font-family: serif;
}

.redesign-notice__stamp {
	width: 54rpx;
	height: 54rpx;
	font-size: 24rpx;
	transform: rotate(-8deg);
}

.redesign-notice__copy {
	min-width: 0;
	flex: 1;
	margin-left: 18rpx;
	display: flex;
	flex-direction: column;
}

.redesign-notice__label {
	color: #78948b;
	font-size: 19rpx;
}

.redesign-notice__text {
	margin-top: 6rpx;
	color: #315f5e;
	font-size: 23rpx;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.redesign-arrow {
	color: #769b92;
	font-size: 30rpx;
}

.redesign-ai {
	display: flex;
	align-items: center;
	margin-top: 22rpx;
	padding: 24rpx;
	border-radius: 18rpx;
	background: #315f60;
	box-shadow: 0 12rpx 22rpx rgba(34, 84, 81, .16);
	transition: transform .16s ease;
}

.redesign-ai__seal {
	width: 70rpx;
	height: 70rpx;
	border-color: #b7d2bd;
	color: #e4e7c8;
	font-size: 23rpx;
}

.redesign-ai__copy {
	flex: 1;
	margin-left: 18rpx;
	display: flex;
	flex-direction: column;
}

.redesign-ai__title {
	color: #f5f1dc;
	font-family: serif;
	font-size: 32rpx;
	font-weight: 700;
	letter-spacing: 3rpx;
}

.redesign-ai__desc {
	margin-top: 6rpx;
	color: #b9d0c0;
	font-size: 20rpx;
}

.redesign-ai__action {
	padding: 10rpx 18rpx;
	border: 1rpx solid rgba(228, 231, 200, .6);
	border-radius: 999rpx;
	color: #e4e7c8;
	font-size: 20rpx;
}

.redesign-ai-panel {
	margin-top: 12rpx;
	padding: 22rpx;
	border: 1rpx solid #cbdccf;
	border-radius: 18rpx;
	background: #edf3e8;
}

.redesign-ai-panel__head {
	display: flex;
	justify-content: space-between;
	color: #315f60;
	font-family: serif;
	font-size: 27rpx;
	font-weight: 700;
}

.redesign-ai-panel__close {
	font-family: sans-serif;
	font-size: 36rpx;
	font-weight: 400;
}

.redesign-ai-panel__actions {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12rpx;
	margin-top: 16rpx;
}

.redesign-ai-panel__actions > view {
	display: flex;
	flex-direction: column;
	padding: 18rpx;
	border-radius: 14rpx;
	background: #f8f6ec;
}

.redesign-ai-panel__actions text:first-child {
	color: #315f60;
	font-size: 24rpx;
	font-weight: 700;
}

.redesign-ai-panel__actions text:last-child {
	margin-top: 6rpx;
	color: #80988d;
	font-size: 18rpx;
}

.redesign-schedule-head {
	margin: 30rpx 2rpx 14rpx;
	color: #315f60;
	font-family: serif;
	font-size: 30rpx;
	font-weight: 700;
}

.redesign-schedule-more {
	color: #78958a;
	font-family: sans-serif;
	font-size: 20rpx;
	font-weight: 400;
}

/* 参考图构图：顶部青黛画框、宣纸留白、山水边饰与金线细节 */
.redesign-shell {
	background: #f1f0e9;
	padding: 18rpx 16rpx 34rpx;
}

.redesign-hero {
	height: 610rpx;
	border: 2rpx solid #cdbb8e;
	border-radius: 22rpx 22rpx 0 0;
	background: #f8f7f0;
	box-shadow: inset 0 0 0 8rpx rgba(205, 187, 142, .12);
}

.redesign-hero__image {
	position: absolute;
	inset: 18rpx;
	z-index: 0;
	width: calc(100% - 36rpx);
	height: calc(100% - 36rpx);
	opacity: .9;
	filter: saturate(.72) contrast(.96) sepia(.08);
}

.redesign-hero::before {
	content: '';
	position: absolute;
	inset: 18rpx;
	border: 2rpx solid rgba(215, 195, 147, .9);
	border-radius: 18rpx;
	background:
		linear-gradient(180deg, #1f5864 0, #2e7781 112rpx, transparent 113rpx),
		linear-gradient(180deg, transparent 64%, rgba(211, 231, 215, .24) 100%);
	opacity: 1;
}

.redesign-hero::after {
	content: '';
	position: absolute;
	left: 20rpx;
	right: 20rpx;
	bottom: 0;
	height: 220rpx;
	background:
		linear-gradient(145deg, transparent 0 35%, rgba(108, 173, 168, .3) 36% 46%, transparent 47%) left bottom / 70% 100% no-repeat,
		linear-gradient(35deg, transparent 0 38%, rgba(89, 157, 157, .26) 39% 49%, transparent 50%) right bottom / 72% 100% no-repeat;
	clip-path: polygon(0 100%, 0 70%, 8% 56%, 14% 72%, 23% 43%, 31% 68%, 42% 54%, 50% 76%, 60% 48%, 69% 68%, 80% 40%, 89% 63%, 100% 49%, 100% 100%);
	opacity: .9;
}

.redesign-hero__sun {
	top: 164rpx;
	right: 86rpx;
	width: 64rpx;
	height: 64rpx;
	background: #dfbd78;
	box-shadow: none;
	opacity: .82;
}

.redesign-hero__mist {
	z-index: 1;
	background: rgba(255, 255, 255, .72);
	filter: blur(5rpx);
}

.redesign-hero__mist--one {
	left: 10rpx;
	bottom: 120rpx;
	width: 400rpx;
	height: 72rpx;
}

.redesign-hero__mist--two {
	right: -20rpx;
	bottom: 146rpx;
	width: 470rpx;
	height: 70rpx;
}

.redesign-hero__ridge {
	z-index: 2;
	bottom: 22rpx;
	height: 158rpx;
	border-radius: 50% 50% 0 0;
	opacity: .76;
}

.redesign-hero__ridge--back {
	left: -140rpx;
	background: #a5cdc4;
	box-shadow: 240rpx 28rpx 0 #b4d5c9, 500rpx 0 0 #9bc7c1;
}

.redesign-hero__ridge--front {
	right: -240rpx;
	bottom: -8rpx;
	background: #5c9b9b;
	box-shadow: -260rpx 20rpx 0 #78ada7;
}

.redesign-hero__copy {
	top: 438rpx;
	left: 50%;
	z-index: 4;
	align-items: center;
	transform: translateX(-50%);
	color: #f7e9bd;
	text-shadow: none;
	white-space: nowrap;
}

.redesign-hero__eyebrow {
	font-size: 18rpx;
	letter-spacing: 8rpx;
	opacity: .86;
}

.redesign-hero__title {
	margin-top: 16rpx;
	font-size: 40rpx;
	letter-spacing: 8rpx;
	text-shadow: 0 2rpx 8rpx rgba(41, 92, 92, .3);
}

.redesign-hero__desc {
	margin-top: 10rpx;
	font-size: 19rpx;
	letter-spacing: 3rpx;
	color: #f4e5b9;
	opacity: .9;
}

.redesign-hero__seal {
	top: 234rpx;
	right: 40rpx;
	z-index: 5;
	width: 58rpx;
	height: 58rpx;
	border-width: 3rpx;
	font-size: 19rpx;
}

.redesign-content {
	margin: -1rpx 0 0;
	padding: 38rpx 28rpx 42rpx;
	border: 1rpx solid #d9d3bf;
	border-top: 0;
	border-radius: 0 0 22rpx 22rpx;
	background:
		linear-gradient(90deg, transparent 0 13%, rgba(216, 196, 148, .18) 13.1% 13.3%, transparent 13.4% 86.6%, rgba(216, 196, 148, .18) 86.7% 86.9%, transparent 87%),
		#fbfaf5;
	box-shadow: none;
}

.redesign-section-head {
	justify-content: center;
	text-align: center;
}

.redesign-section-head > view:first-child {
	align-items: center;
}

.redesign-section-kicker {
	color: #9d8964;
	font-size: 18rpx;
	letter-spacing: 7rpx;
}

.redesign-section-title {
	margin-top: 10rpx;
	color: #245d64;
	font-size: 34rpx;
	letter-spacing: 5rpx;
}

.redesign-brush-mark {
	position: absolute;
	left: 38rpx;
	width: 60rpx;
	border-color: #c9a86e;
}

.redesign-entry-grid {
	gap: 18rpx 14rpx;
}

.redesign-entry {
	min-height: 152rpx;
	border: 1rpx solid rgba(194, 181, 145, .54);
	border-radius: 8rpx;
	box-shadow: none;
}

.redesign-entry--wide {
	min-height: 164rpx;
	border-color: #9cc7bd;
	background: linear-gradient(100deg, #e4f0e8, #f3f0df);
}

.redesign-entry__image {
	position: absolute;
	inset: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	opacity: .82;
	filter: saturate(.68) sepia(.08) contrast(.96);
}

.redesign-entry--wide::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
	background: linear-gradient(90deg, rgba(227, 241, 232, .96) 0%, rgba(227, 241, 232, .62) 48%, rgba(255, 249, 227, .08) 100%);
}

.redesign-entry:not(.redesign-entry--wide)::after {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
	background: linear-gradient(90deg, rgba(250, 247, 232, .9), rgba(250, 247, 232, .42));
}

.redesign-entry--activity::after {
	background: linear-gradient(90deg, rgba(255, 243, 211, .84), rgba(255, 218, 170, .28));
}

.redesign-entry--forum::after {
	background: linear-gradient(90deg, rgba(236, 239, 229, .92), rgba(197, 219, 208, .38));
}

.redesign-entry > .redesign-entry__label,
.redesign-entry > .redesign-entry__desc,
.redesign-entry > .redesign-entry__coin {
	position: relative;
	z-index: 2;
}

.redesign-entry--food { background: #f1e8d2; }
.redesign-entry--activity { background: #e8f0e4; }
.redesign-entry--forum { background: #eee8d6; }
.redesign-entry--promotion { background: #f0ecd5; }

.redesign-entry__label {
	font-size: 27rpx;
	letter-spacing: 3rpx;
}

.redesign-entry__desc {
	color: #7a9188;
	font-size: 18rpx;
}

.redesign-entry__fan,
.redesign-entry__dish,
.redesign-entry__leaf,
.redesign-entry__ink {
	display: none;
}

.redesign-notice {
	margin-top: 28rpx;
	border-top: 1rpx solid #ddcfad;
	border-bottom: 1rpx solid #ddcfad;
}

.redesign-notice__stamp {
	border-color: #c39d69;
	color: #a9784e;
}

.redesign-notice__label {
	color: #aa8b61;
}

.redesign-notice__text {
	color: #35656a;
}

.redesign-ai {
	border-radius: 8rpx;
	background: #285f68;
	box-shadow: none;
}

.redesign-ai {
	position: relative;
	overflow: hidden;
}

.redesign-ai::before {
	content: '';
	position: absolute;
	inset: 0;
	z-index: 1;
	background: linear-gradient(90deg, rgba(33, 78, 84, .95), rgba(33, 78, 84, .72));
}

.redesign-ai__image {
	position: absolute;
	inset: 0;
	z-index: 0;
	width: 100%;
	height: 100%;
	opacity: .7;
	filter: saturate(.7) sepia(.08);
}

.redesign-ai__seal,
.redesign-ai__copy,
.redesign-ai__action {
	position: relative;
	z-index: 2;
}

.redesign-ai__seal {
	border-color: #d5bd82;
	color: #e9d49e;
}

.redesign-ai__title {
	letter-spacing: 5rpx;
}

.redesign-schedule-head {
	margin-top: 36rpx;
	color: #35656a;
}

.redesign-content {
	background-image:
		linear-gradient(180deg, rgba(251, 250, 245, .9) 0 68%, rgba(251, 250, 245, .76)),
		url('/static/index/landscape-mist-mountains.png');
	background-repeat: no-repeat;
	background-position: center bottom;
	background-size: 100% auto;
}

.redesign-notice {
	background-image: linear-gradient(90deg, rgba(251, 250, 245, .96), rgba(251, 250, 245, .72)), url('/static/index/landscape-lake.png');
	background-position: center right;
	background-size: cover;
}

/* 公告：改为横向古卷题签 */
.redesign-scroll-card {
	position: relative;
	margin: 30rpx 10rpx 0;
	padding: 22rpx 28rpx;
	min-height: 112rpx;
	border: 1rpx solid #c7a66b;
	border-left: 0;
	border-right: 0;
	border-radius: 0;
	background-image: linear-gradient(90deg, rgba(249, 244, 224, .94), rgba(249, 244, 224, .68)), url('/static/index/landscape-lake.png');
	background-position: center;
	background-size: cover;
	box-shadow: none;
}

.redesign-scroll-card::before,
.redesign-scroll-card::after {
	content: '';
	position: absolute;
	top: 16rpx;
	bottom: 16rpx;
	width: 12rpx;
	border: 2rpx solid #c7a66b;
	background: #e9d9af;
}

.redesign-scroll-card::before {
	left: -8rpx;
	border-radius: 50% 0 0 50%;
}

.redesign-scroll-card::after {
	right: -8rpx;
	border-radius: 0 50% 50% 0;
}

.redesign-scroll-card .redesign-notice__stamp {
	width: 60rpx;
	height: 60rpx;
	border: 2rpx solid #b38752;
	background: rgba(250, 242, 215, .74);
	font-family: serif;
	transform: rotate(-7deg);
}

.redesign-scroll-card .redesign-notice__label {
	color: #a87845;
	font-family: serif;
	font-size: 22rpx;
	letter-spacing: 3rpx;
}

.redesign-scroll-card .redesign-notice__text {
	color: #315f64;
	font-family: serif;
	font-size: 27rpx;
}

.redesign-scroll-card .redesign-arrow {
	color: #a87948;
	font-family: serif;
	font-size: 34rpx;
}

/* 校园智囊：改为墨色山水题签卡 */
.redesign-ink-card {
	min-height: 154rpx;
	margin-top: 26rpx;
	border: 2rpx solid #b89b63;
	border-radius: 6rpx;
	background: #2d5e64;
	box-shadow: 0 10rpx 20rpx rgba(40, 76, 76, .12);
}

.redesign-ink-card::after {
	content: '';
	position: absolute;
	inset: 10rpx;
	z-index: 2;
	border: 1rpx solid rgba(224, 198, 137, .48);
	pointer-events: none;
}

.redesign-ink-card .redesign-ai__seal {
	width: 78rpx;
	height: 78rpx;
	margin-left: 4rpx;
	border: 2rpx solid #d1b270;
	background: rgba(35, 77, 82, .64);
	font-family: serif;
	font-size: 27rpx;
}

.redesign-ink-card .redesign-ai__title {
	font-family: serif;
	font-size: 32rpx;
	letter-spacing: 5rpx;
	color: #f2e5bd;
}

.redesign-ink-card .redesign-ai__desc {
	font-family: serif;
	font-size: 22rpx;
	color: #c9d4bf;
}

.redesign-ink-card .redesign-ai__action {
	margin-right: 18rpx;
	width: 92rpx;
	height: 62rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: 1rpx solid #d0b678;
	border-radius: 0 !important;
	color: #f2e5bd;
	font-family: serif;
	font-size: 23rpx;
}

.redesign-schedule-head {
	padding: 20rpx 18rpx 18rpx;
	border-top: 1rpx solid rgba(194, 181, 145, .46);
	background-image: linear-gradient(90deg, rgba(251, 250, 245, .96), rgba(251, 250, 245, .78)), url('/static/index/landscape-blue-lake.png');
	background-position: center;
	background-size: cover;
}

/* 校园见闻与校园智囊使用同一张古风信息卡片，保持首页视觉完全统一 */
.redesign-scroll-card,
.redesign-ink-card {
	position: relative;
	display: flex;
	align-items: center;
	box-sizing: border-box;
	min-height: 154rpx;
	margin: 26rpx 10rpx 0;
	padding: 22rpx 28rpx;
	border: 2rpx solid #b89b63;
	border-radius: 6rpx;
	background-image: linear-gradient(90deg, rgba(249, 244, 224, .94), rgba(249, 244, 224, .72)), url('/static/index/landscape-lake.png') !important;
	background-position: center;
	background-size: cover;
	box-shadow: none;
	overflow: hidden;
}

.redesign-scroll-card::before,
.redesign-scroll-card::after,
.redesign-ink-card::after {
	content: '';
	position: absolute;
	inset: 10rpx;
	z-index: 0;
	border: 1rpx solid rgba(199, 166, 107, .65);
	background: none;
	border-radius: 0;
	pointer-events: none;
}

/* 校园智囊恢复为与校园见闻一致的古卷卡片，并保留左侧题签装饰 */
.redesign-ink-card::before {
	content: '';
	position: absolute;
	left: 14rpx;
	top: 16rpx;
	bottom: 16rpx;
	width: 10rpx;
	z-index: 1;
	border: 1rpx solid rgba(181, 138, 83, .78);
	background: rgba(249, 244, 224, .52);
	pointer-events: none;
}

/* 校园智囊使用书阁案台图，叠加米色薄雾保证标题和按钮清晰 */
.redesign-ink-card {
	background-image: linear-gradient(90deg, rgba(249, 244, 224, .78), rgba(249, 244, 224, .58)), url('/static/index/campus-wisdom-library.png') !important;
	background-position: center 42%;
	background-size: cover;
}

.redesign-scroll-card > *,
.redesign-ink-card > * {
	position: relative;
	z-index: 2;
}

.redesign-ink-card .redesign-ai__image {
	display: none;
}

.redesign-scroll-card .redesign-notice__stamp,
.redesign-ink-card .redesign-ai__seal {
	flex: 0 0 60rpx;
	width: 60rpx;
	height: 60rpx;
	margin: 0;
	box-sizing: border-box;
	border: 2rpx solid #b38752;
	border-radius: 0;
	background: rgba(250, 242, 215, .74);
	color: #a87845;
	font-family: serif;
	font-size: 24rpx;
}

.redesign-scroll-card .redesign-notice__copy,
.redesign-ink-card .redesign-ai__copy {
	flex: 1;
	min-width: 0;
	margin-left: 18rpx;
}

.redesign-scroll-card .redesign-notice__label,
.redesign-ink-card .redesign-ai__title {
	color: #315e62 !important;
	font-family: serif !important;
	font-size: 27rpx !important;
	font-weight: 400;
	letter-spacing: 3rpx;
	line-height: 1.3;
}

.redesign-scroll-card .redesign-notice__text,
.redesign-ink-card .redesign-ai__desc {
	margin-top: 6rpx;
	color: #78918a !important;
	font-family: serif !important;
	font-size: 22rpx !important;
	letter-spacing: 0;
	line-height: 1.35;
}

.redesign-scroll-card .redesign-arrow {
	flex: 0 0 92rpx;
	width: 92rpx !important;
	height: 62rpx !important;
	margin: 0 0 0 12rpx !important;
	padding: 0 !important;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 1rpx solid #b58a53 !important;
	border-radius: 0 !important;
	background: rgba(249, 244, 224, .65) !important;
	color: #a87948 !important;
	font-family: serif !important;
	font-size: 23rpx !important;
}

</style>
