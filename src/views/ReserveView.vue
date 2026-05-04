<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'ReserveView' })

const route = useRoute()
const router = useRouter()
const bookId = route.params.bookId as string || ''

function handleReserve() {
  ElMessage.success('预约申请已提交，请等待到馆通知')
  router.push('/user/reservations')
}
</script>

<template>
  <div class="reserve-page">
    <h2 class="page-title">预约到馆取书</h2>
    <el-card class="reserve-card">
      <p class="page-subtitle" style="margin-bottom: 16px;">
        提交预约后，当图书到馆时您将收到通知
      </p>
      <el-form label-width="100px">
        <el-form-item label="图书编号">
          <el-input :model-value="bookId || '从详情页进入'" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleReserve">确认预约</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.reserve-page {
  max-width: 560px;
}

.reserve-card {
  margin-top: var(--space-4);
}
</style>
