<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { borrowRecordListService, send } from '@/api/borrow'
import { urge } from '@/api/user'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import type { BorrowRecord } from '@/types/borrow'

defineOptions({ name: 'BorrowManageView' })

const books = ref<BorrowRecord[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const username = ref('')
const bookName = ref('')
const state = ref('')
const drawerVisible = ref(false)
const form = reactive<any>({})

async function loadRecords() {
  const res = await borrowRecordListService({
    pageNum: pageNum.value, pageSize: pageSize.value,
    bookName: bookName.value || null,
    username: username.value || null,
    state: state.value || null,
  })
  books.value = res.data.items
  total.value = res.data.total
  for (const b of books.value) {
    if (b.borrowState === 1) b.State = '借阅中'
    else if (b.borrowState === 2) b.State = '已归还'
    else if (b.borrowState === 3) b.State = '已逾期'
  }
}

function showDraw(row: BorrowRecord) {
  Object.assign(form, {
    bookName: row.bookName, bookNum: row.bookNum,
    username: row.userName, date1: row.borrowDate,
    date2: row.deadline, state: row.borrowState,
    userId: row.userId, borrowId: row.id,
  })
  drawerVisible.value = true
}

async function onSubmit() {
  const res = await send(form)
  ElMessage.success(res.message || '编辑成功')
  drawerVisible.value = false
  loadRecords()
}

async function urgeUser(row: BorrowRecord) {
  const res = await urge(String(row.userId))
  ElMessage.success(res.message || '催促成功')
}

onMounted(loadRecords)
</script>

<template>
  <div>
    <AppPageHeader title="借阅记录管理" />

    <el-form inline size="default" style="margin-bottom:16px">
      <el-form-item label="用户名"><el-input v-model="username" clearable /></el-form-item>
      <el-form-item label="书名"><el-input v-model="bookName" clearable /></el-form-item>
      <el-form-item label="状态">
        <el-select v-model="state" clearable placeholder="全部" style="width:120px">
          <el-option label="借阅中" value="1" />
          <el-option label="已归还" value="2" />
          <el-option label="已逾期" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadRecords">搜索</el-button>
        <el-button @click="bookName='';state='';username='';loadRecords()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="books" stripe height="420">
      <el-table-column label="书名" prop="bookName" min-width="140" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }"><el-image :src="row.imageName" style="width:48px;height:64px;border-radius:4px" fit="cover" /></template>
      </el-table-column>
      <el-table-column label="借书人" prop="userName" width="100" />
      <el-table-column label="状态" prop="State" width="90" sortable>
        <template #default="{ row }">
          <el-tag :type="row.borrowState === 3 ? 'danger' : row.borrowState === 1 ? 'warning' : 'success'" size="small">{{ row.State }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="剩余天数" prop="lastDay" width="90" />
      <el-table-column label="借书日期" prop="borrowDate" width="110" />
      <el-table-column label="应还日期" prop="deadline" width="110" />
      <el-table-column label="操作" min-width="160">
        <template #default="{ row }">
          <el-button size="small" @click="showDraw(row)" v-if="row.borrowState !== 2">编辑</el-button>
          <el-button size="small" type="warning" v-if="row.borrowState !== 2" @click="urgeUser(row)">催促</el-button>
          <span v-else style="color:var(--color-text-muted);font-size:var(--text-sm);">已完成</span>
        </template>
      </el-table-column>
    </el-table>
    <AppPagination v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total" @size-change="loadRecords" @current-change="loadRecords" />

    <el-drawer v-model="drawerVisible" title="编辑借阅记录" size="500px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="书名"><el-input v-model="form.bookName" disabled /></el-form-item>
        <el-form-item label="借书人"><el-input v-model="form.username" disabled /></el-form-item>
        <el-form-item label="借书日期"><el-date-picker v-model="form.date1" type="date" style="width:100%" /></el-form-item>
        <el-form-item label="还书日期"><el-date-picker v-model="form.date2" type="date" style="width:100%" /></el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.state">
            <el-radio :value="1">未归还</el-radio>
            <el-radio :value="2">已归还</el-radio>
            <el-radio :value="3">已逾期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button @click="drawerVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
