<script setup lang="ts">
import { User, Crop, EditPen, SwitchButton, CaretBottom } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import defaultAvatar from '@/assets/default.png'

const router = useRouter()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()

function handleCommand(command: string) {
  if (command === 'logout') {
    ElMessageBox.confirm('你确认退出登录码？', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(() => {
        userInfoStore.info = {} as any
        tokenStore.token = ''
        router.push('/auth/login')
      })
      .catch(() => {
        ElMessage({ type: 'info', message: '取消退出' })
      })
  } else {
    router.push('/settings')
  }
}
</script>

<template>
  <el-dropdown placement="bottom-end" @command="handleCommand">
    <span class="dropdown-trigger">
      <el-avatar :src="(userInfoStore.info as any).userPic || defaultAvatar" :size="32" />
      <span class="username">{{ (userInfoStore.info as any).username }}</span>
      <el-icon class="caret"><CaretBottom /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
        <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item>
        <el-dropdown-item command="password" :icon="EditPen">重置密码</el-dropdown-item>
        <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.dropdown-trigger:hover {
  background: var(--color-bg-secondary);
}

.username {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caret {
  color: var(--color-text-muted);
  font-size: 12px;
}
</style>
