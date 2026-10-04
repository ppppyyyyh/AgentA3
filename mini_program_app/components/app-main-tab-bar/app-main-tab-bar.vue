<template>
  <view class="ancient-tabbar">
    <view class="ancient-tabbar__paper">
      <view class="ancient-tabbar__ridge ancient-tabbar__ridge--left"></view>
      <view class="ancient-tabbar__ridge ancient-tabbar__ridge--right"></view>
      <view class="ancient-tabbar__rule"></view>
      <view class="ancient-tabbar__items">
        <view class="ancient-tab ancient-tab--side ancient-tab--home" @click="onTab('index')">
          <view class="ancient-tab__seal ancient-tab__seal--small">
            <image src="/static/icons/ancient-home.svg" mode="aspectFit" />
          </view>
          <text class="ancient-tab__label" :class="{ active: current === 'index' }">首页</text>
          <view v-if="current === 'index'" class="ancient-tab__mark"></view>
        </view>

        <view class="ancient-tab ancient-tab--main ancient-tab--map" @click="onTab('map')">
          <view class="ancient-tab__seal ancient-tab__seal--main">
            <view class="ancient-tab__halo"></view>
            <image src="/static/icons/ancient-scroll.svg" mode="aspectFit" />
          </view>
          <text class="ancient-tab__label" :class="{ active: current === 'map' }">校园地图</text>
          <view v-if="current === 'map'" class="ancient-tab__mark"></view>
        </view>

        <view class="ancient-tab ancient-tab--side ancient-tab--mine" @click="onTab('mine')">
          <view class="ancient-tab__seal ancient-tab__seal--small">
            <image src="/static/icons/ancient-scholar.svg" mode="aspectFit" />
          </view>
          <text class="ancient-tab__label" :class="{ active: current === 'mine' }">我的</text>
          <view v-if="current === 'mine'" class="ancient-tab__mark"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AppMainTabBar',
  props: {
    current: {
      type: String,
      default: 'index'
    }
  },
  methods: {
    onTab(type) {
      const routes = {
        index: '/pages/index/index',
        map: '/pages/map/map',
        mine: '/pages/mine/mine'
      };
      const url = routes[type];
      if (!url) return;
      const pages = getCurrentPages();
      const cur = pages[pages.length - 1];
      const curRoute = cur ? ('/' + cur.route) : '';
      if (curRoute === url) return;
      uni.redirectTo({
        url,
        animationType: 'none',
        animationDuration: 0,
        fail: () => uni.reLaunch({ url })
      });
    }
  }
};
</script>

<style lang="scss">
.ancient-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  height: calc(214rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  box-sizing: border-box;
  pointer-events: none;
}

.ancient-tabbar__paper {
  position: relative;
  width: 100%;
  height: 214rpx;
  overflow: hidden;
  pointer-events: auto;
  background:
    linear-gradient(180deg, rgba(245, 243, 229, .88), rgba(244, 239, 223, .98)),
    url('/static/index/landscape-mist-mountains.png') center 34% / cover no-repeat;
  border-top: 2rpx solid #c6a46a;
  box-shadow: 0 -14rpx 30rpx rgba(46, 84, 81, .12);
}

.ancient-tabbar__paper::before,
.ancient-tabbar__paper::after {
  content: '';
  position: absolute;
  top: 18rpx;
  width: 132rpx;
  height: 62rpx;
  border-top: 2rpx solid rgba(183, 151, 91, .48);
  border-radius: 50%;
  opacity: .85;
}

.ancient-tabbar__paper::before {
  left: -54rpx;
  transform: rotate(8deg);
}

.ancient-tabbar__paper::after {
  right: -54rpx;
  transform: rotate(-8deg);
}

.ancient-tabbar__ridge {
  position: absolute;
  bottom: 0;
  width: 360rpx;
  height: 72rpx;
  opacity: .28;
  background: #7aa7a0;
  clip-path: polygon(0 100%, 0 70%, 14% 52%, 25% 75%, 43% 30%, 56% 72%, 72% 44%, 86% 70%, 100% 38%, 100% 100%);
}

.ancient-tabbar__ridge--left { left: -80rpx; }
.ancient-tabbar__ridge--right { right: -80rpx; transform: scaleX(-1); }

.ancient-tabbar__rule {
  position: absolute;
  top: 78rpx;
  left: 50%;
  width: 78%;
  height: 1rpx;
  background: linear-gradient(90deg, transparent, rgba(180, 145, 81, .46), transparent);
  transform: translateX(-50%);
}

.ancient-tabbar__items {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding: 0 88rpx 16rpx;
  box-sizing: border-box;
}

.ancient-tab {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #5b706a;
}

.ancient-tab--side { width: 112rpx; }
.ancient-tab--main { width: 184rpx; margin-bottom: -4rpx; }

.ancient-tab__seal {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.ancient-tab__seal--small {
  width: 84rpx;
  height: 84rpx;
  filter: saturate(.55) sepia(.18) contrast(.96);
}

.ancient-tab__seal--small image {
  width: 84rpx;
  height: 84rpx;
}

.ancient-tab__seal--main {
  width: 174rpx;
  height: 174rpx;
  margin-top: -74rpx;
  filter: saturate(.7) sepia(.1) drop-shadow(0 12rpx 18rpx rgba(130, 106, 51, .25));
}

.ancient-tab__seal--main image {
  position: relative;
  z-index: 2;
  width: 174rpx;
  height: 174rpx;
}

.ancient-tab__halo {
  position: absolute;
  inset: -10rpx;
  border: 2rpx solid rgba(190, 150, 77, .36);
  border-radius: 50%;
  box-shadow: 0 0 0 10rpx rgba(246, 232, 176, .22), inset 0 0 14rpx rgba(207, 170, 95, .24);
}

.ancient-tab__label {
  margin-top: 2rpx;
  color: #5d6b65;
  font-family: serif;
  font-size: 28rpx;
  letter-spacing: 3rpx;
  line-height: 38rpx;
  white-space: nowrap;
}

.ancient-tab--main .ancient-tab__label { margin-top: -18rpx; }

.ancient-tab__label.active {
  color: #2d6d70;
  font-weight: 700;
}

.ancient-tab__mark {
  width: 34rpx;
  height: 4rpx;
  margin-top: 6rpx;
  border-radius: 50%;
  background: #bd955c;
}

/* 三个入口各自拥有不同的古风器物轮廓 */
.ancient-tab--home .ancient-tab__seal--small {
  border: 2rpx solid #b6955b;
  border-radius: 10rpx 10rpx 22rpx 22rpx;
  background: rgba(246, 235, 200, .5);
  box-shadow: inset 0 -8rpx 0 rgba(177, 143, 81, .16);
}

.ancient-tab--home .ancient-tab__seal--small::before {
  content: '';
  position: absolute;
  top: -15rpx;
  left: 8rpx;
  width: 64rpx;
  height: 28rpx;
  border: 2rpx solid #b6955b;
  border-bottom: 0;
  border-radius: 50% 50% 0 0;
  background: #ead9aa;
}

.ancient-tab--home .ancient-tab__seal--small image {
  width: 70rpx;
  height: 70rpx;
  opacity: .72;
}

.ancient-tab--map .ancient-tab__seal--main {
  border-radius: 16rpx;
  background: #e6d3a0;
  box-shadow: 0 10rpx 0 #c29f61, 0 14rpx 20rpx rgba(108, 84, 39, .2);
}

.ancient-tab--map .ancient-tab__seal--main::before,
.ancient-tab--map .ancient-tab__seal--main::after {
  content: '';
  position: absolute;
  top: 14rpx;
  bottom: 14rpx;
  width: 12rpx;
  border-radius: 50%;
  background: #c8a467;
  z-index: 3;
}

.ancient-tab--map .ancient-tab__seal--main::before { left: -8rpx; }
.ancient-tab--map .ancient-tab__seal--main::after { right: -8rpx; }

.ancient-tab--map .ancient-tab__halo {
  border-radius: 16rpx;
  border-color: rgba(183, 142, 73, .62);
  box-shadow: none;
}

.ancient-tab--map .ancient-tab__label {
  color: #356d6d;
}

.ancient-tab--mine .ancient-tab__seal--small {
  border: 2rpx solid #9d8359;
  border-radius: 44% 44% 18% 18%;
  background: rgba(237, 227, 193, .66);
}

.ancient-tab--mine .ancient-tab__seal--small::before {
  content: '';
  position: absolute;
  top: -10rpx;
  width: 48rpx;
  height: 18rpx;
  border-radius: 50% 50% 0 0;
  background: #607f77;
  border: 2rpx solid #4f6e68;
}

.ancient-tab--mine .ancient-tab__seal--small image {
  width: 70rpx;
  height: 70rpx;
  opacity: .7;
}

.ancient-tab--mine .ancient-tab__label {
  color: #586d68;
}

/* 底部导航重新设计：三等分、无悬浮大底板，和主页面保持同一套古风色板 */
.ancient-tabbar {
  height: calc(148rpx + env(safe-area-inset-bottom)) !important;
}

.ancient-tabbar__paper {
  height: 148rpx !important;
  background: rgba(249, 244, 224, .98) !important;
  border-top: 1rpx solid #c8ad78 !important;
  box-shadow: 0 -6rpx 18rpx rgba(73, 104, 96, .08) !important;
}

.ancient-tabbar__paper::before,
.ancient-tabbar__paper::after,
.ancient-tabbar__ridge,
.ancient-tabbar__rule,
.ancient-tab__halo,
.ancient-tab__mark,
.ancient-tab--home .ancient-tab__seal--small::before,
.ancient-tab--map .ancient-tab__seal--main::before,
.ancient-tab--map .ancient-tab__seal--main::after,
.ancient-tab--mine .ancient-tab__seal--small::before {
  display: none !important;
}

.ancient-tabbar__items {
  height: 148rpx !important;
  align-items: center !important;
  justify-content: space-around !important;
  padding: 12rpx 38rpx 10rpx !important;
}

.ancient-tab,
.ancient-tab--side,
.ancient-tab--main {
  width: 33.333% !important;
  height: 126rpx !important;
  margin: 0 !important;
  justify-content: center;
}

.ancient-tab__seal,
.ancient-tab__seal--small,
.ancient-tab__seal--main {
  width: 68rpx !important;
  height: 68rpx !important;
  margin: 0 0 4rpx !important;
  border: 1rpx solid rgba(181, 138, 83, .5) !important;
  border-radius: 50% !important;
  background: rgba(239, 232, 207, .72) !important;
  box-shadow: none !important;
  filter: saturate(.55) sepia(.12) !important;
}

.ancient-tab__seal image,
.ancient-tab__seal--small image,
.ancient-tab__seal--main image {
  width: 58rpx !important;
  height: 58rpx !important;
  opacity: .8 !important;
}

.ancient-tab__label,
.ancient-tab--main .ancient-tab__label,
.ancient-tab--map .ancient-tab__label,
.ancient-tab--mine .ancient-tab__label {
  margin: 0 !important;
  color: #66756e !important;
  font-family: serif !important;
  font-size: 25rpx !important;
  font-weight: 400 !important;
  letter-spacing: 2rpx !important;
  line-height: 34rpx !important;
}

.ancient-tab__label.active {
  color: #396f6c !important;
  font-weight: 700 !important;
}

/* 三个入口使用不同的古风器物：门楼、卷轴、古风小生 */
.ancient-tab--home .ancient-tab__seal--small {
  width: 70rpx !important;
  height: 62rpx !important;
  margin-top: 6rpx !important;
  border-radius: 8rpx 8rpx 16rpx 16rpx !important;
  background: rgba(240, 232, 207, .78) !important;
}

.ancient-tab--home .ancient-tab__seal--small::before {
  display: block !important;
  content: '';
  position: absolute;
  top: -20rpx;
  left: 7rpx;
  width: 54rpx;
  height: 38rpx;
  border: 1rpx solid #b58a53;
  border-bottom: 0;
  border-radius: 50% 50% 0 0;
  background: #e5d2a2;
  transform: perspective(30rpx) rotateX(8deg);
}

.ancient-tab--home .ancient-tab__seal--small::after {
  content: '';
  position: absolute;
  left: 32rpx;
  bottom: 0;
  width: 6rpx;
  height: 25rpx;
  border-left: 1rpx solid #b58a53;
  border-right: 1rpx solid #b58a53;
}

.ancient-tab--home .ancient-tab__seal--small image {
  display: block !important;
  width: 60rpx !important;
  height: 60rpx !important;
  z-index: 1;
}

.ancient-tab--map .ancient-tab__seal--main {
  width: 78rpx !important;
  height: 58rpx !important;
  margin-top: 6rpx !important;
  border: 1rpx solid #b58a53 !important;
  border-radius: 5rpx !important;
  background:
    linear-gradient(180deg, transparent 22%, rgba(181, 138, 83, .42) 23%, transparent 27%, transparent 72%, rgba(181, 138, 83, .42) 73%, transparent 77%),
    #f2e7c7 !important;
  overflow: visible !important;
}

.ancient-tab--map .ancient-tab__seal--main::before,
.ancient-tab--map .ancient-tab__seal--main::after {
  display: block !important;
  content: '';
  position: absolute;
  top: -5rpx;
  bottom: -5rpx;
  width: 12rpx;
  border: 1rpx solid #b58a53;
  border-radius: 50%;
  background: #e3cf9e;
  z-index: 3;
}

.ancient-tab--map .ancient-tab__seal--main::before { left: -8rpx; }
.ancient-tab--map .ancient-tab__seal--main::after { right: -8rpx; }

.ancient-tab--map .ancient-tab__seal--main image {
  display: block !important;
  width: 72rpx !important;
  height: 58rpx !important;
  opacity: 1 !important;
  z-index: 1;
}

.ancient-tab--mine .ancient-tab__seal--small {
  width: 64rpx !important;
  height: 68rpx !important;
  margin-top: 4rpx !important;
  border-radius: 48% 48% 36% 36% !important;
  background: rgba(235, 225, 195, .78) !important;
}

.ancient-tab--mine .ancient-tab__seal--small::before {
  display: block !important;
  content: '';
  position: absolute;
  top: -12rpx;
  left: 9rpx;
  width: 46rpx;
  height: 18rpx;
  border: 1rpx solid #56756d;
  border-radius: 50% 50% 4rpx 4rpx;
  background: #6f8d82;
  z-index: 2;
}

.ancient-tab--mine .ancient-tab__seal--small::after {
  content: '';
  position: absolute;
  left: 26rpx;
  bottom: 8rpx;
  width: 12rpx;
  height: 18rpx;
  border: 1rpx solid #b58a53;
  border-radius: 50%;
  background: #f2e7c7;
  z-index: 2;
}

.ancient-tab--mine .ancient-tab__seal--small image {
  display: block !important;
  width: 60rpx !important;
  height: 60rpx !important;
  opacity: 1 !important;
  z-index: 1;
}
</style>
