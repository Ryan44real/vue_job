<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { borrowRecordListService, returnBook, applyRenewalService } from '@/api/borrow'
import { useUserInfoStore } from '@/stores/user'
import AppPagination from '@/components/common/AppPagination.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import type { BorrowRecord } from '@/types/borrow'

defineOptions({ name: 'BorrowingListView' })

const router = useRouter()
const userInfoStore = useUserInfoStore()

const books = ref<BorrowRecord[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const renewVisible = ref(false)
const renewDay = ref('14')
const selectedRecord = ref<BorrowRecord | null>(null)

async function loadRecords() {
  const res = await borrowRecordListService({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    username: userInfoStore.info.username,
    state: '1',
    bookName: null,
  })
  books.value = res.data.items
  total.value = res.data.total
  for (const b of books.value) {
    if (b.borrowState === 1) b.State = '正在借阅'
    else if (b.borrowState === 3) b.State = '已逾期'
  }
}

async function handleReturn(bookNum: string) {
  const userId = (userInfoStore.info as any).id
  const res = await returnBook(userId, bookNum)
  ElMessage.success(res.message || '还书成功')
  loadRecords()
}

function handleRenew(record: BorrowRecord) {
  selectedRecord.value = record
  renewVisible.value = true
}

async function confirmRenew() {
  if (!selectedRecord.value) return
  const res = await applyRenewalService({
    bookName: selectedRecord.value.bookName,
    bookNum: selectedRecord.value.bookNum,
    borrowRecordId: selectedRecord.value.id,
    day: renewDay.value,
  })
  ElMessage.success(res.message || '续借申请已提交')
  renewVisible.value = false
  loadRecords()
}

onMounted(loadRecords)

function navigate(path: string) {
  router.push(path)
}
</script>

<template>
  <div>
    <el-table v-if="books.length" :data="books" stripe>
      <el-table-column label="书名" prop="bookName" min-width="160" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <el-image :src="row.imageName" style="width:48px;height:64px;border-radius:4px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.borrowState === 3 ? 'danger' : 'warning'" size="small">{{ row.State }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="剩余天数" prop="lastDay" width="90" sortable />
      <el-table-column label="借书日期" prop="borrowDate" width="110" />
      <el-table-column label="应还日期" prop="deadline" width="110" />
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleReturn(row.bookNum)">还书</el-button>
          <el-button size="small" v-if="row.borrowState === 1" @click="handleRenew(row)">续借</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AppEmptyState v-else description="暂无借阅记录" />
    <AppPagination v-if="total > 0" v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total"
      @size-change="loadRecords" @current-change="loadRecords" />

    <el-dialog v-model="renewVisible" title="续借申请" width="400px" align-center>
      <el-form label-width="100px">
        <el-form-item label="书名">{{ selectedRecord?.bookName }}</el-form-item>
        <el-form-item label="续借天数">
          <el-select v-model="renewDay">
            <el-option label="7 天" value="7" />
            <el-option label="14 天" value="14" />
            <el-option label="30 天" value="30" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renewVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRenew">确认续借</el-button>
      </template>
    </el-dialog>
  </div>
</template>
