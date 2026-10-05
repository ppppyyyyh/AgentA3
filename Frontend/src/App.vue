<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import GlobalAiAssistant from './views/AiAssistantView.vue'

const route = useRoute()
const showGlobalAssistant = computed(() => route.meta.public !== true)
</script>

<template>
  <RouterView />
  <GlobalAiAssistant v-if="showGlobalAssistant" />
</template>

