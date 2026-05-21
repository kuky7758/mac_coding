# 轻语（Vue 3 + Pinia 版）— 设计规格

## 项目概述

将现有纯 HTML+CSS+JS 实现的轻语应用，迁移至 Node.js + Vue 3 + Pinia 技术栈。功能范围保持不变，开发过程采用 TDD（测试驱动开发）。数据仍使用 Local Storage 持久化。

## 功能范围

**包含（与原项目完全一致）：**
- 匿名发布纯文字内容（最多 280 字）
- 按时间倒序浏览已发布内容
- 实时字数统计
- 空状态提示
- 数据刷新后保留（Local Storage）

**明确不包含：**
- 用户身份/登录/注册
- 图片、链接、富文本
- 删除、编辑已发布内容
- 点赞、评论、转发
- 后端服务

## 技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Vue 3（Composition API + `<script setup>`） |
| 状态管理 | Pinia（Composition API 风格） |
| 构建工具 | Vite |
| 测试框架 | Vitest |
| 组件测试 | @vue/test-utils + happy-dom |
| 样式 | 纯 CSS（`<style scoped>` + 全局 `style.css`） |
| 数据存储 | Local Storage API |
| 版本管理 | Git |

## 文件结构

```
mac_coding/
├── public/
├── src/
│   ├── components/
│   │   ├── PostForm.vue          # 输入表单
│   │   └── PostList.vue          # 时间线列表
│   ├── stores/
│   │   └── postStore.js          # Pinia store
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 入口
│   └── style.css                 # 全局样式
├── src/stores/__tests__/
│   └── postStore.spec.js         # Store 测试
├── src/components/__tests__/
│   ├── PostForm.spec.js          # 表单组件测试
│   └── PostList.spec.js          # 列表组件测试
├── index.html                    # Vite HTML 入口
├── package.json
├── vite.config.js
├── vitest.config.js
├── CLAUDE.md
└── .gitignore
```

## Pinia Store 设计

`src/stores/postStore.js`

- **State:** `posts`（`ref([])`）帖子数组
- **Getters:**
  - `sortedPosts`（`computed`）按 `timestamp` 降序排列的副本
  - `isEmpty`（`computed`）判断是否无帖子
- **Actions:**
  - `loadFromStorage()` 从 Local Storage 读取并解析到 `posts`
  - `saveToStorage()` 将 `posts` 序列化写入 Local Storage，返回布尔值
  - `publishPost(content)` 校验非空 → 组装新帖子 → `posts.value.push()` → 调用 `saveToStorage()` → 失败时 `pop()` 回滚 → 返回布尔值
- **初始化:** store 创建时自动调用 `loadFromStorage()`

## 组件设计

### `App.vue`

- 职责：页面布局容器，引入 `PostForm` 和 `PostList`
- 无本地状态，无逻辑
- 模板：`.container` > `.header` + `<PostForm />` + `<PostList />`

### `PostForm.vue`

- 职责：内容输入、字数统计、发布触发
- 本地状态：
  - `inputContent`（`ref('')`）textarea 双向绑定
  - `isPublishing`（`ref(false)`）发布中锁
- 计算属性：
  - `charCount` 当前字数
  - `isOverLimit` 是否超出 280 字
- 方法：`handlePublish()` 加锁 → 调用 `store.publishPost()` → 成功则清空输入框 → 释放锁

### `PostList.vue`

- 职责：帖子列表渲染、空状态展示
- 无本地状态，完全依赖 store
- 使用 `v-if="store.isEmpty"` 展示空状态
- 使用 `v-for="post in store.sortedPosts"` 渲染卡片
- 内置 `formatTime()` 工具函数，格式 `YYYY-MM-DD HH:mm:ss`

## 数据流

```
用户输入 ──→ PostForm.vue ──→ store.publishPost() ──→ state.posts
                                             │                │
                                             ↓                ↓
                                        saveToStorage() ←── sortedPosts
                                             │                │
                                             ↓                ↓
                                      Local Storage      PostList.vue
```

1. 用户在 `PostForm` 输入内容，点击发布
2. `PostForm` 调用 `store.publishPost(content)`
3. Store 更新 `posts` 状态，写入 Local Storage
4. `PostList` 通过 `sortedPosts` getter 自动响应式更新，重新渲染列表

## 测试策略（TDD）

### 测试顺序

1. **先写 `postStore.spec.js`**（所有测试先失败）
2. **实现 `postStore.js`** 让测试通过
3. **先写 `PostList.spec.js`**（所有测试先失败）
4. **实现 `PostList.vue`** 让测试通过
5. **先写 `PostForm.spec.js`**（所有测试先失败）
6. **实现 `PostForm.vue`** 让测试通过
7. **集成 `App.vue`**，运行全部测试确认通过

### Store 测试覆盖

- 初始状态为空数组
- `publishPost` 保存帖子到 state 和 localStorage
- `publishPost` 空内容返回 false
- `sortedPosts` 按时间倒序排列
- `loadFromStorage` 从 localStorage 恢复数据
- `saveToStorage` 失败时回滚 state

### 组件测试覆盖

**PostForm:**
- 渲染输入框和发布按钮
- 输入内容后点击发布，清空输入框
- 字数统计实时更新
- 空内容点击发布不提交

**PostList:**
- 无帖子时显示空状态
- 有帖子时渲染卡片列表
- 卡片显示内容和时间

## 构建配置

**`vite.config.js`:** 注册 `@vitejs/plugin-vue`

**`vitest.config.js`:** 继承 Vite 配置，`environment: 'happy-dom'`，`globals: true`

**`package.json` scripts:**
- `dev`: `vite`
- `build`: `vite build`
- `test`: `vitest`

## 样式迁移策略

原 `index.html` 中的内嵌 CSS 按职责拆分：
- 全局基础样式（body、container）→ `src/style.css`
- 组件特有样式（input-card、post-card 等）→ 各自组件的 `<style scoped>`
- 保持原视觉风格不变

## 验收标准

1. `npm install` 后 `npm run dev` 可正常启动开发服务器
2. `npm test` 全部测试通过
3. 浏览器中功能与原项目一致（发布、浏览、刷新保留、字数统计、空状态）
4. Git 提交历史清晰，推送到远程仓库
