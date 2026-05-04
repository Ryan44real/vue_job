<script setup lang="ts">
const pageNum = defineModel<number>('pageNum', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 5 })

defineProps<{
  total: number
  pageSizes?: number[]
}>()

const emit = defineEmits<{
  (e: 'size-change', size: number): void
  (e: 'current-change', num: number): void
}>()
</script>

<template>
  <el-pagination
    v-model:current-page="pageNum"
    v-model:page-size="pageSize"
    :page-sizes="pageSizes || [5, 10, 15, 20]"
    layout="jumper, total, sizes, prev, pager, next"
    background
    :total="total"
    @size-change="emit('size-change', $event)"
    @current-change="emit('current-change', $event)"
    style="justify-content: flex-end; margin-top: var(--space-4);"
  />
</template>
