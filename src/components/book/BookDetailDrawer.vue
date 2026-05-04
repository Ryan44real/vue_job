<script setup lang="ts">
import type { Book } from '@/types/book'

defineProps<{
  book: Book | null
}>()

const visible = defineModel<boolean>('visible', { default: false })
</script>

<template>
  <el-drawer
    :model-value="visible"
    title="书籍详情"
    direction="rtl"
    size="500px"
    @close="visible = false"
  >
    <template v-if="book">
      <div class="book-detail">
        <el-image v-if="book.coverImg" :src="book.coverImg" :preview-src-list="[book.coverImg]" fit="cover" class="book-cover" />
        <h3 class="book-title">{{ book.title }}</h3>
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="分类">{{ book.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="出版社">{{ book.publisher }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ book.location }}</el-descriptions-item>
          <el-descriptions-item label="ISBN">{{ book.isbn }}</el-descriptions-item>
          <el-descriptions-item label="书号">{{ book.bookNum }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="book.state === '已发布' ? 'success' : 'warning'" size="small">
              {{ book.state === '已发布' ? '可借阅' : book.state }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="book.content" class="book-content">
          <h4>内容简介</h4>
          <p>{{ book.content }}</p>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped>
.book-detail {
  .book-cover {
    width: 160px;
    height: 220px;
    object-fit: cover;
    border-radius: var(--radius-md);
    margin: 0 auto var(--space-4);
    box-shadow: var(--shadow-md);
  }

  .book-title {
    font-family: var(--font-display);
    font-size: var(--text-xl);
    margin-bottom: var(--space-4);
    text-align: center;
  }

  .book-content {
    margin-top: var(--space-4);

    h4 {
      font-size: var(--text-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-2);
    }

    p {
      font-size: var(--text-sm);
      line-height: 1.8;
      color: var(--color-text-secondary);
    }
  }
}
</style>
