<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { userLoginService, userInfoGetService } from '@/api/user'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'switch', mode: 'register' | 'forgot'): void
}>()

const formRef = ref()
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 16, message: '用户名长度必须为5~16位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 16, message: '密码长度必须为5~16位', trigger: 'blur' }
  ]
}

const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const router = useRouter()

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const result: any = await userLoginService(form.value)
    tokenStore.setToken(result.data)
    const res: any = await userInfoGetService()
    userInfoStore.info = res.data
    ElMessage.success(result.message || '登录成功')
    router.push('/home')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="glass-form">
    <div class="glass-form__header">
      <h2 class="glass-form__greeting">欢迎回来</h2>
      <p class="glass-form__subtitle">登录您的账户以继续</p>
    </div>

    <el-form
      ref="formRef"
      size="large"
      autocomplete="off"
      :model="form"
      :rules="rules"
      class="glass-form__body"
    >
      <el-form-item prop="username">
        <el-input
          :prefix-icon="User"
          placeholder="用户名"
          v-model="form.username"
          class="glass-input"
        />
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          :prefix-icon="Lock"
          type="password"
          placeholder="密码"
          v-model="form.password"
          class="glass-input"
        />
      </el-form-item>

      <div class="glass-form__actions">
        <el-checkbox class="glass-checkbox">记住我</el-checkbox>
        <el-button link type="primary" class="glass-link" @click="emit('switch', 'forgot')">
          忘记密码？
        </el-button>
      </div>

      <el-button
        class="glass-btn glass-btn--primary"
        :loading="loading"
        @click="handleLogin"
      >
        <span v-if="!loading">登 录</span>
      </el-button>

      <p class="glass-form__footer">
        还没有账户？
        <el-button link type="primary" class="glass-link" @click="emit('switch', 'register')">
          立即注册
        </el-button>
      </p>
    </el-form>
  </div>
</template>

<style scoped>
.glass-form {
  width: 100%;
}

.glass-form__header {
  margin-bottom: 32px;
  text-align: center;
}

.glass-form__greeting {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.02em;
}

.glass-form__subtitle {
  font-size: var(--text-base);
  color: var(--color-text-muted);
  margin: 0;
}

.glass-form__body {
  display: flex;
  flex-direction: column;
}

.glass-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 14px;
  transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.glass-input :deep(.el-input__wrapper:hover) {
  background: rgba(255, 255, 255, 0.8);
}

.glass-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(255, 255, 255, 0.9);
}

.glass-input :deep(.el-input__inner) {
  color: var(--color-text-primary);
  font-size: var(--text-base);
}

.glass-input :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
  font-weight: 400;
}

.glass-input :deep(.el-input__prefix) {
  color: var(--color-text-muted);
}

.glass-input :deep(.el-input__prefix-inner) {
  display: flex;
  align-items: center;
}

.glass-form__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.glass-checkbox :deep(.el-checkbox__label) {
  color: var(--color-text-secondary);
  font-size: var(--text-sm);
}

.glass-btn {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.glass-btn--primary {
  background: var(--color-primary-500);
  color: #ffffff;
  box-shadow: 0 2px 12px rgba(79, 70, 229, 0.3);
}

.glass-btn--primary:hover {
  background: var(--color-primary-600);
  box-shadow: 0 4px 18px rgba(79, 70, 229, 0.4);
  transform: translateY(-1px);
}

.glass-btn--primary:active {
  transform: translateY(0);
  box-shadow: 0 1px 8px rgba(79, 70, 229, 0.25);
}

.glass-btn--primary.is-loading {
  background: var(--color-primary-400);
}

.glass-link {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-primary-500);
}

.glass-link:hover {
  color: var(--color-primary-600);
}

.glass-form__footer {
  text-align: center;
  margin-top: 20px;
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

[data-theme="dark"] .glass-input :deep(.el-input__wrapper) {
  background: rgba(30, 41, 59, 0.6);
}

[data-theme="dark"] .glass-input :deep(.el-input__wrapper:hover) {
  background: rgba(30, 41, 59, 0.8);
}

[data-theme="dark"] .glass-input :deep(.el-input__wrapper.is-focus) {
  background: rgba(30, 41, 59, 0.95);
}

[data-theme="dark"] .glass-form__greeting {
  color: var(--color-text-primary);
}
</style>
