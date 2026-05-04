<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Clock, Warning, InfoFilled } from '@element-plus/icons-vue'

defineOptions({ name: 'NotificationView' })

interface Notification {
  id: number
  title: string
  content: string
  time: string
  type: 'warning' | 'info' | 'success'
  read: boolean
}

const notifications = ref<Notification[]>([
  { id: 1, title: '还书提醒', content: '《深入理解计算机系统》将于3天后到期，请及时归还', time: '2024-05-20 09:00', type: 'warning', read: false },
  { id: 2, title: '预约到馆', content: '您预约的《算法导论》已到馆，请于3日内到图书馆2楼服务台取书', time: '2024-05-19 14:30', type: 'success', read: false },
  { id: 3, title: '系统公告', content: '图书馆将于5月25日进行系统维护，届时借阅服务暂停一天', time: '2024-05-18 10:00', type: 'info', read: true },
])

function markRead(id: number) {
  const n = notifications.value.find(n => n.id === id)
  if (n) n.read = true
}
</script>

<template>
  <div class="notification-page">
    <h2 class="page-title">消息通知</h2>
    <div class="notification-list">
      <div
        v-for="n in notifications"
        :key="n.id"
        class="notification-item"
        :class="{ 'notification-item--unread': !n.read }"
        @click="markRead(n.id)"
      >
        <div class="notification-icon">
          <el-icon v-if="n.type === 'warning'" color="var(--color-warning)"><Warning /></el-icon>
          <el-icon v-else-if="n.type === 'success'" color="var(--color-success)"><Clock /></el-icon>
          <el-icon v-else color="var(--color-info)"><InfoFilled /></el-icon>
        </div>
        <div class="notification-body">
          <div class="notification-header">
            <h4>{{ n.title }}</h4>
            <span v-if="!n.read" class="unread-dot" />
          </div>
          <p>{{ n.content }}</p>
          <span class="notification-time">{{ n.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-page {
  max-width: 700px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.notification-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.notification-item:hover {
  border-color: var(--color-primary-300);
}

.notification-item--unread {
  border-left: 3px solid var(--color-primary-500);
  background: var(--color-bg-secondary);
}

.notification-icon {
  padding-top: 2px;
}

.notification-body {
  flex: 1;
}

.notification-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);

  h4 {
    font-size: var(--text-sm);
    font-weight: 600;
  }
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary-500);
}

.notification-body p {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: var(--space-1) 0;
}

.notification-time {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
