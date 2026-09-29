<template>
  <view class="preview-page">
    <view class="phone-shell">
      <!-- #ifdef H5 -->
      <iframe class="student-frame" src="/#/pages/index/index" title="校辩智生学生端"></iframe>
      <!-- #endif -->
      <!-- #ifndef H5 -->
      <web-view src="/#/pages/index/index" />
      <!-- #endif -->
    </view>
    <text class="caption">手机版预览 · 学生端</text>
  </view>
</template>

<style lang="scss" scoped>
.preview-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  background: #eef1f5;
  box-sizing: border-box;
}

.phone-shell {
  width: min(414px, calc(100vw - 48px));
  height: min(896px, calc(100vh - 72px));
  overflow: hidden;
  background: #fff;
  border: 8px solid #1f2937;
  border-radius: 28px;
  box-shadow: 0 18px 50px rgba(15, 23, 42, .18);
}

.student-frame,
.phone-shell web-view {
  width: 100%;
  height: 100%;
  display: block;
  border: 0;
}

.caption {
  color: #7a8794;
  font-size: 13px;
}
</style>
