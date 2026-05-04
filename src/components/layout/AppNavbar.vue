<script setup lang="ts">
import { Menu, Bell } from '@element-plus/icons-vue'
import AppThemeToggle from './AppThemeToggle.vue'
import AppUserDropdown from './AppUserDropdown.vue'

defineProps<{
  showHamburger?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <header class="app-navbar">
    <div class="navbar-left">
      <el-button
        v-if="showHamburger"
        :icon="Menu"
        class="hamburger-btn"
        @click="emit('toggle-sidebar')"
      />
      <slot name="left">
        <span class="navbar-title text-display">图书管理系统</span>
      </slot>
    </div>
    <div class="navbar-right">
      <slot name="center" />
      <AppThemeToggle />
      <el-badge :value="3" :hidden="true" class="notification-badge">
        <el-button class="icon-btn" circle size="small">
          <el-icon><Bell /></el-icon>
        </el-button>
      </el-badge>
      <AppUserDropdown />
    </div>
  </header>
</template>

<style scoped>
.app-navbar {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border-default);
  position: sticky;
  top: 0;
  z-index: 50;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.navbar-title {
  font-size: var(--text-lg);
  font-weight: 700;
}

.hamburger-btn {
  border: none;
  background: transparent;
}

.icon-btn {
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
}

.icon-btn:hover {
  color: var(--color-primary-500);
  background: var(--color-bg-secondary);
}
</style>
