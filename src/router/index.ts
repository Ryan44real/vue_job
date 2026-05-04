import { createRouter, createWebHistory } from 'vue-router'
import { useTokenStore } from '@/stores/token'
import { useUserInfoStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // === Public routes (no layout) ===
    {
      path: '/auth/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/auth/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guest: true },
    },

    // === AppLayout wrapper (public + auth) ===
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        { path: '', redirect: '/home' },
        {
          path: 'home', name: 'Home',
          component: () => import('@/views/HomeView.vue'),
          meta: { requiresAuth: true, title: '首页' },
        },
        {
          path: 'search', name: 'Search',
          component: () => import('@/views/SearchView.vue'),
          meta: { public: true, title: '馆藏检索' },
        },
        {
          path: 'book/:id', name: 'BookDetail',
          component: () => import('@/views/BookDetailView.vue'),
          meta: { public: true, title: '图书详情' },
        },

        // User center
        {
          path: 'user',
          component: () => import('@/views/user/UserLayout.vue'),
          meta: { requiresAuth: true, title: '个人中心' },
          children: [
            { path: '', redirect: '/user/borrowing' },
            { path: 'borrowing', name: 'BorrowingList', component: () => import('@/views/user/BorrowingListView.vue'), meta: { title: '当前借阅' } },
            { path: 'history', name: 'BorrowingHistory', component: () => import('@/views/user/BorrowingHistoryView.vue'), meta: { title: '借阅历史' } },
            { path: 'overdue', name: 'Overdue', component: () => import('@/views/user/OverdueView.vue'), meta: { title: '逾期记录' } },
            { path: 'wishlist', name: 'Wishlist', component: () => import('@/views/user/WishListView.vue'), meta: { title: '我的书单' } },
            { path: 'reservations', name: 'Reservations', component: () => import('@/views/user/ReservationListView.vue'), meta: { title: '我的预约' } },
            { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/user/DashboardView.vue'), meta: { title: '阅读账单' } },
          ],
        },

        // Action pages
        { path: 'renew/:borrowId?', name: 'Renew', component: () => import('@/views/RenewView.vue'), meta: { requiresAuth: true, title: '续借' } },
        { path: 'reserve/:bookId?', name: 'Reserve', component: () => import('@/views/ReserveView.vue'), meta: { requiresAuth: true, title: '预约到馆' } },

        // Notifications & Settings
        { path: 'notifications', name: 'Notifications', component: () => import('@/views/NotificationView.vue'), meta: { requiresAuth: true, title: '通知' } },
        { path: 'settings', name: 'Settings', component: () => import('@/views/SettingsView.vue'), meta: { requiresAuth: true, title: '设置' } },

        // Admin routes
        {
          path: 'admin',
          meta: { requiresAuth: true, requiresAdmin: true, title: '管理' },
          children: [
            { path: 'books', name: 'BookManage', component: () => import('@/views/admin/BookManageView.vue'), meta: { title: '图书管理' } },
            { path: 'categories', name: 'CategoryManage', component: () => import('@/views/admin/CategoryManageView.vue'), meta: { title: '图书分类' } },
            { path: 'borrows', name: 'BorrowManage', component: () => import('@/views/admin/BorrowManageView.vue'), meta: { title: '借阅管理' } },
            { path: 'renewals', name: 'RenewalManage', component: () => import('@/views/admin/RenewalManageView.vue'), meta: { title: '续借审批' } },
            { path: 'users', name: 'UserManage', component: () => import('@/views/admin/UserManageView.vue'), meta: { title: '用户管理' } },
            { path: 'reservations', name: 'ReservationManage', component: () => import('@/views/admin/ReservationManageView.vue'), meta: { title: '预约管理' } },
            { path: 'comments', name: 'CommentReview', component: () => import('@/views/admin/CommentReviewView.vue'), meta: { title: '评论审核' } },
          ],
        },
      ],
    },

    // === Legacy redirects ===
    { path: '/login', redirect: '/auth/login' },
    { path: '/visiter', redirect: '/search' },
    { path: '/dashshow', redirect: '/home' },
    { path: '/userMain', redirect: '/home' },
    { path: '/MyLayout', redirect: '/home' },

    // === 404 ===
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const tokenStore = useTokenStore()
  const userInfoStore = useUserInfoStore()

  // Merge meta from all matched routes (parent + children)
  const requiresAuth = to.matched.some(r => r.meta.requiresAuth)
  const requiresAdmin = to.matched.some(r => r.meta.requiresAdmin)
  const isPublic = to.matched.some(r => r.meta.public)
  const isGuest = to.matched.some(r => r.meta.guest)

  // Allow public and guest routes unconditionally (login/register always accessible)
  if (isPublic || isGuest) return next()

  // Require authentication
  if (requiresAuth && !tokenStore.token) {
    return next('/auth/login')
  }

  // Require admin role
  if (requiresAdmin && (userInfoStore.info as any).type !== 1) {
    return next('/home')
  }

  next()
})

export default router
