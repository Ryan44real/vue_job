<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserListService, editUserService, upgradeUserStateService, deleteUserService, useRegisterService, sendMailCon } from '@/api/user'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppPagination from '@/components/common/AppPagination.vue'

defineOptions({ name: 'UserManageView' })

const users = ref<any[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const username = ref('')
const userState = ref('')

async function loadUsers() {
  const res = await getUserListService({
    pageNum: pageNum.value, pageSize: pageSize.value,
    username: username.value || null,
    state: userState.value || null,
  })
  users.value = res.data.items
  total.value = res.data.total
  for (const u of users.value) {
    u.State = u.state === 1 ? '可借阅' : '不可借阅'
    u.Type = u.type === 1 ? '管理员' : '普通用户'
  }
}

const editVisible = ref(false)
const editForm = ref<any>({})
function openEdit(row: any) {
  editForm.value = { id: row.id, nickname: row.nickname, password: '' }
  editVisible.value = true
}

async function saveEdit() {
  await editUserService(editForm.value)
  ElMessage.success('修改成功')
  editVisible.value = false
  loadUsers()
}

async function toggleState(row: any) {
  const newState = row.state === 1 ? 2 : 1
  const action = newState === 2 ? '禁止' : '解除禁止'
  try {
    await ElMessageBox.confirm(`确定${action}该用户借书？`, '提示', { type: 'warning' })
    await upgradeUserStateService(String(row.id), String(newState))
    ElMessage.success('操作成功')
    loadUsers()
  } catch { /* cancelled */ }
}

async function deleteUser(row: any) {
  try {
    await ElMessageBox.confirm('确定删除该用户？', '提示', { type: 'warning' })
    await deleteUserService(String(row.id))
    ElMessage.success('删除成功')
    loadUsers()
  } catch { /* cancelled */ }
}

const addVisible = ref(false)
const addForm = ref({ username: '', password: '', repassword: '', mail: '', code: '', type: '2' })
async function sendMail() {
  const res = await sendMailCon(addForm.value.mail)
  ElMessage.success(res.message || '发送成功')
}
async function handleRegister() {
  if (addForm.value.password !== addForm.value.repassword || !addForm.value.username) {
    ElMessage.error('请检查注册信息')
    return
  }
  const res = await useRegisterService(addForm.value)
  ElMessage.success(res.message || '注册成功')
  addVisible.value = false
  loadUsers()
}

onMounted(loadUsers)
</script>

<template>
  <div>
    <AppPageHeader title="用户管理">
      <template #actions>
        <el-button type="primary" @click="addVisible = true">添加用户</el-button>
      </template>
    </AppPageHeader>

    <el-form inline size="default" style="margin-bottom:16px">
      <el-form-item label="用户名"><el-input v-model="username" clearable /></el-form-item>
      <el-form-item label="借阅状态">
        <el-select v-model="userState" clearable placeholder="全部" style="width:120px">
          <el-option label="可借阅" value="1" />
          <el-option label="不可借阅" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadUsers">搜索</el-button>
        <el-button @click="username='';userState='';loadUsers()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="users" stripe height="420">
      <el-table-column label="用户名" prop="username" width="120" />
      <el-table-column label="昵称" prop="nickname" width="100" />
      <el-table-column label="借书状态" prop="State" width="100" />
      <el-table-column label="用户类型" prop="Type" width="100" />
      <el-table-column label="邮箱" prop="email" width="180" />
      <el-table-column label="操作" min-width="260">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          <el-button v-if="row.state === 1" size="small" type="warning" @click="toggleState(row)">禁止借书</el-button>
          <el-button v-else size="small" type="success" @click="toggleState(row)">解除禁止</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AppPagination v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total" @size-change="loadUsers" @current-change="loadUsers" />

    <!-- Edit Drawer -->
    <el-drawer v-model="editVisible" title="编辑用户" size="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="昵称"><el-input v-model="editForm.nickname" /></el-form-item>
        <el-form-item label="新密码"><el-input v-model="editForm.password" type="password" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- Add User Drawer -->
    <el-drawer v-model="addVisible" title="添加用户" direction="rtl" size="500px">
      <el-form :model="addForm" label-width="100px">
        <el-form-item label="用户名"><el-input v-model="addForm.username" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="addForm.password" type="password" /></el-form-item>
        <el-form-item label="确认密码"><el-input v-model="addForm.repassword" type="password" /></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="addForm.mail" /></el-form-item>
        <el-form-item label="验证码">
          <el-input v-model="addForm.code">
            <template #append><el-button @click="sendMail">获取验证码</el-button></template>
          </el-input>
        </el-form-item>
        <el-form-item label="用户类型">
          <el-select v-model="addForm.type">
            <el-option label="管理员" value="1" />
            <el-option label="普通用户" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
