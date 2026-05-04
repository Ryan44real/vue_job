<script setup lang="ts">
import { ref } from 'vue'
import { Search, Reading, Bell } from '@element-plus/icons-vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm.vue'
import logoImg from '@/assets/logo.png'

type AuthMode = 'login' | 'register' | 'forgot'

defineOptions({ name: 'LoginView' })

const mode = ref<AuthMode>('login')
const transitionName = ref('form-slide-right')

function switchMode(m: AuthMode) {
  const order: AuthMode[] = ['login', 'register', 'forgot']
  transitionName.value =
    order.indexOf(m) > order.indexOf(mode.value) ? 'form-slide-left' : 'form-slide-right'
  mode.value = m
}
</script>

<template>
  <div class="auth-page">
    <!-- Background gradient orbs -->
    <div class="bg-orb bg-orb--1" />
    <div class="bg-orb bg-orb--2" />
    <div class="bg-orb bg-orb--3" />

    <!-- Left: Brand Panel -->
    <div class="auth-brand">
      <div class="auth-brand__glass" />
      <div class="auth-brand__content">
        <img :src="logoImg" alt="Logo" class="auth-brand__logo" />
        <h1 class="auth-brand__title">图书数字化管理系统</h1>
        <p class="auth-brand__desc">智慧图书馆 · 知识触手可及</p>
        <div class="auth-brand__features">
          <div class="feature-item">
            <span class="feature-icon"><el-icon :size="20"><Search /></el-icon></span>
            <span class="feature-text">馆藏检索，一搜即达</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon"><el-icon :size="20"><Reading /></el-icon></span>
            <span class="feature-text">在线借阅，无需排队</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon"><el-icon :size="20"><Bell /></el-icon></span>
            <span class="feature-text">到期提醒，不再逾期</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: Form Panel -->
    <div class="auth-form-panel">
      <div class="auth-form-card">
        <Transition :name="transitionName" mode="out-in">
          <LoginForm v-if="mode === 'login'" key="login" @switch="switchMode" />
          <RegisterForm v-else-if="mode === 'register'" key="register" @switch="switchMode" />
          <ForgotPasswordForm v-else key="forgot" @switch="switchMode" />
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #f0f4ff 0%, #e8ecf8 30%, #f5f3ff 60%, #ede9fe 100%);
}

[data-theme="dark"] .auth-page {
  background: linear-gradient(160deg, #0f172a 0%, #1a1033 30%, #0f172a 60%, #1e1b4b 100%);
}

/* ===== Background Orbs ===== */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.bg-orb--1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(129, 140, 248, 0.35) 0%, transparent 70%);
  top: -180px;
  right: -120px;
}

.bg-orb--2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.3) 0%, transparent 70%);
  bottom: -100px;
  left: -80px;
}

.bg-orb--3 {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ===== Left Brand Panel ===== */
.auth-brand {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: url('@/assets/preview1.jpg') no-repeat center / cover;
  z-index: 1;
}

.auth-brand__glass {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(30, 27, 75, 0.82) 0%,
    rgba(55, 48, 163, 0.72) 50%,
    rgba(79, 70, 229, 0.62) 100%
  );
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
}

.auth-brand__content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: var(--space-8);
  color: #ffffff;
  max-width: 420px;
}

.auth-brand__logo {
  width: 72px;
  height: 72px;
  margin: 0 auto var(--space-6);
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.25));
}

.auth-brand__title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: var(--space-2);
  letter-spacing: 0.04em;
}

.auth-brand__desc {
  font-size: var(--text-lg);
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: var(--space-10);
  letter-spacing: 0.08em;
}

.auth-brand__features {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  text-align: left;
  padding: 0 var(--space-4);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: rgba(255, 255, 255, 0.88);
  padding: var(--space-3) var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: background 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-md);
  color: rgba(255, 255, 255, 0.9);
}

.feature-text {
  line-height: 1.5;
}

/* ===== Right Form Panel ===== */
.auth-form-panel {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-8) var(--space-12);
  z-index: 2;
}

.auth-form-card {
  width: 100%;
  max-width: 450px;
  padding: var(--space-12) var(--space-8);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 24px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.06),
    0 1px 4px rgba(0, 0, 0, 0.04);

  [data-theme="dark"] & {
    background: rgba(30, 41, 59, 0.7);
    box-shadow:
      0 4px 24px rgba(0, 0, 0, 0.3),
      0 1px 4px rgba(0, 0, 0, 0.2);
  }
}

/* ===== Form slide transitions ===== */
.form-slide-left-enter-active,
.form-slide-left-leave-active,
.form-slide-right-enter-active,
.form-slide-right-leave-active {
  transition: opacity 0.28s cubic-bezier(0.25, 0.1, 0.25, 1),
              transform 0.28s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.form-slide-left-enter-from {
  opacity: 0;
  transform: translateX(32px);
}
.form-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-32px);
}

.form-slide-right-enter-from {
  opacity: 0;
  transform: translateX(-32px);
}
.form-slide-right-leave-to {
  opacity: 0;
  transform: translateX(32px);
}

/* ===== Responsive ===== */
@media (max-width: 767px) {
  .auth-page {
    grid-template-columns: 1fr;
  }

  .bg-orb--1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -60px;
  }

  .bg-orb--2 {
    width: 240px;
    height: 240px;
    bottom: -60px;
    left: -40px;
  }

  .bg-orb--3 {
    width: 180px;
    height: 180px;
  }

  .auth-brand {
    display: none;
  }

  .auth-form-panel {
    padding: var(--space-4);
  }

  .auth-form-card {
    max-width: 100%;
    padding: var(--space-8) var(--space-6);
    border-radius: 20px;
  }
}
</style>
