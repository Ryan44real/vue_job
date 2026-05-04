项目总结文档：vue_job —— 图书数字化管理系统
一、项目概述
这是一个基于 Vue 3 + TypeScript + Vite 构建的图书数字化管理系统前端项目。系统面向两类用户角色：管理员（type=1）和普通用户（type=2），提供图书管理、借阅管理、用户管理等功能，配有登录认证、动态粒子背景、摄像头扫码识别 ISBN、二维码生成、AI 智能总结书籍简介等特色功能。

二、技术栈
类别	技术
框架	Vue 3.4（Composition API + <script setup>）
语言	TypeScript
构建工具	Vite 5
路由	Vue Router 4
状态管理	Pinia 2 + pinia-persistedstate-plugin（持久化）
UI 组件库	Element Plus 2.6
HTTP 客户端	Axios
图表	ECharts 5
富文本编辑器	@vueup/vue-quill
条码/二维码	@zxing/library（摄像头扫码）、Quagga
粒子背景	particles.vue3 / tsparticles
CSS 预处理	Sass
三、项目架构

src/
├── main.ts                    # 入口文件，注册 Pinia/Router/ElementPlus/Particles
├── App.vue                    # 根组件，仅包含 <router-view>
├── router/index.ts            # 路由配置（两个父路由：Layout 和 MyLayout）
├── api/                       # API 接口层
│   ├── user.js                # 用户相关（登录/注册/信息/管理）
│   ├── book.js                # 书籍相关（CRUD/ISBN/条码/二维码/AI）
│   ├── borrow.js              # 借阅相关（借书/还书/续借/记录）
│   └── bookCategory.js        # 图书分类 CRUD
├── stores/                    # Pinia 状态管理
│   ├── token.js               # JWT Token 持久化存储
│   ├── user.js                # 用户信息持久化存储
│   └── counter.ts             # 示例 store（未使用）
├── utils/
│   ├── request.js             # Axios 实例（拦截器：注入 Token/401 跳转/错误提示）
│   └── zxing.js               # 摄像头扫码工具
├── components/
│   └── Header.vue             # 头部组件（空文件）
├── assets/                    # 图片/样式资源
└── views/
    ├── Login.vue              # 登录/注册/忘记密码（含粒子背景动画）
    ├── Layout.vue             # 管理员布局（侧边栏 + 顶栏 + 主区域）
    ├── MyLayout.vue           # 普通用户布局（水平导航条 + 主区域）
    ├── DashShow.vue           # 仪表盘首页（统计数据 + 轮播图 + 通知弹窗）
    ├── article/
    │   ├── ArticleCategory.vue # 图书分类管理（增删改）
    │   └── ArticleManage.vue   # 书籍管理（增删改查 + 摄像头扫码 + AI总结 + 二维码生成）
    ├── borrow/
    │   ├── BorrowBooks.vue     # 用户端：找书借书（搜索 + 借阅）
    │   ├── MyborrowRecord.vue  # 用户端：我的借阅（还书 + 续借申请 + 扫码还书）
    │   ├── BorrowRecordManage.vue # 管理员端：借阅记录管理（编辑/催促还书）
    │   └── RenewalManage.vue   # 管理员端：续借审批（查看用户信息 + 通过/拒绝）
    ├── user/
    │   ├── UserInfo.vue        # 基本资料修改（昵称/邮箱）
    │   ├── UserAvatar.vue      # 头像上传
    │   ├── UserResetPassword.vue # 修改密码
    │   └── UserManage.vue      # 用户管理（搜索/添加/编辑/禁止借书/删除）
    └── userpage/               # 普通用户页面
        ├── userMain.vue        # 普通用户首页（统计数据 + 轮播图 + 通知）
        ├── visiter.vue         # 访客页面（未登录也可浏览图书 + 提示去登录）
        ├── Test.vue            # 摄像头扫码组件（基于 @zxing/library）
        ├── photoTest.vue       # 摄像头拍照 + 调用 barcode 识别接口
        ├── photoTest1.vue      # （未路由引用）
        ├── Qrcore.vue          # 扫码核心组件（带扫描动画）
        └── QR2.vue             # （未路由引用）
四、路由设计
路由路径	组件	所属布局	说明
/login	Login	独立	登录/注册/忘记密码
/visiter	visiter	独立	访客图书查询页
/Test	Test	独立	摄像头扫码测试
/	redirect→DashShow	Layout	管理员首页
/dashshow	DashShow	Layout	仪表盘
/article/category	ArticleCategory	Layout	图书分类管理
/article/manage	ArticleManage	Layout	书籍管理
/borrow/borrowRecordManage	BorrowRecordManage	Layout	借阅记录管理
/borrow/RenewalManage	RenewalManage	Layout	续借审批
/user/UserManage	UserManage	Layout	用户管理
/user/info	UserInfo	Layout	基本资料
/user/avatar	UserAvatar	Layout	更换头像
/user/resetPassword	UserResetPassword	Layout	重置密码
/MyLayout	redirect→userMain	MyLayout	普通用户首页
/userMain	userMain	MyLayout	用户仪表盘
/borrow/borrowBook	BorrowBooks	MyLayout	找书借书
/borrow/Myborrow	MyborrowRecord	MyLayout	我的借阅
/user/in	UserInfo	MyLayout	基本资料
/user/ava	UserAvatar	MyLayout	更换头像
/user/resetPSW	UserResetPassword	MyLayout	修改密码
/photoTest	photoTest	MyLayout	摄像头测试


五、核心业务功能
认证系统：JWT Token 机制，登录后 token 存储于 Pinia 并持久化，axios 拦截器自动携带；401 响应自动跳转登录页
用户角色：管理员（type=1）拥有管理后台；普通用户（type=2）拥有用户端；两种布局互不交叉
图书管理：书籍 CRUD、分类管理、封面图片上传、富文本编辑简介、ISBN 条码扫描识别（浏览器摄像头）、根据 ISBN 生成二维码和内部书号
AI 智能总结：调用后端 /article/getBookContent 接口，通过书名和 ISBN 获取 AI 生成的内容简介
借阅管理：用户借书（选择7/14/30天）、扫码还书（摄像头识别 ISBN）、续借申请、管理员审批续借（查看逾期次数/借阅次数）、编辑借阅记录、逾期交钱、催促还书
用户管理：添加用户、编辑用户信息、禁止/解禁借书权限、删除用户、邮件验证码
六、前后端交互
通过 Vite proxy 代理 /api 到 http://localhost:8080，并自动重写前缀
Axios 封装了统一的响应拦截（code !== 0 提示异常，401 跳转登录）和请求拦截（自动携带 Token）
所有 API 请求使用 URLSearchParams 或 JSON 格式传参
七、已知问题/待改进
Header.vue 为空文件，未使用
visiter.vue 中 userInfo 变量未定义导致运行时错误（ref 被注释掉但代码仍在引用）
BorrowBooks.vue 中有 v-if="row.state === '可借阅'" 字符串比较，实际数据来自后端数字，逻辑有误
ArticleManage.vue 中 handleClose 和 Test 组件引用方式不规范（在 <script setup> 中 import 组件但未在 template 中使用）
counter.ts store 未被使用，为脚手架残留
photoTest1.vue、QR2.vue 未被路由引用，为废弃实验代码
多处硬编码图片路径为绝对路径（如 visiter.vue 中 C:\Users\...）
路由命名不规范：如 /user/in 和 /user/info 重复映射同一组件
八、运行方式

npm install
npm run dev      # 启动开发服务器，--host 暴露到局域网
npm run build    # 构建生产版本
启动后默认通过 Vite proxy 代理到 localhost:8080 的后端 Java 服务。