<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <span class="text-muted">图书数字化管理系统 &copy; {{ new Date().getFullYear() }}</span>
  </footer>
</template>

<style scoped>
.app-footer {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  border-top: 1px solid var(--color-border-default);
  padding: 0 var(--space-4);
}
</style>
