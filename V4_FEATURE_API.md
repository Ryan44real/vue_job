# BookSys V4.0 新功能接口文档

> 新增功能：图书评分与短评 / 个人阅读账单与成就系统
> 基准地址：`http://localhost:8080` | 认证：Header `Authorization: <token>`

---

## 一、图书评分与短评系统

### 1.1 业务规则

| 规则 | 说明 |
|------|------|
| 评价资格 | 仅限有实际借阅记录且**已归还**的读者 |
| 防刷机制 | 同一本书每人只能评价一次 |
| 信用奖励 | 评论字数 > 20 自动获得 **+1 信用分** |
| 评分范围 | 1-5 星 |
| 审核机制 | 默认自动通过（status=1），管理员可拒绝违规评论 |

### 1.2 数据模型

```typescript
interface Comment {
  id: number;           // bigint
  userId: number;
  username: string;     // 查询时填充
  userPic: string;      // 查询时填充
  bookNum: number;
  bookName: string;     // 查询时填充
  rating: number;       // 1-5
  content: string;      // 评论文本
  status: number;       // 0=待审核, 1=已通过, 2=已拒绝
  createTime: string;   // "yyyy-MM-dd HH:mm:ss"
}
```

### 1.3 接口清单

#### 提交评论

```
POST /comment/add
认证: 需要
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bookNum | int | 是 | 图书编号 |
| rating | int | 是 | 评分 1-5 |
| content | string | 是 | 评论内容 |

**失败**：
| message | 原因 |
|---------|------|
| 您尚未借阅并归还此书，无法评价 | 无借阅记录 |
| 您已评价过此书 | 重复评价 |

---

#### 获取图书评论

```
GET /comment/book?bookNum=100001
认证: 不需要
```

**响应 data**：`List<Comment>`，按时间倒序

---

#### 获取图书评分

```
GET /comment/rating?bookNum=100001
认证: 不需要
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "avgRating": 4.2,
    "commentCount": 15
  }
}
```

---

#### 我的评论

```
GET /comment/my
认证: 需要
```

---

#### 审核评论（管理员）

```
PUT /comment/review?id=1&status=2
认证: 需要（管理员）
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | long | 是 | 评论ID |
| status | int | 是 | 1=通过, 2=拒绝 |

---

#### 待审核评论（管理员）

```
GET /comment/pending
认证: 需要（管理员）
```

---

## 二、个人阅读账单与成就系统

### 2.1 成就勋章定义

| 编码 | 名称 | 条件 |
|------|------|------|
| `READER_NOVICE` | 入门读者 | 累计借阅 ≥ 5 本 |
| `BOOK_WORM` | 超级书虫 | 累计借阅 ≥ 20 本 |
| `READING_STAR` | 阅读之星 | 累计借阅 ≥ 50 本 |

> 成就检查在读者**归还图书时自动触发**，不阻塞归还流程。每个成就仅授予一次。

### 2.2 数据模型

```typescript
interface UserAchievement {
  id: number;
  userId: number;
  achievementCode: string;   // READER_NOVICE / BOOK_WORM / READING_STAR
  achievementName: string;    // 入门读者 / 超级书虫 / 阅读之星
  achievementDesc: string;    // 描述
  achieveTime: string;        // "yyyy-MM-dd HH:mm:ss"
}
```

### 2.3 接口清单

#### 个人阅读面板

```
GET /dashboard/my
认证: 需要
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "totalBorrowed": 12,
    "currentlyBorrowing": 2,
    "overdueCount": 0,
    "last30Days": 3,
    "prev30Days": 5,
    "trend": "DOWN",
    "creditScore": 105,
    "badges": [
      {
        "id": 1,
        "achievementCode": "READER_NOVICE",
        "achievementName": "入门读者",
        "achievementDesc": "累计借阅 5 本图书，开启阅读之旅！",
        "achieveTime": "2026-04-15 10:30:00"
      }
    ]
  }
}
```

| 字段 | 说明 |
|------|------|
| totalBorrowed | 累计借阅数 |
| currentlyBorrowing | 当前在借数 |
| overdueCount | 逾期次数 |
| last30Days | 过去30天借阅数 |
| prev30Days | 前30天借阅数 |
| trend | UP(上升) / DOWN(下降) |
| creditScore | 当前信用分 |
| badges | 已获得勋章列表 |

---

#### 我的勋章

```
GET /dashboard/badges
认证: 需要
```

---

#### 月度阅读之星排行

```
GET /dashboard/leaderboard
认证: 不需要
```

**响应**：
```json
{
  "code": 0,
  "data": [
    { "userId": 1, "username": "admin", "borrowCount": 8 },
    { "userId": 2, "username": "reader01", "borrowCount": 5 }
  ]
}
```

> 本月借阅量前 10 名

---

## 三、现有接口增强

### 3.1 图书详情 — 新增评分信息

```
GET /article/detail?id=1
认证: 需要
```

**响应变更**：原来直接返回 `Article`，现在返回：
```json
{
  "code": 0,
  "data": {
    "article": { ... },
    "avgRating": 4.2,
    "commentCount": 15
  }
}
```

### 3.2 图书列表 — 新增排序参数

```
GET /article/getBookList
认证: 不需要
```

**新增参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| sortBy | string | `rating_desc`(评分最高优先) / `rating_asc`(评分最低优先) / `popular`(评论最多优先) |

### 3.3 归还图书 — 自动触发成就检查

归还成功后自动调用 `checkAndGrantAchievements()`，达标即授予勋章。

---

## 四、功能融合矩阵

| 融合点 | 实现方式 |
|--------|----------|
| **AI 荐书 + 评论** | 评论内容已有 `CommentService`，可在 AI 荐书的 Prompt 中引入热门评论摘要 |
| **信用系统 + 评论** | 高质量评论（>20字）自动 +1 分，调用 `CreditService.addReview()` |
| **定时任务 + 账单** | 每月1号 9:00 发送阅读简报邮件，调用 `DashboardService.getDashboard()` |
| **图书检索 + 评分** | `getBookList` 支持 `sortBy=rating_desc`，按评分排序 |
| **用户资料 + 勋章** | `/dashboard/badges` 返回勋章列表，前端可渲染到头像旁 |

---

## 五、数据库变更

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `comment` | 图书评论 | user_id + book_num 唯一，rating 1-5 |
| `user_achievement` | 用户成就 | user_id + achievement_code 唯一 |

---

## 六、前端对接清单

### 6.1 归还后弹出评价

```jsx
// 归还成功后
async function onReturnSuccess(bookNum) {
  showDialog('是否评价此书？', async () => {
    await fetch('/comment/add', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `bookNum=${bookNum}&rating=${rating}&content=${content}`
    });
  });
}
```

### 6.2 个人中心面板

```jsx
// 加载个人面板
useEffect(() => {
  fetch('/dashboard/my', { headers: { 'Authorization': token } })
    .then(r => r.json())
    .then(d => {
      setDashboard(d.data);  // { totalBorrowed, badges, creditScore, ... }
    });
}, []);
```

### 6.3 图书详情评分展示

```jsx
// 调用 /article/detail 获取 article + avgRating + commentCount
// 调用 /comment/book?bookNum=xxx 获取评论列表
// 星级渲染：avgRating 转换为 ★★★★★
```

### 6.4 评分排序

```jsx
// 图书列表页添加排序下拉
<select onChange={e => setSortBy(e.target.value)}>
  <option value="">默认排序</option>
  <option value="rating_desc">评分最高</option>
  <option value="popular">最受欢迎</option>
</select>
// 请求带上 &sortBy=rating_desc
```
