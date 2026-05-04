<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: number | string
  icon?: Component
  color?: string
  suffix?: string
}>()
</script>

<template>
  <div class="stat-card">
    <div v-if="icon" class="stat-card__icon" :style="{ background: color || 'var(--color-primary-100)' }">
      <el-icon :size="20"><component :is="icon" /></el-icon>
    </div>
    <div class="stat-card__body">
      <span class="stat-card__title">{{ title }}</span>
      <span class="stat-card__value">
        {{ typeof value === 'number' ? value.toLocaleString() : value }}
        <small v-if="suffix">{{ suffix }}</small>
      </span>
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  transition: box-shadow var(--transition-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--color-primary-700);
}

.stat-card__body {
  display: flex;
  flex-direction: column;
}

.stat-card__title {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.stat-card__value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-card__value small {
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-text-muted);
}
</style>
