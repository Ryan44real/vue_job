<script setup lang="ts">
import { Sunny, Moon } from '@element-plus/icons-vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <el-tooltip :content="themeStore.isDark ? '切换浅色模式' : '切换深色模式'" placement="bottom">
    <el-button
      class="theme-toggle"
      :icon="themeStore.isDark ? Sunny : Moon"
      circle
      size="small"
      @click="themeStore.toggle()"
    />
  </el-tooltip>
</template>

<style scoped>
.theme-toggle {
  border: none;
  background: transparent;
  font-size: 18px;
  color: var(--color-text-secondary);
}

.theme-toggle:hover {
  color: var(--color-primary-500);
  background: var(--color-bg-secondary);
}
</style>
