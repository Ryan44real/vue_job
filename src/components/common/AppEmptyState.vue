<script setup lang="ts">
defineProps<{
  description?: string
  image?: string
}>()
</script>

<template>
  <div class="empty-state">
    <el-empty :description="description || '没有数据'" :image="image" />
    <slot name="action" />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12) 0;
}
</style>
