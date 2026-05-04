# BookSys V3.0 新功能接口文档

> 新增功能：AI 智能荐书伴侣 / 图书内容智能标签
> 基准地址：`http://localhost:8080` | 认证方式：Header `Authorization: <token>`

---

## 一、AI 智能荐书伴侣

### 1.1 功能概述

读者通过自然语言对话描述阅读需求，系统基于**借阅历史 + 候选书库 + 百度ERNIE大模型**生成个性化推荐。每次推荐输出 3-5 本图书及理由。

### 1.2 接口

```
POST /ai/chat/recommend
认证: 需要
Content-Type: application/x-www-form-urlencoded
```

### 1.3 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | **是** | — | 用户自然语言提问（≤500字）。如"我最近想看一些关于微服务架构但适合零基础的书" |
| model | string | 否 | `ernie_speed` | 模型名称，可选 `ernie_speed` / `ernie_bot` / `ernie_4_0` |

### 1.4 输入校验规则

- 不允许为空或超过 500 字
- 不允许包含政治、色情等违规词
- 内容需与书籍/阅读/学习相关

**校验失败** → `{ "code": 1, "message": "请输入与图书推荐相关的内容" }`

### 1.5 成功响应


```json
{
  "code": 0,
  "message": "操作成功",
  "data": "### 推荐图书\n\n**1. 《Spring微服务实战》**\n推荐理由：本书从零开始介绍微服务架构，适合初学者..."
}
```

> `data` 为 Markdown 格式文本，前端可直接渲染

### 1.6 失败响应

| code | message | 原因 |
|------|---------|------|
| 1 | 请输入与图书推荐相关的内容 | 输入校验不通过 |
| 1 | AI服务暂时不可用，请稍后重试 | 网络超时/服务异常 |
| 1 | AI响应解析失败 | 模型返回格式异常 |

### 1.7 调用示例

```js
const formData = new URLSearchParams();
formData.append('query', '推荐几本Java入门书');
formData.append('model', 'ernie_speed');

fetch('http://localhost:8080/ai/chat/recommend', {
  method: 'POST',
  headers: {
    'Authorization': token,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: formData
})
  .then(res => res.json())
  .then(data => {
    // data.data 为 Markdown 格式推荐内容
    renderMarkdown(data.data);
  });
```

### 1.8 AI 调用监控

```
GET /ai/stats
认证: 需要
```

**响应**：
```json
{
  "code": 0,
  "data": {
    "successCount": 150,
    "failedCount": 3,
    "avgResponseTimeMs": 1200.5,
    "recentCalls": [
      {
        "id": 1, "userId": 1, "model": "ernie_speed",
        "operation": "recommend", "status": 0,
        "responseTimeMs": 1100, "createTime": "2026-05-04 10:30:00"
      }
    ]
  }
}
```

---

## 二、图书内容智能标签

### 2.1 功能概述

管理员新增图书时，系统自动调用 AI 提取 3-5 个核心关键词作为标签。前端可用标签进行多维度交叉筛选。

### 2.2 数据模型变更

`Article` 实体新增 `tags` 字段（VARCHAR），存储逗号分隔的标签，如 `"Java,微服务,进阶,架构"`。

### 2.3 新增接口

#### 获取全部标签（标签云）

```
GET /article/allTags
认证: 不需要
```

**响应**：
```json
{
  "code": 0,
  "data": ["Java", "微服务", "架构", "入门", "进阶", "文学", "历史", "哲学"]
}
```

> 返回全库所有已提取的标签，去重排序，供前端渲染标签云/筛选按钮

### 2.4 修改接口

#### 图书列表 — 增加标签筛选

```
GET /article/getBookList
认证: 不需要
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | int | 是 | 页码 |
| pageSize | int | 是 | 每页条数 |
| categoryId | string | 否 | 按分类筛选 |
| state | string | 否 | 按状态筛选 |
| title | string | 否 | 按书名模糊搜索 |
| **tag** | string | 否 | **【新增】** 单个标签筛选，如 `tag=Java` |
| **tags** | string | 否 | **【新增】** 多标签筛选（OR 逻辑），逗号分隔。如 `tags=Java,架构` |

**示例**：
```
GET /article/getBookList?pageNum=1&pageSize=10&tags=Java,入门
```
→ 返回标签中包含 "Java" **或** "入门" 的图书

#### 新增图书 — 自动提取标签

```
POST /article
认证: 需要
Content-Type: application/json
```

**请求体新增字段**：
```json
{
  "title": "Spring微服务实战",
  "content": "本书系统介绍...",
  "coverImg": "https://...",
  "state": "可借阅",
  "categoryId": 4,
  "location": "A-04-01",
  "bookNum": 100010,
  "publisher": "人民邮电出版社",
  "isbn": "9787115546081",
  "tags": "Java,Spring,微服务,架构,入门"
}
```

> `tags` 字段：管理员可手动指定标签，也可留空让系统异步提取

#### AI 图书简介 — 增加模型参数

```
GET /article/getBookContent
认证: 需要
```

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| bookName | string | 是 | — | 书名 |
| bookNum | string | 是 | — | ISBN |
| **model** | string | 否 | `ernie_speed` | **【新增】** 模型名称 |

---

## 三、ChineseGPT 扩展方法

### 3.1 通用对话方法

```java
String chat(String systemPrompt, String userContent, String model)
```

- `systemPrompt`：系统角色定义
- `userContent`：用户输入内容
- `model`：模型名称（可空，默认 `ernie_speed`）

### 3.2 标签提取方法

```java
String extractTags(String bookTitle, String content, String model)
```

**输出示例**：`"Java,Spring Boot,微服务,入门"`

### 3.3 智能荐书方法

```java
String recommend(String userQuery, String history, String candidates, String model)
```

### 3.4 可用模型列表

| 模型名称 | 说明 |
|----------|------|
| `ernie_speed` | 默认，速度快 |
| `ernie_bot` | 标准版 |
| `ernie_4_0` | 旗舰版（需开通） |

---

## 四、AI 调用日志（ai_call_log）

所有 AI 接口调用自动记录到 `ai_call_log` 表：

| 字段 | 说明 |
|------|------|
| userId | 调用用户 ID |
| model | 模型名称 |
| operation | `recommend` / `extractTags` / `genDescription` |
| status | 0=成功, 1=失败, 2=超时 |
| responseTimeMs | 响应耗时 |
| inputSummary | 输入摘要（截断 200 字） |
| outputSummary | 输出摘要（截断 200 字） |
| errorMsg | 错误信息 |

---

## 五、前端对接要点

### 5.1 AI 荐书对话框

```jsx
// 推荐对话框
function AiRecommendDialog() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRecommend() {
    setLoading(true);
    const params = new URLSearchParams({ query, model: 'ernie_speed' });
    const res = await fetch('/ai/chat/recommend', {
      method: 'POST',
      headers: { 'Authorization': token, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params
    });
    const data = await res.json();
    if (data.code === 0) {
      setResult(data.data);  // Markdown，用 marked/markdown-it 渲染
    } else {
      alert(data.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)}
             placeholder="描述你想看的书，如：适合零基础的微服务入门书" />
      <button onClick={handleRecommend} disabled={loading}>
        {loading ? 'AI 思考中...' : '智能推荐'}
      </button>
      <div dangerouslySetInnerHTML={{ __html: marked(result) }} />
    </div>
  );
}
```

### 5.2 标签筛选联动

```jsx
// 1. 加载全部标签
const [allTags, setAllTags] = useState([]);
const [selectedTags, setSelectedTags] = useState([]);

useEffect(() => {
  fetch('/article/allTags')
    .then(r => r.json())
    .then(d => setAllTags(d.data));
}, []);

// 2. 标签点击切换
function toggleTag(tag) {
  setSelectedTags(prev =>
    prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
  );
}

// 3. 带标签参数查询图书
const tagsParam = selectedTags.join(',');
fetch(`/article/getBookList?pageNum=1&pageSize=10&tags=${tagsParam}`)
```

### 5.3 新增图书时提示 AI 标签

```jsx
// 新增图书时可手动填标签，或提示"留空将自动提取"
<div>
  <label>标签（逗号分隔，留空则由AI自动提取）</label>
  <input name="tags" placeholder="如 Java,入门,微服务" />
</div>
```

---

## 六、数据库变更摘要

执行 `src/main/resources/db/init.sql` 即可。

| 变更 | 说明 |
|------|------|
| `article` 表新增 `tags VARCHAR(256)` | AI 提取的标签，逗号分隔 |
| 新增 `ai_call_log` 表 | AI 调用监控日志 |
