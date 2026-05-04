<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useUserInfoStore } from '@/stores/user'
import { getUserNumService, getBookNumService, getAllBorrowNumServie, deleteMsgService, getMyRecordNumService, getBookNumUseService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { ChatLineRound, Collection, Document, User, Search, Clock, Bell } from '@element-plus/icons-vue'
import AppStatCard from '@/components/common/AppStatCard.vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'HomeView' })

const router = useRouter()
const userInfoStore = useUserInfoStore()
const isAdmin = userInfoStore.info.type === 1

const userNum = ref(0)
const bookNum = ref(0)
const borrowNum = ref(0)
const myRecordNum = ref(0)
const usefulBooks = ref(0)
const dialogVisible = ref(false)

const carouselList = reactive([
  { bigImg: new URL('@/assets/P1.jpg', import.meta.url).href },
  { bigImg: new URL('@/assets/P2.jpg', import.meta.url).href },
  { bigImg: new URL('@/assets/P3.jpg', import.meta.url).href },
])

onMounted(async () => {
  if (isAdmin) {
    const [u, b, w] = await Promise.all([getUserNumService(), getBookNumService(), getAllBorrowNumServie()])
    userNum.value = u.data
    bookNum.value = b.data
    borrowNum.value = w.data
  } else {
    const [b, ub, mr] = await Promise.all([getBookNumService(), getBookNumUseService(), getMyRecordNumService()])
    bookNum.value = b.data
    usefulBooks.value = ub.data
    myRecordNum.value = mr.data
  }

  if (userInfoStore.info.msg) {
    dialogVisible.value = true
  }
})

async function deleteMsg() {
  await deleteMsgService()
  ElMessage.success('已确认')
  userInfoStore.info.msg = null
  dialogVisible.value = false
}

function quickNav(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <!-- Stats Row -->
    <el-row :gutter="16" class="stats-row">
      <template v-if="isAdmin">
        <el-col :xs="12" :sm="6">
          <AppStatCard title="用户总数" :value="userNum" :icon="User" color="var(--color-primary-100)" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="藏书数" :value="bookNum" :icon="Collection" color="var(--color-accent-100)" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="借阅次数" :value="borrowNum" :icon="ChatLineRound" color="#dbeafe" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="访问数" :value="134" :icon="Document" color="#dcfce7" />
        </el-col>
      </template>
      <template v-else>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="我的借阅" :value="myRecordNum" :icon="Collection" color="var(--color-primary-100)" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="藏书总数" :value="bookNum" :icon="Document" color="var(--color-accent-100)" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="可借阅数" :value="usefulBooks" :icon="ChatLineRound" color="#dcfce7" />
        </el-col>
        <el-col :xs="12" :sm="6">
          <AppStatCard title="在线用户" :value="1" :icon="User" color="#dbeafe" />
        </el-col>
      </template>
    </el-row>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3 class="section-title">快捷操作</h3>
      <div class="action-cards">
        <div class="action-card" @click="quickNav('/search')">
          <el-icon :size="28"><Search /></el-icon>
          <span>馆藏检索</span>
        </div>
        <div class="action-card" @click="quickNav('/user/borrowing')">
          <el-icon :size="28"><Collection /></el-icon>
          <span>我的借阅</span>
        </div>
        <div class="action-card" @click="quickNav('/user/history')">
          <el-icon :size="28"><Clock /></el-icon>
          <span>借阅历史</span>
        </div>
        <div class="action-card" @click="quickNav('/notifications')">
          <el-icon :size="28"><Bell /></el-icon>
          <span>消息通知</span>
        </div>
      </div>
    </div>

    <!-- Carousel -->
    <el-carousel indicator-position="outside" height="400px" class="home-carousel">
      <el-carousel-item v-for="(item, idx) in carouselList" :key="idx">
        <el-image :src="item.bigImg" :preview-src-list="[item.bigImg]" fit="cover" class="carousel-img" />
      </el-carousel-item>
    </el-carousel>

    <!-- Notification Dialog -->
    <el-dialog v-model="dialogVisible" title="通知" width="500px" align-center>
      <el-input type="textarea" :model-value="userInfoStore.info.msg" disabled :rows="4" />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteMsg">我已知晓</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 100%;
}

.stats-row {
  margin-bottom: var(--space-6);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  margin-bottom: var(--space-4);
}

.quick-actions {
  margin-bottom: var(--space-8);
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--color-text-secondary);
}

.action-card:hover {
  color: var(--color-primary-600);
  border-color: var(--color-primary-300);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.action-card span {
  font-size: var(--text-sm);
  font-weight: 500;
}

.home-carousel {
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
}

@media (max-width: 767px) {
  .action-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .home-carousel {
    height: 240px;
  }
}
</style>
