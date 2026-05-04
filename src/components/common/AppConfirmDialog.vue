<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger'
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const visible = defineModel<boolean>('visible', { default: false })
const loading = ref(false)

async function handleConfirm() {
  loading.value = true
  try {
    emit('confirm')
  } finally {
    loading.value = false
    visible.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="visible"
    :title="title || '确认操作'"
    width="420px"
    :close-on-click-modal="false"
    align-center
  >
    <p>{{ message }}</p>
    <template #footer>
      <el-button @click="visible = false; emit('cancel')">
        {{ cancelText || '取消' }}
      </el-button>
      <el-button
        :type="type === 'danger' ? 'danger' : 'primary'"
        :loading="loading"
        @click="handleConfirm"
      >
        {{ confirmText || '确认' }}
      </el-button>
    </template>
  </el-dialog>
</template>
