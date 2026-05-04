<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { useTokenStore } from '@/stores/token'
import axios from 'axios'
import { bookAddService, bookUpdateService, AiContent, getBookBarcodeByPy, buildBookNumService, buildQrCodeService } from '@/api/book'
import { getBookCategory } from '@/api/bookCategory'
import type { Book } from '@/types/book'
import type { BookCategory } from '@/types/book'
import type { UploadRequestOptions } from 'element-plus'
import BookScanner from './BookScanner.vue'

const props = defineProps<{
  editBook?: Book | null
}>()

const visible = defineModel<boolean>('visible', { default: false })
const emit = defineEmits<{ (e: 'saved'): void }>()
const tokenStore = useTokenStore()
const isEdit = computed(() => !!props.editBook)

const categories = ref<BookCategory[]>([])
const scannerVisible = ref(false)
const loading = ref(false)

const form = ref<Book>({
  title: '',
  categoryId: '',
  coverImg: '',
  content: '',
  state: '',
  isbn: '',
  bookNum: '',
  location: '',
  publisher: '',
  isbnPhoto: '',
  tags: '',
})

async function loadCategories() {
  const res = await getBookCategory()
  categories.value = res.data
}

function initForm() {
  if (props.editBook) {
    form.value = { ...props.editBook }
  } else {
    form.value = { title: '', categoryId: '', coverImg: '', content: '', state: '', isbn: '', bookNum: '', location: '', publisher: '', isbnPhoto: '', tags: '' }
  }
  loadCategories()
}

async function uploadCover(options: UploadRequestOptions) {
  const fd = new FormData()
  fd.append('file', options.file)
  const res = await axios.post('/api/load', fd, {
    headers: { 'Authorization': tokenStore.token, 'Content-Type': 'multipart/form-data' }
  })
  form.value.coverImg = res.data.data
}

function onScannerResult(isbn: string) {
  form.value.isbn = isbn
}

async function getIsbnByPy() {
  const res = await getBookBarcodeByPy()
  form.value.isbn = res.data
}

async function buildBarcode() {
  const res1 = await buildBookNumService(form.value.isbn)
  form.value.bookNum = res1.data
  const res2 = await buildQrCodeService(form.value.bookNum)
  form.value.isbnPhoto = res2.data
}

async function aiSummary() {
  const res = await AiContent(form.value.title, form.value.isbn)
  form.value.content = res.data
}

async function save(state: string) {
  loading.value = true
  try {
    form.value.state = state
    form.value.content = (form.value.content || '').replace(/<[^>]+>/g, '')
    if (isEdit.value) {
      await bookUpdateService(form.value)
      ElMessage.success('修改成功')
    } else {
      await bookAddService(form.value)
      ElMessage.success('添加成功')
    }
    visible.value = false
    emit('saved')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-drawer v-model="visible" :title="isEdit ? '编辑书籍' : '添加书籍'" direction="rtl" size="600px" @open="initForm">
    <el-form :model="form" label-width="100px">
      <el-form-item label="书名">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.categoryId" placeholder="请选择分类">
          <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="c.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="form.publisher" />
      </el-form-item>
      <el-form-item label="位置">
        <el-input v-model="form.location" />
      </el-form-item>
      <el-form-item label="ISBN">
        <el-row style="width:100%">
          <el-col :span="16"><el-input v-model="form.isbn" /></el-col>
          <el-col :span="8">
            <el-button @click="scannerVisible = true">扫码识别</el-button>
            <el-button @click="getIsbnByPy">Py识别</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="书号">
        <el-row style="width:100%">
          <el-col :span="16"><el-input v-model="form.bookNum" /></el-col>
          <el-col :span="8"><el-button @click="buildBarcode">自动生成</el-button></el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="标签">
        <el-input v-model="form.tags" placeholder="如 Java,入门,微服务（逗号分隔，留空则由AI自动提取）" />
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          class="cover-uploader"
          :show-file-list="false"
          :auto-upload="true"
          :http-request="uploadCover"
          accept="image/*"
        >
          <div class="cover-upload-trigger">
            <img v-if="form.coverImg" :src="form.coverImg" class="upload-preview" />
            <el-icon v-else class="cover-upload-icon"><Plus /></el-icon>
            <div class="cover-upload-hint">点击上传封面</div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="form.isbnPhoto" label="二维码">
        <img :src="form.isbnPhoto" style="width: 120px; height: 120px;" />
      </el-form-item>
      <el-form-item label="简介">
        <el-button size="small" @click="aiSummary" style="margin-bottom: 8px">AI智能总结</el-button>
        <div class="editor">
          <quill-editor theme="snow" v-model:content="form.content" contentType="html" />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save('已发布')">发布</el-button>
        <el-button :loading="loading" @click="save('草稿')">保存草稿</el-button>
      </el-form-item>
    </el-form>

    <BookScanner v-model:visible="scannerVisible" @scanned="onScannerResult" />
  </el-drawer>
</template>

<style scoped>
.cover-uploader :deep(.el-upload) {
  border: 2px dashed var(--color-border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.cover-uploader :deep(.el-upload:hover) {
  border-color: var(--color-primary-400);
}

.cover-upload-trigger {
  width: 160px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.cover-upload-icon {
  font-size: 28px;
  color: var(--color-text-muted);
}

.cover-upload-hint {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}

.upload-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.editor :deep(.ql-editor) { min-height: 200px; }
</style>
