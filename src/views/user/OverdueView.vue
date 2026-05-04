<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { borrowRecordListService } from '@/api/borrow'
import { useUserInfoStore } from '@/stores/user'
import AppPagination from '@/components/common/AppPagination.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import type { BorrowRecord } from '@/types/borrow'

defineOptions({ name: 'OverdueView' })

const userInfoStore = useUserInfoStore()
const books = ref<BorrowRecord[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

async function loadRecords() {
  const res = await borrowRecordListService({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username: userInfoStore.info.username,
    state: '3',
    bookName: null,
  })
  books.value = res.data.items
  total.value = res.data.total
}

onMounted(loadRecords)
</script>

<template>
  <div>
    <el-alert
      v-if="books.length"
      title="您有逾期未还的图书，请尽快归还以避免影响借阅权限"
      type="error"
      :closable="false"
      show-icon
      style="margin-bottom: 16px;"
    />
    <el-table v-if="books.length" :data="books" stripe>
      <el-table-column label="书名" prop="bookName" min-width="160" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <el-image :src="row.imageName" style="width:48px;height:64px;border-radius:4px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="逾期天数" width="100">
        <template #default="{ row }">
          <span style="color: var(--color-danger); font-weight: 600;">{{ -row.lastDay }} 天</span>
        </template>
      </el-table-column>
      <el-table-column label="应还日期" prop="deadline" width="110" />
      <el-table-column label="借书日期" prop="borrowDate" width="110" />
    </el-table>
    <AppEmptyState v-else description="没有逾期记录" />
    <AppPagination v-if="total > 0" v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total"
      @size-change="loadRecords" @current-change="loadRecords" />
  </div>
</template>
