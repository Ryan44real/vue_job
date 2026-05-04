<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Medal, TrendCharts, Reading, Clock, Warning } from '@element-plus/icons-vue'
import { getMyDashboardService, getLeaderboardService } from '@/api/dashboard'
import { getCreditInfo } from '@/types/reservation'
import type { DashboardData, LeaderboardEntry } from '@/types/dashboard'
import AppLoadingState from '@/components/common/AppLoadingState.vue'

defineOptions({ name: 'DashboardView' })

const dashboard = ref<DashboardData | null>(null)
const leaderboard = ref<LeaderboardEntry[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [dashRes, lbRes] = await Promise.all([
      getMyDashboardService(),
      getLeaderboardService(),
    ])
    dashboard.value = dashRes.data
    leaderboard.value = lbRes.data || []
  } catch { /* */ }
  finally { loading.value = false }
})

const creditInfo = computed(() => {
  if (!dashboard.value) return null
  return getCreditInfo(dashboard.value.creditScore)
})
</script>

<template>
  <div class="dashboard-page">
    <AppLoadingState v-if="loading" />

    <template v-else-if="dashboard">
      <div class="page-header">
        <h2>阅读账单</h2>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <el-icon :size="24"><Reading /></el-icon>
          <div class="stat-num">{{ dashboard.totalBorrowed }}</div>
          <div class="stat-label">累计借阅</div>
        </div>
        <div class="stat-card">
          <el-icon :size="24"><Clock /></el-icon>
          <div class="stat-num">{{ dashboard.currentlyBorrowing }}</div>
          <div class="stat-label">当前在借</div>
        </div>
        <div class="stat-card">
          <el-icon :size="24"><Warning /></el-icon>
          <div class="stat-num">{{ dashboard.overdueCount }}</div>
          <div class="stat-label">逾期次数</div>
        </div>
        <div class="stat-card">
          <el-icon :size="24"><TrendCharts /></el-icon>
          <div class="stat-num">
            {{ dashboard.last30Days }}
            <span :class="dashboard.trend === 'UP' ? 'trend-up' : 'trend-down'" class="trend-badge">
              {{ dashboard.trend === 'UP' ? '↑' : '↓' }}
            </span>
          </div>
          <div class="stat-label">近30天借阅</div>
        </div>
      </div>

      <div v-if="creditInfo" class="credit-card">
        <span>信用评分 <strong>{{ dashboard.creditScore }}</strong> · {{ creditInfo.tier }}</span>
        <span>借阅额度 {{ creditInfo.borrowLimit }} 本</span>
      </div>

      <div v-if="dashboard.badges.length > 0" class="badges-section">
        <h3><el-icon :size="18"><Medal /></el-icon> 我的勋章</h3>
        <div class="badges-grid">
          <div v-for="b in dashboard.badges" :key="b.id" class="badge-card">
            <div class="badge-icon">🏅</div>
            <div class="badge-info">
              <div class="badge-name">{{ b.achievementName }}</div>
              <div class="badge-desc">{{ b.achievementDesc }}</div>
              <div class="badge-time">{{ b.achieveTime }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="leaderboard-section">
        <h3>月度阅读之星</h3>
        <div v-if="leaderboard.length === 0" class="text-muted">暂无排行数据</div>
        <div v-else class="lb-list">
          <div
            v-for="(entry, idx) in leaderboard"
            :key="entry.userId"
            class="lb-item"
            :class="{ 'lb-top': idx < 3 }"
          >
            <span class="lb-rank">{{ idx + 1 }}</span>
            <span class="lb-user">{{ entry.username }}</span>
            <span class="lb-count">{{ entry.borrowCount }} 本</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.page-header h2 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  margin: 0 0 var(--space-6);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.stat-card {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
}

.stat-card .el-icon { color: var(--color-primary-500); margin-bottom: var(--space-2); }

.stat-num {
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-1);
}

.trend-badge { font-size: var(--text-sm); margin-left: 4px; }
.trend-up { color: var(--color-success); }
.trend-down { color: var(--color-danger); }

.credit-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  margin-bottom: var(--space-6);
  background: var(--color-primary-50);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  color: var(--color-primary-700);
}

[data-theme="dark"] .credit-card {
  background: rgba(99, 102, 241, 0.12);
  color: var(--color-primary-300);
}

.badges-section h3,
.leaderboard-section h3 {
  font-size: var(--text-lg);
  font-weight: 600;
  margin: 0 0 var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.badge-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
}

.badge-icon { font-size: 2rem; flex-shrink: 0; }

.badge-name { font-weight: 600; font-size: var(--text-sm); }
.badge-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }
.badge-time { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 2px; }

.leaderboard-section { margin-bottom: var(--space-8); }

.lb-list {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.lb-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}

.lb-item:last-child { border-bottom: none; }
.lb-top .lb-rank { color: var(--color-accent-500); font-weight: 700; }

.lb-rank { width: 30px; font-weight: 600; color: var(--color-text-muted); }
.lb-user { flex: 1; }
.lb-count { color: var(--color-text-secondary); }

.text-muted { color: var(--color-text-muted); font-size: var(--text-sm); }

@media (max-width: 767px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
