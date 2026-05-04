<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { Grid, List } from '@element-plus/icons-vue'
import { useBookList } from '@/composables/useBookList'
import { allTagsService } from '@/api/ai'
import AppSearchBar from '@/components/common/AppSearchBar.vue'
import AppPagination from '@/components/common/AppPagination.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import AppLoadingState from '@/components/common/AppLoadingState.vue'
import BookDetailDrawer from '@/components/book/BookDetailDrawer.vue'
import BookBorrowDialog from '@/components/book/BookBorrowDialog.vue'
import AiRecommendDialog from '@/components/book/AiRecommendDialog.vue'

defineOptions({ name: 'SearchView' })

const router = useRouter()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()
const isLoggedIn = computed(() => !!tokenStore.token)

const {
  books, categories, loading,
  title, categoryId, state, sortBy,
  pageNum, total, pageSize,
  loadCategories, loadBooks,
  onSizeChange, onCurrentChange,
} = useBookList()

const viewMode = ref<'list' | 'grid'>('list')
const detailVisible = ref(false)
const borrowVisible = ref(false)
const selectedBook = ref<any>(null)
const allTags = ref<string[]>([])
const selectedTags = ref<string[]>([])

onMounted(async () => {
  await loadCategories()
  loadTags()
  loadBooks()
})

async function loadTags() {
  try {
    const res = await allTagsService()
    allTags.value = res.data || []
  } catch { /* silent */ }
}

function toggleTag(tag: string) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx >= 0) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
  loadBooks({
    tags: selectedTags.value.length > 0 ? selectedTags.value.join(',') : null,
  } as any)
}

function search() {
  loadBooks({
    tags: selectedTags.value.length > 0 ? selectedTags.value.join(',') : null,
  } as any)
}

function reset() {
  title.value = ''
  categoryId.value = ''
  state.value = ''
  selectedTags.value = []
  loadBooks()
}

function showDetail(book: any) {
  selectedBook.value = book
  detailVisible.value = true
}

function showBorrow(book: any) {
  if (!isLoggedIn.value) {
    ElMessageBox.alert('请先登录后再借书', '未登录', {
      confirmButtonText: '去登录',
      callback: () => router.push('/auth/login'),
    })
    return
  }
  if (userInfoStore.info.state === 2) {
    ElMessageBox.alert('您已被禁止借书，请联系管理员', '禁止借书', { confirmButtonText: 'OK' })
    return
  }
  selectedBook.value = book
  borrowVisible.value = true
}

function navigateToBook(book: any) {
  router.push(`/book/${book.id}`)
}
</script>

<template>
  <div class="search-page">
    <div class="page-header">
      <h2 class="page-title">馆藏检索</h2>
    </div>

    <AppSearchBar
      v-model="title"
      v-model:category-id="categoryId"
      v-model:state="state"
      :categories="categories"
      @search="search"
      @reset="reset"
    />

    <!-- Tag cloud §5.2 -->
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

    <div class="view-toggle">
      <div class="view-toggle-left">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button value="list"><el-icon><List /></el-icon></el-radio-button>
          <el-radio-button value="grid"><el-icon><Grid /></el-icon></el-radio-button>
        </el-radio-group>
        <el-select v-model="sortBy" placeholder="默认排序" size="small" style="width:130px;margin-left:12px" @change="search">
          <el-option label="默认排序" value="" />
          <el-option label="评分最高" value="rating_desc" />
          <el-option label="最受欢迎" value="popular" />
        </el-select>
      </div>
      <span class="result-count">
        {{ total }} 条结果
        <span v-if="selectedTags.length"> · 标签：{{ selectedTags.join(', ') }}</span>
      </span>
    </div>

    <AppLoadingState v-if="loading" />

    <!-- List View -->
    <template v-else-if="viewMode === 'list'">
      <el-table v-if="books.length" :data="books" stripe style="width: 100%">
        <el-table-column label="封面" width="80" align="center">
          <template #default="{ row }">
            <el-image :src="row.coverImg" :preview-src-list="[row.coverImg]" style="width: 48px; height: 64px; border-radius: 4px;" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="书籍名称" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column label="分类" prop="categoryName" min-width="90" align="center" />
        <el-table-column label="位置" prop="location" min-width="90" align="center" />
        <el-table-column label="标签" min-width="140">
          <template #default="{ row }">
            <template v-if="row.tags">
              <el-tag
                v-for="t in row.tags.split(',')"
                :key="t"
                size="small"
                style="margin-right: 4px; margin-bottom: 2px;"
              >
                {{ t }}
              </el-tag>
            </template>
            <span v-else class="text-muted">--</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.state === '已发布' ? 'success' : 'warning'" size="small">
              {{ row.state === '已发布' ? '可借阅' : row.state }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row)">详情</el-button>
            <el-button
              size="small"
              type="primary"
              :disabled="row.state !== '已发布'"
              @click="showBorrow(row)"
            >
              借书
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <AppEmptyState v-else description="未找到匹配的图书" />
    </template>

    <!-- Grid View -->
    <template v-else>
      <div v-if="books.length" class="book-grid">
        <div
          v-for="book in books"
          :key="book.id"
          class="book-grid-card"
          @click="navigateToBook(book)"
        >
          <el-image :src="book.coverImg" :preview-src-list="[book.coverImg]" fit="cover" class="book-grid-cover" />
          <div class="book-grid-info">
            <h4>{{ book.title }}</h4>
            <p class="text-muted">{{ book.categoryName }} · {{ book.publisher }}</p>
            <div v-if="book.tags" style="margin-bottom:4px">
              <el-tag
                v-for="t in book.tags.split(',').slice(0, 3)"
                :key="t"
                size="small"
                style="margin-right:2px"
              >
                {{ t }}
              </el-tag>
            </div>
            <el-tag :type="book.state === '已发布' ? 'success' : 'warning'" size="small">
              {{ book.state === '已发布' ? '可借阅' : book.state }}
            </el-tag>
          </div>
        </div>
      </div>
      <AppEmptyState v-else description="未找到匹配的图书" />
    </template>

    <AppPagination
      v-if="total > 0"
      v-model:page-num="pageNum"
      v-model:page-size="pageSize"
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
    />

    <BookDetailDrawer v-model:visible="detailVisible" :book="selectedBook" />
    <BookBorrowDialog
      v-if="selectedBook"
      v-model:visible="borrowVisible"
      :book-name="selectedBook.title"
      :book-num="selectedBook.bookNum"
      @success="loadBooks()"
    />

    <AiRecommendDialog v-if="isLoggedIn" />
  </div>
</template>

<style scoped>
.view-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.view-toggle-left {
  display: flex;
  align-items: center;
}

.result-count {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

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

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--space-4);
}

.book-grid-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.book-grid-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.book-grid-cover {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.book-grid-info {
  padding: var(--space-3);

  h4 {
    font-size: var(--text-sm);
    margin-bottom: var(--space-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: var(--text-xs);
    margin-bottom: var(--space-2);
  }
}

.text-muted {
  color: var(--color-text-muted);
  font-size: var(--text-xs);
}
</style>
