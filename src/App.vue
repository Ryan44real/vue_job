<script setup lang="ts">
// This is a thin wrapper component that applies theme and provides router-view
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<template>
  <router-view />
</template>

<style>
@import '@/assets/styles/variables.css';
@import '@/assets/styles/reset.css';
@import '@/assets/styles/typography.css';
@import '@/assets/styles/transitions.css';

.el-table .el-table__body td .cell {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.el-table td.is-center .cell,
.el-table th.is-center .cell {
  justify-content: center;
}

.el-button > .el-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.el-button.is-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.el-table {
  width: 100%;
}
</style>
