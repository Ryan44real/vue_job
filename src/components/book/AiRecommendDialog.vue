<script setup lang="ts">
import { ref } from 'vue'
import { MagicStick } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { aiRecommendService } from '@/api/ai'

defineOptions({ name: 'AiRecommendDialog' })

const visible = ref(false)
const query = ref('')
const result = ref('')
const loading = ref(false)

function parseMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="md-h2">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="md-h1">$1</h1>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/\n\n/g, '</p><p class="md-p">')
  html = html.replace(/\n/g, '<br>')
  html = '<p class="md-p">' + html + '</p>'

  return html
}

async function handleRecommend() {
  const q = query.value.trim()
  if (!q) { ElMessage.warning('请描述你想看的书'); return }
  if (q.length > 500) { ElMessage.warning('输入不能超过500字'); return }

  loading.value = true
  result.value = ''
  try {
    const res = await aiRecommendService(q)
    result.value = res.data || ''
  } catch {
    // error handled by interceptor
  } finally {
    loading.value = false
  }
}

function open() {
  query.value = ''
  result.value = ''
  visible.value = true
}
</script>

<template>
  <div class="ai-float-btn" @click="open">
    <el-icon :size="22"><MagicStick /></el-icon>
    <span>AI 荐书</span>
  </div>

  <el-dialog
    v-model="visible"
    title="AI 智能荐书伴侣"
    width="560px"
    align-center
    :close-on-click-modal="false"
  >
    <div class="ai-chat">
      <el-input
        v-model="query"
        type="textarea"
        :rows="3"
        maxlength="500"
        show-word-limit
        placeholder="描述你想看的书，如：适合零基础的微服务入门书..."
        :disabled="loading"
      />

      <el-button
        class="ai-submit"
        type="primary"
        :loading="loading"
        :icon="MagicStick"
        @click="handleRecommend"
      >
        {{ loading ? 'AI 思考中...' : '智能推荐' }}
      </el-button>

      <div v-if="result" class="ai-result" v-html="parseMarkdown(result)" />

      <div v-if="!result && !loading" class="ai-hint">
        <p>AI 将根据你的阅读偏好和借阅历史，为你推荐 3-5 本图书</p>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.ai-float-btn {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  color: #fff;
  border-radius: 28px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.4);
  cursor: pointer;
  font-size: var(--text-sm);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.ai-float-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 28px rgba(79, 70, 229, 0.5);
}

.ai-chat {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.ai-submit {
  align-self: flex-start;
}

.ai-result {
  max-height: 360px;
  overflow-y: auto;
  padding: var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  font-size: var(--text-sm);
  line-height: 1.8;
}

.ai-result :deep(.md-h3) {
  font-size: var(--text-lg);
  font-weight: 700;
  margin: var(--space-3) 0 var(--space-2);
}

.ai-result :deep(.md-h2) {
  font-size: var(--text-xl);
  font-weight: 700;
  margin: var(--space-4) 0 var(--space-2);
}

.ai-result :deep(.md-p) {
  margin: 0 0 var(--space-2);
}

.ai-result :deep(strong) {
  color: var(--color-primary-600);
}

[data-theme="dark"] .ai-result :deep(strong) {
  color: var(--color-primary-300);
}

.ai-hint {
  text-align: center;
  padding: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}
</style>
