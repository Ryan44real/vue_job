## 项目总结文档：vue_job —— 图书数字化管理系统 v2.0
>
>后端：https://github.com/Ryan44real/BookSys
### 一、项目概述

基于 **Vue 3 + TypeScript + Vite** 构建的**图书数字化管理系统**前端项目（重构版）。面向**在校大学生**，提供馆藏检索、借阅管理、个人书单、到期提醒、续借操作、阅读记录等校园图书馆使用场景。

支持管理员（type=1）和普通用户（type=2）两种角色，配备浅色/深色主题切换、响应式移动端适配。

### 二、技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3.4（Composition API + `<script setup>`） |
| 语言 | TypeScript（strict mode） |
| 构建工具 | Vite 5 |
| 路由 | Vue Router 4（lazy loading + 导航守卫） |
| 状态管理 | Pinia 2 + pinia-persistedstate-plugin（持久化） |
| UI 组件库 | Element Plus 2.6 + 暗色 CSS 变量 |
| HTTP 客户端 | Axios（统一拦截器处理 Token/401） |
| 富文本编辑器 | @vueup/vue-quill |
| 条码/二维码 | @zxing/library（摄像头扫码） |
| 粒子背景 | particles.vue3 / tsparticles-slim |
| CSS | Sass + CSS Custom Properties（浅色/深色主题） |

### 三、项目架构

```
src/
├── main.ts                    # 入口：注册 Router/Pinia/ElementPlus/Particles
├── App.vue                    # 根组件：注入全局样式 + <router-view>
├── env.d.ts                   # 类型声明（模块声明 + Pinia 扩展）
├── types/                     # TypeScript 类型定义
│   ├── index.ts               # 统一导出
│   ├── book.ts                # 图书/分类/分页类型
│   ├── user.ts                # 用户/登录/注册类型
│   ├── borrow.ts              # 借阅/续借类型
│   └── api.ts                 # API 响应类型
├── api/                       # API 接口层（.ts，保留所有原有函数）
│   ├── user.ts                # 21 个用户相关接口
│   ├── book.ts                # 10 个图书相关接口
│   ├── borrow.ts              # 8 个借阅相关接口
│   └── bookCategory.ts        # 4 个分类 CRUD 接口
├── stores/                    # Pinia 状态管理（持久化）
│   ├── token.ts               # JWT Token
│   ├── user.ts                # 用户信息 { username, type, state, ... }
│   └── theme.ts               # 主题模式（light/dark/system）
├── utils/
│   ├── request.ts             # Axios 实例（拦截器：Token 注入 + 401 跳转）
│   └── zxing.js               # ZXing 扫码库（328KB pre-built）
├── composables/               # 共享组合式函数
│   ├── useTheme.ts            # 主题切换
│   ├── useResponsive.ts       # 响应式断点检测
│   ├── usePagination.ts       # 分页逻辑
│   └── useBookList.ts         # 图书搜索 + 列表逻辑
├── components/
│   ├── layout/                # 布局组件
│   │   ├── AppLayout.vue      # 统一布局（根据角色自适应）
│   │   ├── AppSidebar.vue     # 侧边导航栏（管理员）
│   │   ├── AppNavbar.vue      # 顶部导航栏
│   │   ├── AppUserDropdown.vue # 用户头像下拉菜单
│   │   ├── AppThemeToggle.vue # 浅色/深色切换按钮
│   │   └── AppFooter.vue      # 页脚
│   ├── common/                # 通用组件
│   │   ├── AppPageHeader.vue  # 页面标题 + 操作按钮
│   │   ├── AppConfirmDialog.vue # 确认对话框
│   │   ├── AppEmptyState.vue  # 空状态占位
│   │   ├── AppLoadingState.vue # 加载骨架屏
│   │   ├── AppPagination.vue  # 分页条
│   │   ├── AppSearchBar.vue   # 搜索栏（书名/分类/状态筛选）
│   │   └── AppStatCard.vue   # 统计卡片
│   ├── auth/                  # 认证组件
│   │   ├── LoginForm.vue      # 登录表单
│   │   ├── RegisterForm.vue   # 注册表单
│   │   └── ForgotPasswordForm.vue # 忘记密码表单
│   └── book/                  # 图书组件
│       ├── BookDetailDrawer.vue  # 图书详情抽屉
│       ├── BookBorrowDialog.vue  # 借阅确认对话框
│       ├── BookEditDrawer.vue    # 添加/编辑图书抽屉
│       └── BookScanner.vue       # ISBN 摄像头扫码组件
├── views/                     # 页面视图
│   ├── HomeView.vue           # 首页/工作台（角色自适应）
│   ├── SearchView.vue         # 馆藏检索（列表/卡片视图 + 访客模式）
│   ├── BookDetailView.vue     # 图书详情独立页
│   ├── LoginView.vue          # 登录/注册/忘记密码（粒子背景）
│   ├── RegisterView.vue       # 独立注册页
│   ├── NotFoundView.vue       # 404 页面
│   ├── RenewView.vue          # 续借操作页
│   ├── ReserveView.vue        # 预约到馆取书页
│   ├── NotificationView.vue   # 消息通知中心
│   ├── SettingsView.vue       # 设置页（资料/头像/密码/主题）
│   ├── user/                  # 用户中心（嵌套路由）
│   │   ├── UserLayout.vue     # Tab 导航
│   │   ├── BorrowingListView.vue  # 当前借阅
│   │   ├── BorrowingHistoryView.vue # 借阅历史
│   │   ├── OverdueView.vue    # 逾期记录
│   │   ├── WishListView.vue   # 个人书单（预留）
│   │   └── ReservationListView.vue # 我的预约（预留）
│   └── admin/                 # 管理员页面
│       ├── BookManageView.vue # 图书 CRUD 管理
│       ├── CategoryManageView.vue # 分类管理
│       ├── BorrowManageView.vue # 借阅记录管理
│       ├── RenewalManageView.vue # 续借审批
│       └── UserManageView.vue # 用户管理
├── router/index.ts            # 路由配置（懒加载 + 权限守卫）
└── assets/
    ├── styles/                # 全局样式
    │   ├── variables.css      # CSS 自定义属性（浅色/深色主题）
    │   ├── reset.css          # CSS Reset
    │   ├── typography.css     # 字体排版
    │   └── transitions.css    # 页面/组件过渡动画
    └── *.jpg/png              # 图片资源
```

### 四、路由设计

| 路径 | 名称 | 组件 | 权限 |
|------|------|------|------|
| `/auth/login` | Login | LoginView | 游客 |
| `/auth/register` | Register | RegisterView | 游客 |
| `/search` | Search | SearchView | 公开 |
| `/book/:id` | BookDetail | BookDetailView | 公开 |
| `/` → `/home` | Home | HomeView | 需登录 |
| `/user/borrowing` | BorrowingList | BorrowingListView | 需登录 |
| `/user/history` | BorrowingHistory | BorrowingHistoryView | 需登录 |
| `/user/overdue` | Overdue | OverdueView | 需登录 |
| `/user/wishlist` | Wishlist | WishListView | 需登录 |
| `/user/reservations` | Reservations | ReservationListView | 需登录 |
| `/renew/:borrowId?` | Renew | RenewView | 需登录 |
| `/reserve/:bookId?` | Reserve | ReserveView | 需登录 |
| `/notifications` | Notifications | NotificationView | 需登录 |
| `/settings` | Settings | SettingsView | 需登录 |
| `/admin/books` | BookManage | BookManageView | 需管理员 |
| `/admin/categories` | CategoryManage | CategoryManageView | 需管理员 |
| `/admin/borrows` | BorrowManage | BorrowManageView | 需管理员 |
| `/admin/renewals` | RenewalManage | RenewalManageView | 需管理员 |
| `/admin/users` | UserManage | UserManageView | 需管理员 |
| `/*` | NotFound | NotFoundView | 公开 |

旧路由自动重定向：`/login`→`/auth/login`，`/dashshow`→`/home`，`/visiter`→`/search` 等

### 五、主题系统

- CSS 自定义属性定义于 `variables.css`，覆盖所有颜色/阴影/间距
- 深色模式通过 `[data-theme="dark"]` 选择器切换
- `useThemeStore` 管理三种模式：浅色 / 深色 / 跟随系统
- Element Plus 暗色 CSS 变量通过 `element-plus/theme-chalk/dark/css-vars.css` 集成
- 主题状态持久化到 localStorage



### 六、运行方式

```bash
npm install
npm run dev      # 开发服务器（--host 局域网访问）
npm run build    # 生产构建
npm run type-check # TypeScript 类型检查
```

开发服务器通过 Vite proxy 将 `/api` 代理到 `http://localhost:8080`。
