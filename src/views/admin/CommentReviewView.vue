<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPendingCommentsService, reviewCommentService } from '@/api/comment'
import AppPageHeader from '@/components/common/AppPageHeader.vue'
import AppLoadingState from '@/components/common/AppLoadingState.vue'
import AppEmptyState from '@/components/common/AppEmptyState.vue'
import type { Comment } from '@/types/comment'

defineOptions({ name: 'CommentReviewView' })

const comments = ref<Comment[]>([])
const loading = ref(true)

onMounted(loadPending)

async function loadPending() {
  loading.value = true
  try {
    const res = await getPendingCommentsService()
    comments.value = res.data || []
  } finally { loading.value = false }
}

async function handleReview(comment: Comment, status: number) {
  try {
    const res = await reviewCommentService(comment.id, status)
    ElMessage.success(res.message || (status === 1 ? '已通过' : '已拒绝'))
    comments.value = comments.value.filter(c => c.id !== comment.id)
  } catch { /* */ }
}
</script>

<template>
  <div>
    <AppPageHeader title="评论审核" />

    <AppLoadingState v-if="loading" />

    <AppEmptyState v-else-if="comments.length === 0" description="暂无待审核评论" />

    <div v-else class="review-list">
      <div v-for="c in comments" :key="c.id" class="review-card">
        <div class="review-header">
          <strong>{{ c.username }}</strong>
          <span class="review-stars">{{ '★'.repeat(c.rating) }}{{ '☆'.repeat(5 - c.rating) }}</span>
          <span class="review-book">《{{ c.bookName }}》</span>
          <span class="review-time">{{ c.createTime }}</span>
        </div>
        <p class="review-content">{{ c.content }}</p>
        <div class="review-actions">
          <el-button type="success" size="small" @click="handleReview(c, 1)">通过</el-button>
          <el-button type="danger" size="small" @click="handleReview(c, 2)">拒绝</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.review-list { display: flex; flex-direction: column; gap: var(--space-3); }

.review-card {
  padding: var(--space-4);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
}

.review-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.review-stars { color: #f59e0b; font-size: var(--text-xs); }
.review-book { color: var(--color-text-secondary); }
.review-time { color: var(--color-text-muted); font-size: var(--text-xs); margin-left: auto; }

.review-content {
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-3);
}

.review-actions { display: flex; gap: var(--space-2); }
</style>
