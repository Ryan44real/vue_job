<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowLeft } from '@element-plus/icons-vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

defineOptions({ name: 'RegisterView' })

const router = useRouter()

function switchMode(mode: string) {
  if (mode === 'login') router.push('/auth/login')
}

function onSuccess() {
  // handled by form
}
</script>

<template>
  <div class="register-page">
    <div class="bg-orb bg-orb--1" />
    <div class="bg-orb bg-orb--2" />

    <div class="register-card">
      <div class="register-header">
        <el-button link class="back-btn" @click="router.push('/auth/login')">
          <el-icon :size="18"><ArrowLeft /></el-icon>
        </el-button>
      </div>
      <RegisterForm @switch="switchMode" @success="onSuccess" />
    </div>
  </div>
</template>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #f0f4ff 0%, #e8ecf8 30%, #f5f3ff 60%, #ede9fe 100%);
  overflow: hidden;
  padding: var(--space-4);
}

[data-theme="dark"] .register-page {
  background: linear-gradient(160deg, #0f172a 0%, #1a1033 30%, #0f172a 60%, #1e1b4b 100%);
}

.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.bg-orb--1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.3) 0%, transparent 70%);
  top: -120px;
  right: -80px;
}

.bg-orb--2 {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.25) 0%, transparent 70%);
  bottom: -80px;
  left: -60px;
}

.register-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 415px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04);
  padding: var(--space-8);

  [data-theme="dark"] & {
    background: rgba(30, 41, 59, 0.7);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.3),
      0 1px 4px rgba(0, 0, 0, 0.2);
  }
}

.register-header {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-4);
}

.back-btn {
  color: var(--color-text-muted);
  padding: 4px;
}

.back-btn:hover {
  color: var(--color-text-primary);
}

@media (max-width: 767px) {
  .register-card {
    max-width: 100%;
    padding: var(--space-6);
    border-radius: 20px;
  }
}
</style>
