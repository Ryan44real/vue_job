<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bookListService, bookDeleteService, BookDetailService } from '@/api/book'
import { allTagsService } from '@/api/ai'
import { getBookCategory } from '@/api/bookCategory'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import BookEditDrawer from '@/components/book/BookEditDrawer.vue'
import type { Book, BookCategory } from '@/types/book'

defineOptions({ name: 'BookManageView' })

const books = ref<Book[]>([])
const categories = ref<BookCategory[]>([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const title = ref('')
const categoryId = ref('')
const state = ref('')
const sortBy = ref('')
const allTags = ref<string[]>([])
const selectedTags = ref<string[]>([])

const editVisible = ref(false)
const editBook = ref<Book | null>(null)

async function loadCategories() {
  const res = await getBookCategory()
  categories.value = res.data
}

async function loadTags() {
  try {
    const res = await allTagsService()
    allTags.value = res.data || []
  } catch { /* silent */ }
}

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) selectedTags.value.splice(idx, 1)
  else selectedTags.value.push(tag)
  loadBooks()
}

async function loadBooks() {
  const res = await bookListService({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    categoryId: categoryId.value || null,
    title: title.value || null,
    state: state.value || null,
    sortBy: sortBy.value || null,
    tags: selectedTags.value.length > 0 ? selectedTags.value.join(',') : null,
  })
  books.value = res.data.items
  total.value = res.data.total
  for (const b of books.value) {
    const cat = categories.value.find(c => c.id === Number(b.categoryId))
    if (cat) b.categoryName = cat.categoryName
  }
}

function openAdd() {
  editBook.value = null
  editVisible.value = true
}

async function openEdit(row: Book) {
  const res = await BookDetailService(String(row.id))
  editBook.value = res.data.article || res.data
  editVisible.value = true
}

async function deleteBook(row: Book) {
  try {
    await ElMessageBox.confirm('确认删除该书籍？', '提示', { type: 'warning' })
    await bookDeleteService(String(row.id))
    ElMessage.success('删除成功')
    loadBooks()
  } catch { /* cancelled */ }
}

onMounted(async () => {
  await loadCategories()
  loadTags()
  loadBooks()
})
</script>

<template>
  <div>
    <AppPageHeader title="图书管理">
      <template #actions>
        <el-button type="primary" @click="openAdd">添加书籍</el-button>
      </template>
    </AppPageHeader>

    <el-form inline size="default" style="margin-bottom: 16px;">
      <el-form-item label="书名">
        <el-input v-model="title" clearable />
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="categoryId" clearable placeholder="全部分类" style="width:150px">
          <el-option v-for="c in categories" :key="c.id" :label="c.categoryName" :value="String(c.id)" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="state" clearable placeholder="全部" style="width:120px">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="sortBy" clearable placeholder="默认" style="width:130px" @change="loadBooks">
          <el-option label="默认排序" value="" />
          <el-option label="评分最高" value="rating_desc" />
          <el-option label="最受欢迎" value="popular" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadBooks">搜索</el-button>
        <el-button @click="categoryId='';state='';title='';sortBy='';selectedTags=[];loadBooks()">重置</el-button>
      </el-form-item>
    </el-form>

    <div v-if="allTags.length" class="tag-cloud">
      <el-tag
        v-for="tag in allTags"
        :key="tag"
        :type="selectedTags.includes(tag) ? 'primary' : 'info'"
        :effect="selectedTags.includes(tag) ? 'dark' : 'plain'"
        size="small"
        class="tag-chip"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </el-tag>
    </div>

    <el-table :data="books" stripe height="420">
      <el-table-column label="书名" prop="title" min-width="160" />
      <el-table-column label="封面" width="80">
        <template #default="{ row }">
          <el-image :src="row.coverImg" :preview-src-list="[row.coverImg]" style="width:48px;height:64px;border-radius:4px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" width="120" />
      <el-table-column label="分类" prop="categoryName" width="90" />
      <el-table-column label="位置" prop="location" width="100" />
      <el-table-column label="ISBN" prop="isbn" width="130" />
      <el-table-column label="标签" width="140">
        <template #default="{ row }">
          <template v-if="row.tags">
            <el-tag v-for="t in row.tags.split(',')" :key="t" size="small" style="margin-right:3px">
              {{ t }}
            </el-tag>
          </template>
          <span v-else class="text-muted">--</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="state" width="80" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button :icon="Edit" circle type="primary" size="small" @click="openEdit(row)" />
          <el-button :icon="Delete" circle type="danger" size="small" @click="deleteBook(row)" />
        </template>
      </el-table-column>
    </el-table>

    <AppPagination
      v-model:page-num="pageNum" v-model:page-size="pageSize" :total="total"
      @size-change="loadBooks" @current-change="loadBooks"
    />

    <BookEditDrawer v-model:visible="editVisible" :edit-book="editBook" @saved="loadBooks" />
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-card);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
}

.tag-chip {
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-chip:hover {
  transform: scale(1.05);
}

.text-muted {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}
</style>
