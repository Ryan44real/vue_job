<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { userInfoUpdateService, userAvatarUpdateService, resetPsw } from '@/api/user'
import type { ThemeMode } from '@/stores/theme'

defineOptions({ name: 'SettingsView' })

const router = useRouter()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const themeStore = useThemeStore()

const activeTab = ref('profile')

// Profile
const profile = ref({ nickname: userInfoStore.info.nickname || '', email: userInfoStore.info.email || '' })
async function updateProfile() {
  const res = await userInfoUpdateService(profile.value)
  userInfoStore.info.nickname = profile.value.nickname
  userInfoStore.info.email = profile.value.email
  ElMessage.success(res.message || '修改成功')
}

// Avatar
const avatarUrl = ref(userInfoStore.info.userPic || '')
const uploadSuccess = (result: any) => { avatarUrl.value = result.data }
async function updateAvatar() {
  const res = await userAvatarUpdateService(avatarUrl.value)
  userInfoStore.info.userPic = avatarUrl.value
  ElMessage.success(res.message || '修改成功')
}

// Password
const pwd = ref({ oldpassword: '', password: '', repassword: '' })
async function updatePassword() {
  if (pwd.value.password !== pwd.value.repassword) {
    ElMessage.error('两次密码不一致')
    return
  }
  const res = await resetPsw(pwd.value)
  ElMessage.success(res.message || '修改成功，请重新登录')
  userInfoStore.info = {}
  tokenStore.token = ''
  router.push('/auth/login')
}

// Theme
function setTheme(mode: ThemeMode) { themeStore.setMode(mode) }
</script>

<template>
  <div class="settings-page">
    <h2 class="page-title">设置</h2>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本资料" name="profile">
        <el-card>
          <el-form :model="profile" label-width="80px" style="max-width: 440px;">
            <el-form-item label="用户名">
              <el-input :model-value="userInfoStore.info.username" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="profile.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profile.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updateProfile">保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="头像" name="avatar">
        <el-card>
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="true"
            action="/api/load"
            name="file"
            :headers="{ 'Authorization': tokenStore.token }"
            :on-success="uploadSuccess"
          >
            <img v-if="avatarUrl" :src="avatarUrl" class="avatar-img" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-button type="success" style="margin-top: 12px;" @click="updateAvatar">上传头像</el-button>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="password">
        <el-card>
          <el-form :model="pwd" label-width="100px" style="max-width: 440px;">
            <el-form-item label="旧密码">
              <el-input v-model="pwd.oldpassword" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="pwd.password" type="password" />
            </el-form-item>
            <el-form-item label="确认新密码">
              <el-input v-model="pwd.repassword" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="updatePassword">修改密码</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <el-tab-pane label="主题" name="theme">
        <el-card>
          <div class="theme-options">
            <div
              class="theme-option"
              :class="{ active: themeStore.mode === 'light' }"
              @click="setTheme('light')"
            >
              <div class="theme-preview theme-preview--light" />
              <span>浅色模式</span>
            </div>
            <div
              class="theme-option"
              :class="{ active: themeStore.mode === 'dark' }"
              @click="setTheme('dark')"
            >
              <div class="theme-preview theme-preview--dark" />
              <span>深色模式</span>
            </div>
            <div
              class="theme-option"
              :class="{ active: themeStore.mode === 'system' }"
              @click="setTheme('system')"
            >
              <div class="theme-preview theme-preview--system" />
              <span>跟随系统</span>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.avatar-img { width: 120px; height: 120px; border-radius: var(--radius-md); object-fit: cover; }

.theme-options {
  display: flex;
  gap: var(--space-6);
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  padding: var(--space-3);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
}

.theme-option.active {
  border-color: var(--color-primary-500);
}

.theme-preview {
  width: 80px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
}

.theme-preview--light { background: #fafaf9; }
.theme-preview--dark { background: #0f172a; }
.theme-preview--system {
  background: linear-gradient(135deg, #fafaf9 50%, #0f172a 50%);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: var(--color-text-muted);
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-md);
}
</style>
