<script setup lang="ts">
import { Search, Refresh } from '@element-plus/icons-vue'
import type { BookCategory } from '@/types/book'

defineProps<{
  modelValue: string
  categoryId: string
  state: string
  categories: BookCategory[]
  showState?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'update:categoryId', v: string): void
  (e: 'update:state', v: string): void
  (e: 'search'): void
  (e: 'reset'): void
}>()
</script>

<template>
  <el-form inline size="default" class="search-bar">
    <el-form-item label="书名">
      <el-input
        :model-value="modelValue"
        :prefix-icon="Search"
        placeholder="搜索书名..."
        clearable
        @input="emit('update:modelValue', ($event as unknown as string))"
        @keyup.enter="emit('search')"
      />
    </el-form-item>
    <el-form-item label="分类">
      <el-select
        :model-value="categoryId"
        placeholder="全部分类"
        clearable
        style="width: 160px"
        @change="emit('update:categoryId', $event as string)"
      >
        <el-option
          v-for="c in categories"
          :key="c.id"
          :label="c.categoryName"
          :value="String(c.id)"
        />
      </el-select>
    </el-form-item>
    <el-form-item v-if="showState !== false" label="状态">
      <el-select
        :model-value="state"
        placeholder="全部状态"
        clearable
        style="width: 120px"
        @change="emit('update:state', $event as string)"
      >
        <el-option label="可借阅" value="已发布" />
        <el-option label="已借出" value="已借出" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="emit('search')">搜索</el-button>
      <el-button :icon="Refresh" @click="emit('reset')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.search-bar {
  margin-bottom: var(--space-4);
}
</style>
