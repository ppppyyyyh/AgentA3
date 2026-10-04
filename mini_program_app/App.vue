<script>
	export default {
		globalData: {
			currentTab: 'index'  // 底部导航当前高亮：index | activity | message | mine
		},
		onLaunch: function() {
			console.log('App Launch')
			// H5 默认打开手机模型预览；iframe 内的真实首页使用明确的 index 路由，不会再次重定向。
			// #ifdef H5
			if (window.location.hash === '#' || window.location.hash === '#/') {
				setTimeout(() => uni.reLaunch({ url: '/pages/phoneFrame/phoneFrame' }), 0)
			}
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style src="./styles/ancient-theme.scss" lang="scss"></style>

<style>
	/* 工业级画布：全局 body/页面背景极浅灰 */
	page {
		background-color: #F7F7F9;
	}

	html,
	body,
	page,
	uni-page-body,
	.uni-page-body,
	uni-scroll-view,
	.uni-scroll-view,
	.uni-scroll-view-content {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}

	html::-webkit-scrollbar,
	body::-webkit-scrollbar,
	page::-webkit-scrollbar,
	uni-page-body::-webkit-scrollbar,
	.uni-page-body::-webkit-scrollbar,
	uni-scroll-view::-webkit-scrollbar,
	.uni-scroll-view-content::-webkit-scrollbar {
		width: 0;
		height: 0;
		display: none;
	}
</style>
