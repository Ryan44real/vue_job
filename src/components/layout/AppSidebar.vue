<script setup lang="ts">
import { House, Management, Promotion, UserFilled, User, Crop, Collection, Medal } from '@element-plus/icons-vue'
import { useResponsive } from '@/composables/useResponsive'

defineProps<{
  collapsed?: boolean
  isAdmin?: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-collapse'): void
}>()

const { isMobile } = useResponsive()
</script>

<template>
  <aside class="app-sidebar" :class="{ 'app-sidebar--collapsed': collapsed }">
    <div class="sidebar-logo">
      <img src="@/assets/logo.png" alt="Logo" />
      <span v-if="!collapsed" class="sidebar-brand">图书管理系统</span>
    </div>

    <el-menu
      :default-active="$route.path"
      background-color="transparent"
      text-color="var(--color-text-secondary)"
      active-text-color="var(--color-primary-600)"
      router
      :collapse="collapsed"
    >
      <el-menu-item index="/home">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="/search">
        <el-icon><Promotion /></el-icon>
        <span>馆藏检索</span>
      </el-menu-item>

      <el-sub-menu v-if="isAdmin" index="admin-sub">
        <template #title>
          <el-icon><Management /></el-icon>
          <span>管理</span>
        </template>
        <el-menu-item index="/admin/books"><span>图书管理</span></el-menu-item>
        <el-menu-item index="/admin/categories"><span>图书分类</span></el-menu-item>
        <el-menu-item index="/admin/borrows"><span>借阅管理</span></el-menu-item>
        <el-menu-item index="/admin/renewals"><span>续借审批</span></el-menu-item>
        <el-menu-item index="/admin/users"><span>用户管理</span></el-menu-item>
        <el-menu-item index="/admin/reservations"><span>预约管理</span></el-menu-item>
        <el-menu-item index="/admin/comments"><span>评论审核</span></el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="user-sub">
        <template #title>
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </template>
        <el-menu-item index="/user/borrowing">
          <el-icon><User /></el-icon>
          <span>当前借阅</span>
        </el-menu-item>
        <el-menu-item index="/user/history">
          <el-icon><Collection /></el-icon>
          <span>借阅历史</span>
        </el-menu-item>
        <el-menu-item index="/user/overdue"><span>逾期记录</span></el-menu-item>
        <el-menu-item index="/user/wishlist"><span>我的书单</span></el-menu-item>
        <el-menu-item index="/user/reservations"><span>我的预约</span></el-menu-item>
        <el-menu-item index="/user/dashboard">
          <el-icon><Medal /></el-icon>
          <span>阅读账单</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Crop /></el-icon>
          <span>设置</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>

<style scoped>
.app-sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: var(--color-bg-sidebar);
  border-right: 1px solid var(--color-border-default);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  z-index: 100;
  overflow-y: auto;
}

.app-sidebar--collapsed { width: 64px; }

.sidebar-logo {
  height: var(--navbar-height);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 0 var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
}

.sidebar-logo img { width: 36px; height: 36px; flex-shrink: 0; }

.sidebar-brand {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.app-sidebar :deep(.el-menu) { border-right: none; flex: 1; }

.app-sidebar :deep(.el-menu-item),
.app-sidebar :deep(.el-sub-menu__title) { font-size: var(--text-sm); }

@media (max-width: 767px) {
  .app-sidebar { transform: translateX(-100%); }
  .app-sidebar:not(.app-sidebar--collapsed) { transform: translateX(0); }
}
</style>
