<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getApplyRenewalListService, passApplyService, rejectApplyService } from '@/api/borrow'
import { getBorrowRecordInfoService } from '@/api/user'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import type { RenewalApply } from '@/types/borrow'

defineOptions({ name: 'RenewalManageView' })

const books = ref<RenewalApply[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const bookName = ref('')
const username = ref('')

const drawerVisible = ref(false)
const applyData = ref<RenewalApply & { borrowNum?: number; overdueNum?: number }>({} as any)

async function loadRecords() {
  const res = await getApplyRenewalListService({
    pageNum: pageNum.value, pageSize: pageSize.value,
    bookName: bookName.value || null,
    username: username.value || null,
    state: null,
  })
  books.value = res.data.items
  total.value = res.data.total
}

async function openReview(row: RenewalApply) {
  applyData.value = { ...row }
  const res = await getBorrowRecordInfoService(String(row.userId))
  applyData.value.borrowNum = res.data.borrowNum
  applyData.value.overdueNum = res.data.overdueNum
  drawerVisible.value = true
}

async function approve() {
  if (!applyData.value) return
  const res = await passApplyService({
    deadline: applyData.value.deadline || '',
    day: applyData.value.dayNum || applyData.value.day,
    borrowRecordId: applyData.value.borrowRecordId,
    id: applyData.value.id,
  })
  ElMessage.success(res.message || '已通过')
  drawerVisible.value = false
  loadRecords()
}

async function reject() {
  const res = await rejectApplyService(String(applyData.value.id))
  ElMessage.success(res.message || '已拒绝')
  drawerVisible.value = false
  loadRecords()
}

onMounted(loadRecords)
</script>

<template>
  <div>
    <AppPageHeader title="续借审批" />

    <el-form inline size="default" style="margin-bottom:16px">
      <el-form-item label="书名"><el-input v-model="bookName" clearable /></el-form-item>
      <el-form-item label="用户名"><el-input v-model="username" clearable /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadRecords">搜索</el-button>
        <el-button @click="bookName='';username='';loadRecords()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="books" stripe height="420">
      <el-table-column label="书名" prop="title" min-width="140" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }"><el-image :src="row.coverImg" style="width:48px;height:64px;border-radius:4px" fit="cover" /></template>
      </el-table-column>
      <el-table-column label="书号" prop="bookNum" width="100" />
      <el-table-column label="用户" prop="username" width="100" />
      <el-table-column label="续借天数" prop="dayNum" width="100" />
      <el-table-column label="借书日期" prop="borrowDate" width="110" />
      <el-table-column label="应还日期" prop="deadline" width="110" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" type="primary" v-if="row.applyState === 1" @click="openReview(row)">审批</el-button>
          <el-tag v-else-if="row.applyState === 2" type="success" size="small">已通过</el-tag>
          <el-tag v-else type="danger" size="small">已拒绝</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <AppPagination v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total" @size-change="loadRecords" @current-change="loadRecords" />

    <el-drawer v-model="drawerVisible" title="续借审批" size="500px">
      <el-form :model="applyData" label-width="100px">
        <el-form-item label="用户名"><el-input v-model="applyData.username" disabled /></el-form-item>
        <el-form-item label="借阅次数"><el-input :model-value="applyData.borrowNum" disabled /></el-form-item>
        <el-form-item label="逾期次数"><el-input :model-value="applyData.overdueNum" disabled /></el-form-item>
        <el-form-item label="续借书名"><el-input :model-value="applyData.bookName || applyData.title" disabled /></el-form-item>
        <el-form-item label="续借天数"><el-input :model-value="applyData.dayNum || applyData.day" disabled /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="approve">通过</el-button>
          <el-button type="warning" @click="reject">拒绝</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
