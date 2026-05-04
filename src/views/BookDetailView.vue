<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { StarFilled, Star, ChatDotRound } from '@element-plus/icons-vue'
import { BookDetailService } from '@/api/book'
import { borrowBookService } from '@/api/borrow'
import { addReservationService } from '@/api/reservation'
import { addCommentService, getBookCommentsService } from '@/api/comment'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'
import { getCreditInfo } from '@/types/reservation'
import type { Book } from '@/types/book'
import type { Comment, RatingInfo } from '@/types/comment'
import AppLoadingState from '@/components/common/AppLoadingState.vue'

defineOptions({ name: 'BookDetailView' })

const route = useRoute()
const router = useRouter()
const tokenStore = useTokenStore()
const userInfoStore = useUserInfoStore()

const book = ref<Book | null>(null)
const rating = ref<RatingInfo>({ avgRating: 0, commentCount: 0 })
const comments = ref<Comment[]>([])
const loading = ref(true)
const borrowVisible = ref(false)
const borrowDay = ref('14')
const borrowLoading = ref(false)
const reserveLoading = ref(false)

// Review dialog state
const reviewVisible = ref(false)
const reviewRating = ref(5)
const reviewContent = ref('')
const reviewLoading = ref(false)
const reviewBookNum = ref(0)

const creditInfo = computed(() => {
  const score = (userInfoStore.info as any).creditScore ?? 100
  return getCreditInfo(score)
})

const canBorrow = computed(() => {
  if (!book.value) return false
  return book.value.state === '可借阅' || book.value.state === '已发布'
})

const canReserve = computed(() => {
  if (!book.value) return false
  return (book.value.state === '已借出' || book.value.state === '预约锁定') && creditInfo.value.canReserve
})

const showCreditInsufficient = computed(() => {
  if (!book.value) return false
  return (book.value.state === '已借出' || book.value.state === '预约锁定') && !creditInfo.value.canReserve
})

function renderStars(n: number): string {
  return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const res = await BookDetailService(id)
    const body = res.data
    // §3.1: detail now returns { article, avgRating, commentCount }
    if (body.article) {
      book.value = body.article
      rating.value = { avgRating: body.avgRating ?? 0, commentCount: body.commentCount ?? 0 }
    } else {
      book.value = body
    }
    if (book.value) {
      loadComments(Number(book.value.bookNum))
    }
  } finally {
    loading.value = false
  }
})

async function loadComments(bookNum: number) {
  try {
    const res = await getBookCommentsService(bookNum)
    comments.value = (res.data || []).filter((c: Comment) => c.status === 1)
  } catch { /* silent */ }
}

function checkAuth(): boolean {
  if (!tokenStore.token) {
    ElMessageBox.alert('请先登录后再操作', '未登录', {
      confirmButtonText: '去登录',
      callback: () => router.push('/auth/login'),
    })
    return false
  }
  if (userInfoStore.info.state === 2) {
    ElMessageBox.alert('您已被禁止借书', '禁止借书', { confirmButtonText: 'OK' })
    return false
  }
  return true
}

function handleBorrow() {
  if (!checkAuth()) return
  borrowVisible.value = true
}

async function confirmBorrow() {
  if (!book.value) return
  borrowLoading.value = true
  try {
    const res = await borrowBookService({ bookId: book.value.bookNum, day: borrowDay.value })
    ElMessage.success(res.message || '借书成功')
    borrowVisible.value = false
    await refreshBook()
  } catch {
    // error handled by interceptor
  } finally {
    borrowLoading.value = false
  }
}

async function handleReserve() {
  if (!checkAuth() || !book.value) return
  try {
    await ElMessageBox.confirm(
      `确定要预约《${book.value.title}》吗？`,
      '确认预约',
      { confirmButtonText: '确定预约', cancelButtonText: '取消', type: 'info' }
    )
  } catch { return }

  reserveLoading.value = true
  try {
    const res = await addReservationService(Number(book.value.bookNum))
    ElMessage.success(res.message || '预约成功')
    await refreshBook()
  } catch { /* */ }
  finally { reserveLoading.value = false }
}

async function refreshBook() {
  if (!book.value) return
  const res = await BookDetailService(String(book.value.id))
  const body = res.data
  if (body.article) {
    book.value = body.article
    rating.value = { avgRating: body.avgRating ?? 0, commentCount: body.commentCount ?? 0 }
  } else {
    book.value = body
  }
}

// §6.1: Return-then-review
function promptReview(bookNum: number) {
  reviewBookNum.value = bookNum
  reviewRating.value = 5
  reviewContent.value = ''
  reviewVisible.value = true
}

async function submitReview() {
  reviewLoading.value = true
  try {
    const res = await addCommentService(reviewBookNum.value, reviewRating.value, reviewContent.value)
    ElMessage.success(res.message || '评价成功')
    reviewVisible.value = false
    if (book.value) {
      await refreshBook()
      loadComments(Number(book.value.bookNum))
    }
  } catch { /* */ }
  finally { reviewLoading.value = false }
}
</script>

<template>
  <div class="book-detail-page">
    <AppLoadingState v-if="loading" />

    <template v-else-if="book">
      <el-button class="back-btn" :icon="'ArrowLeft'" @click="router.back()">返回</el-button>

      <div class="detail-layout">
        <div class="detail-cover">
          <el-image :src="book.coverImg" :preview-src-list="[book.coverImg]" fit="cover" class="detail-cover-img" />
        </div>

        <div class="detail-info">
          <h1 class="page-title">{{ book.title }}</h1>

          <!-- §6.3: Rating display -->
          <div v-if="rating.commentCount > 0" class="rating-bar">
            <span class="rating-stars">{{ renderStars(rating.avgRating) }}</span>
            <span class="rating-score">{{ rating.avgRating.toFixed(1) }}</span>
            <span class="rating-count">（{{ rating.commentCount }} 条评价）</span>
          </div>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="分类">{{ book.categoryName }}</el-descriptions-item>
            <el-descriptions-item label="出版社">{{ book.publisher }}</el-descriptions-item>
            <el-descriptions-item label="ISBN">{{ book.isbn }}</el-descriptions-item>
            <el-descriptions-item label="书号">{{ book.bookNum }}</el-descriptions-item>
            <el-descriptions-item label="位置">{{ book.location }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag
                :type="book.state === '可借阅' || book.state === '已发布' ? 'success' : book.state === '预约锁定' ? 'warning' : 'info'"
                size="small"
              >
                {{ book.state === '已发布' ? '可借阅' : book.state }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item v-if="book.tags" label="标签" :span="2">
              <el-tag v-for="t in book.tags.split(',')" :key="t" size="small" style="margin-right:4px">
                {{ t }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <div v-if="tokenStore.token" class="credit-bar">
            <span>信用分 <strong>{{ creditInfo.score }}</strong> · {{ creditInfo.tier }}</span>
            <span class="credit-bar__limit">借阅额度 {{ creditInfo.borrowLimit }} 本</span>
          </div>

          <div class="detail-actions">
            <el-button v-if="canBorrow" type="primary" size="large" @click="handleBorrow">立即借阅</el-button>
            <el-button v-if="canReserve" type="warning" size="large" :loading="reserveLoading" @click="handleReserve">预约排队</el-button>
            <el-tag v-if="showCreditInsufficient" type="danger" size="large" class="credit-tag">
              信用分{{ creditInfo.score }}不足60，无法预约
            </el-tag>
            <el-button v-if="!canBorrow && !canReserve && !showCreditInsufficient" size="large" disabled>暂无馆藏</el-button>
            <el-button size="large" @click="router.push('/reserve/' + book.id)">预约到馆</el-button>
            <el-button v-if="tokenStore.token" size="large" :icon="ChatDotRound" @click="promptReview(Number(book.bookNum))">写评价</el-button>
          </div>

          <div v-if="book.content" class="detail-desc">
            <h3>内容简介</h3>
            <p>{{ book.content }}</p>
          </div>

          <!-- Comments section §6.3 -->
          <div v-if="comments.length > 0" class="comments-section">
            <h3>读者评价</h3>
            <div v-for="c in comments" :key="c.id" class="comment-item">
              <div class="comment-header">
                <span class="comment-user">{{ c.username }}</span>
                <span class="comment-stars">{{ renderStars(c.rating) }}</span>
                <span class="comment-time">{{ c.createTime }}</span>
              </div>
              <p class="comment-text">{{ c.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>

  <!-- Borrow dialog -->
  <el-dialog v-model="borrowVisible" title="确认借阅" width="420px" align-center>
    <el-form label-width="100px">
      <el-form-item label="书名"><span>{{ book?.title }}</span></el-form-item>
      <el-form-item label="借阅天数">
        <el-select v-model="borrowDay">
          <el-option label="7 天" value="7" />
          <el-option label="14 天" value="14" />
          <el-option label="30 天" value="30" />
        </el-select>
      </el-form-item>
      <el-form-item label="当前额度">
        <span>共 {{ creditInfo.borrowLimit }} 本（{{ creditInfo.tier }}）</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="borrowVisible = false">取消</el-button>
      <el-button type="primary" :loading="borrowLoading" @click="confirmBorrow">确认借阅</el-button>
    </template>
  </el-dialog>

  <!-- Review dialog §6.1 -->
  <el-dialog v-model="reviewVisible" title="写评价" width="440px" align-center>
    <el-form label-width="80px">
      <el-form-item label="评分">
        <div class="star-picker">
          <span
            v-for="n in 5"
            :key="n"
            class="star-pick"
            :class="{ active: n <= reviewRating }"
            @click="reviewRating = n"
          >
            <el-icon :size="28"><component :is="n <= reviewRating ? StarFilled : Star" /></el-icon>
          </span>
        </div>
      </el-form-item>
      <el-form-item label="评论">
        <el-input
          v-model="reviewContent"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="分享你的阅读感受（超过20字可获得+1信用分）"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="reviewVisible = false">取消</el-button>
      <el-button type="primary" :loading="reviewLoading" @click="submitReview">提交评价</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.back-btn { margin-bottom: var(--space-4); }

.detail-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-8);
  align-items: start;
}

.detail-cover-img {
  width: 100%;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.detail-info h1 { margin-bottom: var(--space-2); }

.rating-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.rating-stars {
  color: #f59e0b;
  letter-spacing: 2px;
  font-size: var(--text-lg);
}

.rating-score {
  font-weight: 700;
  color: var(--color-text-primary);
}

.rating-count {
  color: var(--color-text-muted);
}

.credit-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-primary-50);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-primary-700);
}

[data-theme="dark"] .credit-bar {
  background: rgba(99, 102, 241, 0.12);
  color: var(--color-primary-300);
}

.credit-bar__limit { font-size: var(--text-xs); opacity: 0.8; }

.detail-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
  flex-wrap: wrap;
  align-items: center;
}

.credit-tag { padding: 10px 16px; font-size: var(--text-sm); }

.detail-desc {
  margin-top: var(--space-6);
}

.detail-desc h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.detail-desc p {
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.comments-section {
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border-default);
  padding-top: var(--space-6);
}

.comments-section h3 {
  font-size: var(--text-lg);
  margin-bottom: var(--space-4);
}

.comment-item {
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-default);
}

.comment-item:last-child { border-bottom: none; }

.comment-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
}

.comment-user {
  font-weight: 600;
  font-size: var(--text-sm);
}

.comment-stars {
  color: #f59e0b;
  font-size: var(--text-xs);
}

.comment-time {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  margin-left: auto;
}

.comment-text {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

.star-picker { display: flex; gap: 4px; }

.star-pick {
  cursor: pointer;
  color: #d4d4d4;
  transition: color var(--transition-fast);
}

.star-pick.active { color: #f59e0b; }
.star-pick:hover { color: #f59e0b; }

@media (max-width: 767px) {
  .detail-layout { grid-template-columns: 1fr; }
  .detail-cover { max-width: 200px; margin: 0 auto; }
}
</style>
