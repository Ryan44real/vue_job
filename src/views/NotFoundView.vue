<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'NotFoundView' })

const router = useRouter()
</script>

<template>
  <div class="not-found-page">
    <div class="not-found-content">
      <h1 class="not-found-code">404</h1>
      <h2 class="page-title">页面未找到</h2>
      <p class="page-subtitle">您访问的页面不存在或已被移除</p>
      <el-button type="primary" size="large" @click="router.push('/home')">
        返回首页
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-primary);
}

.not-found-content {
  text-align: center;

  .not-found-code {
    font-family: var(--font-display);
    font-size: 8rem;
    font-weight: 700;
    color: var(--color-primary-200);
    line-height: 1;
    margin-bottom: var(--space-4);
  }

  h2 {
    margin-bottom: var(--space-2);
  }

  p {
    margin-bottom: var(--space-8);
  }
}
</style>
