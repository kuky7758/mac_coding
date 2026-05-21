# 轻语 API 契约

> 前后端并行开发的共同基线。任何变更需双方协商。

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **必需 Header**: `X-Anonymous-Id: <uuid>`（前端生成并存储于 localStorage，键名 `qingyu_anonymous_id`）

## 数据模型

### Post

```json
{
  "id": 1,
  "content": "帖子内容",
  "timestamp": 1716280000000,
  "likeCount": 5,
  "favoriteCount": 2,
  "hasLiked": true,
  "hasFavorited": false
}
```

## 接口列表

### GET /api/posts

获取所有帖子列表，按时间倒序排列，包含当前匿名用户的互动状态。

**Response 200:**

```json
{
  "posts": [
    {
      "id": 1,
      "content": "Hello world",
      "timestamp": 1716280000000,
      "likeCount": 5,
      "favoriteCount": 2,
      "hasLiked": true,
      "hasFavorited": false
    }
  ]
}
```

### POST /api/posts

发布新帖子。

**Request:**

```json
{ "content": "Hello world" }
```

**Response 201:**

```json
{
  "id": 2,
  "content": "Hello world",
  "timestamp": 1716280001000,
  "likeCount": 0,
  "favoriteCount": 0,
  "hasLiked": false,
  "hasFavorited": false
}
```

**Response 400:**

```json
{ "error": "Content is required" }
```

### POST /api/posts/:id/like

点赞帖子。幂等（重复点赞返回 200，不报错）。

**Response 200:**

```json
{ "likeCount": 6, "hasLiked": true }
```

**Response 404:**

```json
{ "error": "Post not found" }
```

### DELETE /api/posts/:id/like

取消点赞。幂等。

**Response 200:**

```json
{ "likeCount": 5, "hasLiked": false }
```

### POST /api/posts/:id/favorite

收藏帖子。幂等。

**Response 200:**

```json
{ "favoriteCount": 3, "hasFavorited": true }
```

### DELETE /api/posts/:id/favorite

取消收藏。幂等。

**Response 200:**

```json
{ "favoriteCount": 2, "hasFavorited": false }
```

## 匿名用户标识

前端在首次加载时通过 `crypto.randomUUID()` 生成 UUID，存入 `localStorage`（键名 `qingyu_anonymous_id`）。此后每个 API 请求必须在 Header 中携带该 UUID。后端以此区分不同匿名用户，统计其个人点赞/收藏状态。

## 存储说明

后端使用**内存存储**（非持久化）。服务器重启后所有数据清空。
