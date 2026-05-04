<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { borrowBookService } from '@/api/borrow'

const props = defineProps<{
  bookName: string
  bookNum: string
}>()

const visible = defineModel<boolean>('visible', { default: false })

const emit = defineEmits<{
  (e: 'success'): void
}>()

const day = ref('14')
const loading = ref(false)

async function handleBorrow() {
  loading.value = true
  try {
    const res: any = await borrowBookService({ bookId: props.bookNum, day: day.value })
    ElMessage.success(res.message || '借书成功')
    visible.value = false
    emit('success')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-dialog v-model="visible" title="借阅书籍" width="420px" align-center>
    <el-form label-width="100px">
      <el-form-item label="图书名称">
        <el-input :model-value="bookName" disabled />
      </el-form-item>
      <el-form-item label="借书时长">
        <el-select v-model="day" placeholder="请选择">
          <el-option label="7 天" value="7" />
          <el-option label="14 天" value="14" />
          <el-option label="30 天" value="30" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleBorrow">确认借阅</el-button>
    </template>
  </el-dialog>
</template>
