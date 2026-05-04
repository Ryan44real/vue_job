<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllReservationsService, getBookReservationQueueService } from '@/api/reservation'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoadingState from '@/components/common/AppLoadingState.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import type { ReservationRecord } from '@/types/reservation'

defineOptions({ name: 'ReservationManageView' })

const records = ref<ReservationRecord[]>([])
const loading = ref(true)
const bookNumFilter = ref('')

const statusMap: Record<number, string> = {
  1: '排队中',
  2: '已通知',
  3: '已失效',
  4: '已取消',
}

onMounted(loadAll)

async function loadAll() {
  loading.value = true
  try {
    const res = await getAllReservationsService()
    records.value = res.data || []
  } finally {
    loading.value = false
  }
}

async function searchByBook() {
  if (!bookNumFilter.value) { loadAll(); return }
  loading.value = true
  try {
    const res = await getBookReservationQueueService(Number(bookNumFilter.value))
    records.value = res.data || []
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <AppPageHeader title="预约记录管理" />

    <el-form inline size="default" style="margin-bottom:16px">
      <el-form-item label="书号">
        <el-input v-model="bookNumFilter" clearable placeholder="输入图书编号" style="width:160px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchByBook">搜索</el-button>
        <el-button @click="bookNumFilter='';loadAll()">全部</el-button>
      </el-form-item>
    </el-form>

    <AppLoadingState v-if="loading" />

    <AppEmptyState
      v-else-if="records.length === 0"
      description="暂无预约记录"
    />

    <el-table v-else :data="records" border stripe style="width:100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="bookName" label="图书" min-width="140" />
      <el-table-column prop="bookNum" label="书号" width="90" />
      <el-table-column prop="username" label="用户" width="100" />
      <el-table-column prop="queuePosition" label="排队位" width="80" align="center" />
      <el-table-column label="状态" width="90" align="center">
        <template #default="{ row }">
          <el-tag
            :type="row.status === 1 ? 'warning' : row.status === 2 ? 'success' : row.status === 3 ? 'danger' : 'info'"
            size="small"
          >
            {{ statusMap[row.status] ?? row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reservationTime" label="预约时间" width="160" />
      <el-table-column prop="notifyTime" label="通知时间" width="160">
        <template #default="{ row }">
          {{ row.notifyTime || '--' }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
