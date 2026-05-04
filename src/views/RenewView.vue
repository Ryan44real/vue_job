<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { applyRenewalService } from '@/api/borrow'

defineOptions({ name: 'RenewView' })

const route = useRoute()
const router = useRouter()
const borrowId = route.params.borrowId as string || ''
const bookNum = (route.query.bookNum as string) || ''
const day = ref('14')
const loading = ref(false)

async function handleRenew() {
  if (!bookNum) {
    ElMessage.error('缺少图书编号，请从借阅列表进入')
    return
  }
  loading.value = true
  try {
    const res = await applyRenewalService({ bookNum, borrowRecordId: borrowId, day: day.value })
    ElMessage.success(res.message || '续借申请已提交')
    router.push('/user/borrowing')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="renew-page">
    <h2 class="page-title">续借操作</h2>
    <el-card class="renew-card">
      <p class="page-subtitle" style="margin-bottom: 16px;">
        续借后将延长您的还书期限，请确认续借天数
      </p>
      <el-form label-width="100px">
        <el-form-item label="借阅编号">
          <el-input :model-value="borrowId || '从借阅列表进入'" disabled />
        </el-form-item>
        <el-form-item label="续借天数">
          <el-select v-model="day">
            <el-option label="7 天" value="7" />
            <el-option label="14 天" value="14" />
            <el-option label="30 天" value="30" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleRenew">确认续借</el-button>
          <el-button @click="router.push('/user/borrowing')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.renew-page {
  max-width: 560px;
}

.renew-card {
  margin-top: var(--space-4);
}
</style>
