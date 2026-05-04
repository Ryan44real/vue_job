<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Clock, Bell, CircleClose, CircleCheck } from '@element-plus/icons-vue'
import { getMyReservationQueueService } from '@/api/reservation'
import { getCreditInfo } from '@/types/reservation'
import { useUserInfoStore } from '@/stores/user'
import type { ReservationRecord } from '@/types/reservation'
import AppLoadingState from '@/components/common/AppLoadingState.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'

defineOptions({ name: 'ReservationListView' })

const userInfoStore = useUserInfoStore()
const records = ref<ReservationRecord[]>([])
const loading = ref(true)

const creditInfo = getCreditInfo((userInfoStore.info as any).creditScore ?? 100)

const statusMap: Record<number, { text: string; type: '' | 'success' | 'warning' | 'info' | 'danger' }> = {
  1: { text: '排队中', type: 'warning' },
  2: { text: '已通知', type: 'success' },
  3: { text: '已失效', type: 'info' },
  4: { text: '已取消', type: 'info' },
}

const statusIcon: Record<number, any> = {
  1: Clock,
  2: Bell,
  3: CircleClose,
  4: CircleCheck,
}

onMounted(async () => {
  try {
    const res = await getMyReservationQueueService()
    records.value = res.data || []
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="reservation-page">
    <div class="page-header">
      <h2>我的预约</h2>
      <p class="page-sub">当前信用分：<strong>{{ creditInfo.score }}</strong>（{{ creditInfo.tier }} · 可借 {{ creditInfo.borrowLimit }} 本）</p>
    </div>

    <AppLoadingState v-if="loading" />

    <AppEmptyState
      v-else-if="records.length === 0"
      description="暂无预约记录"
    />

    <div v-else class="reservation-list">
      <div
        v-for="r in records"
        :key="r.id"
        class="reservation-card"
      >
        <el-image :src="r.coverImg" :preview-src-list="[r.coverImg]" fit="cover" class="reservation-card__cover" />
        <div class="reservation-card__body">
          <div class="reservation-card__title">{{ r.bookName }}</div>
          <div class="reservation-card__meta">
            <span>预约时间：{{ r.reservationTime }}</span>
            <span v-if="r.notifyTime">通知时间：{{ r.notifyTime }}</span>
          </div>
        </div>
        <div class="reservation-card__status">
          <el-tag :type="statusMap[r.status]?.type ?? 'info'" size="small">
            <el-icon :size="14" style="margin-right:4px">
              <component :is="statusIcon[r.status]" />
            </el-icon>
            {{ statusMap[r.status]?.text ?? r.status }}
          </el-tag>
          <div v-if="r.status === 1" class="queue-badge">
            <template v-if="r.queuePosition === 1">
              <span class="queue-first">你是下一个！请留意邮件通知</span>
            </template>
            <template v-else>
              排队第 <strong>{{ r.queuePosition }}</strong> 位
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reservation-page {
  padding: var(--space-4) 0;
}

.page-header {
  margin-bottom: var(--space-6);
}

.page-header h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin: 0 0 4px;
}

.page-sub {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  margin: 0;
}

.reservation-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.reservation-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
}

.reservation-card__cover {
  width: 56px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.reservation-card__body {
  flex: 1;
  min-width: 0;
}

.reservation-card__title {
  font-size: var(--text-base);
  font-weight: 600;
  margin-bottom: 4px;
}

.reservation-card__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.reservation-card__status {
  flex-shrink: 0;
  text-align: right;
}

.queue-badge {
  margin-top: 6px;
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.queue-first {
  display: inline-block;
  background: var(--color-accent-100);
  color: var(--color-accent-600);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  font-size: var(--text-xs);
}
</style>
