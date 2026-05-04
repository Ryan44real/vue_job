<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import { useResponsive } from '@/composables/useResponsive'
import AppSidebar from './AppSidebar.vue'
import AppNavbar from './AppNavbar.vue'
import AppFooter from './AppFooter.vue'

const route = useRoute()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const { isMobile } = useResponsive()

const sidebarCollapsed = ref(false)

const isLoggedIn = computed(() => !!tokenStore.token)
const isAdmin = computed(() => (userInfoStore.info as any).type === 1)

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const breadcrumbs = computed(() => {
  const items: { path: string; title: string }[] = []
  let fullPath = ''
  for (const m of route.matched) {
    fullPath += (fullPath.endsWith('/') ? '' : '/') + m.path
    fullPath = fullPath.replace(/\/+/g, '/')
    const title = (m.meta as any).title as string | undefined
    if (title && m.path !== '/') {
      items.push({ path: fullPath || '/', title })
    }
  }
  return items
})
</script>

<template>
  <div class="app-layout" :class="{ 'app-layout--admin': isAdmin, 'app-layout--mobile': isMobile }">
    <AppSidebar
      v-if="isLoggedIn"
      :collapsed="sidebarCollapsed"
      :is-admin="isAdmin"
      @toggle-collapse="toggleSidebar"
    />

    <div class="app-layout__main" :class="{ 'app-layout__main--with-sidebar': isLoggedIn }">
      <AppNavbar
        :show-hamburger="isLoggedIn && isMobile"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- Breadcrumb -->
      <nav v-if="breadcrumbs.length > 1" class="app-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            v-for="item in breadcrumbs"
            :key="item.path"
            :to="item.path !== String(route.path) ? { path: item.path } : undefined"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </nav>

      <main class="app-layout__content">
        <router-view v-slot="{ Component, route: r }">
          <transition name="page" mode="out-in" appear>
            <component :is="Component" :key="r.path" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="isLoggedIn && isMobile && !sidebarCollapsed"
      class="sidebar-overlay"
      @click="sidebarCollapsed = true"
    />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-layout__main--with-sidebar {
  margin-left: var(--sidebar-width);
}

.app-breadcrumb {
  padding: var(--space-3) var(--space-6) 0;
  font-size: var(--text-sm);
}

[data-theme="dark"] .app-breadcrumb :deep(.el-breadcrumb__inner) {
  color: var(--color-text-secondary);
}

[data-theme="dark"] .app-breadcrumb :deep(.el-breadcrumb__inner.is-link:hover) {
  color: var(--color-primary-300);
}

.app-layout__content {
  flex: 1;
  padding: var(--space-4) var(--space-6) var(--space-6);
  width: 100%;
}

@media (max-width: 767px) {
  .app-layout__main--with-sidebar {
    margin-left: 0;
  }

  .app-layout__content,
  .app-breadcrumb {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-bg-overlay);
  z-index: 99;
}
</style>
