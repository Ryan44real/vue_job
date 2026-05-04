<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getBookCategory, bookCategoryAddService, bookCategoryUpdateService, bookCategoryDeleteService } from '@/api/bookCategory'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import type { BookCategory } from '@/types/book'

defineOptions({ name: 'CategoryManageView' })

const categories = ref<BookCategory[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const form = ref({ id: 0, categoryName: '', categoryAlias: '' })

async function loadCategories() {
  const res = await getBookCategory()
  categories.value = res.data
}

function openAdd() {
  isEdit.value = false
  form.value = { id: 0, categoryName: '', categoryAlias: '' }
  dialogVisible.value = true
}

function openEdit(row: BookCategory) {
  isEdit.value = true
  form.value = { id: row.id, categoryName: row.categoryName, categoryAlias: row.categoryAlias }
  dialogVisible.value = true
}

async function save() {
  if (isEdit.value) {
    await bookCategoryUpdateService(form.value)
    ElMessage.success('修改成功')
  } else {
    await bookCategoryAddService(form.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  loadCategories()
}

async function deleteCategory(row: BookCategory) {
  try {
    await ElMessageBox.confirm('确认删除该分类？', '提示', { type: 'warning' })
    await bookCategoryDeleteService(row.id)
    ElMessage.success('删除成功')
    loadCategories()
  } catch { /* cancelled */ }
}

onMounted(loadCategories)
</script>

<template>
  <div>
    <AppPageHeader title="图书分类管理">
      <template #actions>
        <el-button type="primary" @click="openAdd">添加分类</el-button>
      </template>
    </AppPageHeader>

    <el-table :data="categories" stripe>
      <el-table-column label="序号" type="index" width="80" />
      <el-table-column label="分类名称" prop="categoryName" />
      <el-table-column label="分类别名" prop="categoryAlias" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button :icon="Edit" circle type="primary" size="small" @click="openEdit(row)" />
          <el-button :icon="Delete" circle type="danger" size="small" @click="deleteCategory(row)" />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '添加分类'" width="400px" align-center>
      <el-form :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.categoryName" />
        </el-form-item>
        <el-form-item label="分类别名">
          <el-input v-model="form.categoryAlias" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
