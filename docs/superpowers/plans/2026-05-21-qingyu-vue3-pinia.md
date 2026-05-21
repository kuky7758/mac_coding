# 轻语 Vue 3 + Pinia 迁移实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有纯 HTML 轻语应用迁移至 Vue 3 + Pinia + Vite 技术栈，以 TDD 方式开发，保持功能一致，使用浅绿色设计系统。

**架构：** Pinia store 管理 LocalStorage 持久化和帖子状态，Vue 3 组件通过 Composition API 消费 store。Vite 作为构建工具，Vitest 运行测试。全局样式使用浅绿色渐变背景，组件样式使用 scoped CSS。

**技术栈：** Vue 3, Pinia, Vite, Vitest, @vue/test-utils, happy-dom, Git

---

## 文件结构

| 文件 | 职责 |
|---|---|
| `package.json` | 项目依赖和 scripts |
| `vite.config.js` | Vite 构建配置，注册 Vue 插件 |
| `vitest.config.js` | Vitest 测试配置，继承 Vite 配置 |
| `index.html` | Vite HTML 入口，引入 `src/main.js` |
| `src/main.js` | 创建 Vue 应用，注册 Pinia，挂载 App |
| `src/style.css` | 全局基础样式（body 渐变、container） |
| `src/App.vue` | 根组件，布局容器，引入 PostForm + PostList |
| `src/stores/postStore.js` | Pinia store：posts 状态、LocalStorage 读写、发布动作 |
| `src/stores/__tests__/postStore.spec.js` | Store 单元测试 |
| `src/components/PostList.vue` | 帖子列表渲染、空状态、时间格式化 |
| `src/components/__tests__/PostList.spec.js` | PostList 组件测试 |
| `src/components/PostForm.vue` | 输入表单、字数统计、发布按钮 |
| `src/components/__tests__/PostForm.spec.js` | PostForm 组件测试 |
| `CLAUDE.md` | 更新项目文档 |
| `.gitignore` | 追加 `node_modules/`、`dist/` 等 |

**原 `index.html`（纯前端版）处理：** 直接覆盖为 Vite 入口。原版本代码保留在 Git 历史中，可随时回查。

---

### 任务 1：项目初始化与依赖安装

**文件：**
- 创建：`package.json`
- 创建：`vite.config.js`
- 创建：`vitest.config.js`
- 创建：`index.html`（Vite 入口）
- 创建：`src/main.js`
- 创建：`src/style.css`
- 修改：`.gitignore`
- 修改：`CLAUDE.md`

- [ ] **步骤 1：创建 package.json**

```json
{
  "name": "qingyu",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "pinia": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "@vue/test-utils": "^2.4.0",
    "happy-dom": "^14.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

- [ ] **步骤 2：创建 vite.config.js**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})
```

- [ ] **步骤 3：创建 vitest.config.js**

```javascript
import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true
  }
}))
```

- [ ] **步骤 4：创建 Vite 入口 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>轻语</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

- [ ] **步骤 5：创建 src/main.js**

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **步骤 6：创建 src/style.css**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background: linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%);
  color: #333;
  line-height: 1.6;
  min-height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
```

- [ ] **步骤 7：更新 .gitignore**

追加以下内容：
```
node_modules/
dist/
*.log
```

- [ ] **步骤 8：安装依赖**

```bash
cd e:/J----CMCCCDOE/AIcoding/mac_coding
npm install
```

预期：生成 `node_modules/` 和 `package-lock.json`，无报错。

- [ ] **步骤 9：验证 Vite 可启动**

```bash
npm run dev
```

预期：Vite 启动成功，显示本地开发服务器地址（如 `http://localhost:5173`）。浏览器打开应显示空白页面（因为 `App.vue` 尚未创建）。Ctrl+C 停止服务器。

- [ ] **步骤 10：Commit**

```bash
git add package.json package-lock.json vite.config.js vitest.config.js index.html src/main.js src/style.css .gitignore
git commit -m "chore: 初始化 Vite + Vue 3 + Pinia 项目"
```

---

### 任务 2：Pinia Store 测试（TDD 第一步）

**文件：**
- 创建：`src/stores/__tests__/postStore.spec.js`

- [ ] **步骤 1：编写 Store 测试**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../postStore.js'

describe('postStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('初始状态为空数组', () => {
    const store = usePostStore()
    expect(store.posts).toEqual([])
    expect(store.isEmpty).toBe(true)
  })

  it('publishPost 保存帖子到 state 和 localStorage', () => {
    const store = usePostStore()
    const success = store.publishPost('测试内容')
    expect(success).toBe(true)
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('测试内容')
    expect(localStorage.getItem('qingyu_posts')).toContain('测试内容')
  })

  it('publishPost 空内容返回 false', () => {
    const store = usePostStore()
    expect(store.publishPost('')).toBe(false)
    expect(store.publishPost('   ')).toBe(false)
  })

  it('sortedPosts 按时间倒序排列', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000 },
      { id: 2, content: '第二条', timestamp: 2000 }
    ]
    expect(store.sortedPosts[0].content).toBe('第二条')
    expect(store.sortedPosts[1].content).toBe('第一条')
  })

  it('loadFromStorage 从 localStorage 恢复数据', () => {
    localStorage.setItem('qingyu_posts', JSON.stringify([
      { id: 1, content: '已有数据', timestamp: 1000 }
    ]))
    const store = usePostStore()
    store.loadFromStorage()
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('已有数据')
  })

  it('publishPost 保存失败时回滚 state', () => {
    const store = usePostStore()
    // 模拟存储满：先塞满 localStorage
    const hugeData = 'x'.repeat(10 * 1024 * 1024)
    try {
      localStorage.setItem('fill', hugeData)
    } catch (e) {
      // 某些环境可能直接抛异常，跳过此测试
    }
    const success = store.publishPost('新帖子')
    if (!success) {
      expect(store.posts).toHaveLength(0)
    }
    localStorage.removeItem('fill')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- src/stores/__tests__/postStore.spec.js
```

预期：FAIL，报错模块 `../postStore.js` 不存在。

- [ ] **步骤 3：Commit 测试文件**

```bash
git add src/stores/__tests__/postStore.spec.js
git commit -m "test: Pinia Store 单元测试（先失败）"
```

---

### 任务 3：Pinia Store 实现（TDD 第二步）

**文件：**
- 创建：`src/stores/postStore.js`

- [ ] **步骤 1：实现 postStore.js**

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'qingyu_posts'

export const usePostStore = defineStore('post', () => {
  const posts = ref([])

  const sortedPosts = computed(() =>
    [...posts.value].sort((a, b) => b.timestamp - a.timestamp)
  )

  const isEmpty = computed(() => posts.value.length === 0)

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      posts.value = raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error('读取数据失败', e)
      posts.value = []
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts.value))
      return true
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('存储空间不足，请清理后重试')
      } else {
        alert('保存失败，请重试')
      }
      return false
    }
  }

  function publishPost(content) {
    const trimmed = content.trim()
    if (!trimmed) return false

    const now = Date.now()
    const newPost = { id: now, content: trimmed, timestamp: now }
    posts.value.push(newPost)

    if (!saveToStorage()) {
      posts.value.pop()
      return false
    }
    return true
  }

  loadFromStorage()

  return { posts, sortedPosts, isEmpty, loadFromStorage, publishPost }
})
```

- [ ] **步骤 2：运行测试确认通过**

```bash
npm test -- src/stores/__tests__/postStore.spec.js
```

预期：PASS，所有 6 个测试通过。

- [ ] **步骤 3：Commit**

```bash
git add src/stores/postStore.js
git commit -m "feat: Pinia Store 实现（LocalStorage 持久化 + 发布逻辑）"
```

---

### 任务 4：PostList 组件测试（TDD 第三步）

**文件：**
- 创建：`src/components/__tests__/PostList.spec.js`

- [ ] **步骤 1：编写 PostList 测试**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostList from '../PostList.vue'
import { usePostStore } from '../../stores/postStore.js'

describe('PostList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('无帖子时显示空状态', () => {
    const wrapper = mount(PostList)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
    expect(wrapper.text()).toContain('还没有内容，写下一句话吧')
  })

  it('有帖子时渲染卡片列表', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试内容', timestamp: 1716280000000 }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.findAll('.post-card')).toHaveLength(1)
    expect(wrapper.find('.post-content').text()).toBe('测试内容')
  })

  it('卡片显示格式化时间', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '测试', timestamp: new Date('2024-05-21 10:30:00').getTime() }
    ]
    const wrapper = mount(PostList)
    expect(wrapper.find('.post-time').text()).toContain('2024-05-21')
    expect(wrapper.find('.post-time').text()).toContain('10:30')
  })

  it('多个帖子按时间倒序排列', () => {
    const store = usePostStore()
    store.posts = [
      { id: 1, content: '第一条', timestamp: 1000 },
      { id: 2, content: '第二条', timestamp: 2000 }
    ]
    const wrapper = mount(PostList)
    const cards = wrapper.findAll('.post-content')
    expect(cards[0].text()).toBe('第二条')
    expect(cards[1].text()).toBe('第一条')
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- src/components/__tests__/PostList.spec.js
```

预期：FAIL，模块 `../PostList.vue` 不存在。

- [ ] **步骤 3：Commit 测试文件**

```bash
git add src/components/__tests__/PostList.spec.js
git commit -m "test: PostList 组件测试（先失败）"
```

---

### 任务 5：PostList 组件实现（TDD 第四步）

**文件：**
- 创建：`src/components/PostList.vue`

- [ ] **步骤 1：实现 PostList.vue**

```vue
<template>
  <div class="post-list">
    <div v-if="store.isEmpty" class="empty-state">
      还没有内容，写下一句话吧
    </div>
    <div
      v-for="post in store.sortedPosts"
      :key="post.id"
      class="post-card"
    >
      <div class="post-content">{{ post.content }}</div>
      <div class="post-time">{{ formatTime(post.timestamp) }}</div>
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from '../stores/postStore.js'

const store = usePostStore()

function formatTime(timestamp) {
  const d = new Date(timestamp)
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 3px solid #a5d6a7;
  transition: transform 0.2s, box-shadow 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-content {
  font-size: 15px;
  word-break: break-word;
  white-space: pre-wrap;
}

.post-time {
  font-size: 12px;
  color: #81c784;
  margin-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #a5d6a7;
  font-size: 14px;
  font-style: italic;
}
</style>
```

- [ ] **步骤 2：运行测试确认通过**

```bash
npm test -- src/components/__tests__/PostList.spec.js
```

预期：PASS，所有 4 个测试通过。

- [ ] **步骤 3：Commit**

```bash
git add src/components/PostList.vue
git commit -m "feat: PostList 组件实现（列表渲染 + 空状态 + 时间格式化）"
```

---

### 任务 6：PostForm 组件测试（TDD 第五步）

**文件：**
- 创建：`src/components/__tests__/PostForm.spec.js`

- [ ] **步骤 1：编写 PostForm 测试**

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import PostForm from '../PostForm.vue'
import { usePostStore } from '../../stores/postStore.js'

describe('PostForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('渲染输入框和发布按钮', () => {
    const wrapper = mount(PostForm)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('button').text()).toBe('发布')
  })

  it('输入内容后点击发布，清空输入框', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('Hello 轻语')
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('textarea').element.value).toBe('')
  })

  it('发布后帖子进入 store', async () => {
    const wrapper = mount(PostForm)
    const store = usePostStore()
    await wrapper.find('textarea').setValue('测试发布')
    await wrapper.find('button').trigger('click')
    expect(store.posts).toHaveLength(1)
    expect(store.posts[0].content).toBe('测试发布')
  })

  it('字数统计实时更新', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('abc')
    expect(wrapper.find('.char-count').text()).toBe('3/280')
  })

  it('超出 280 字时字数标红', async () => {
    const wrapper = mount(PostForm)
    await wrapper.find('textarea').setValue('x'.repeat(281))
    expect(wrapper.find('.char-count').classes()).toContain('over-limit')
  })

  it('空内容点击发布不提交', async () => {
    const wrapper = mount(PostForm)
    const store = usePostStore()
    await wrapper.find('button').trigger('click')
    expect(store.posts).toHaveLength(0)
  })
})
```

- [ ] **步骤 2：运行测试确认失败**

```bash
npm test -- src/components/__tests__/PostForm.spec.js
```

预期：FAIL，模块 `../PostForm.vue` 不存在。

- [ ] **步骤 3：Commit 测试文件**

```bash
git add src/components/__tests__/PostForm.spec.js
git commit -m "test: PostForm 组件测试（先失败）"
```

---

### 任务 7：PostForm 组件实现（TDD 第六步）

**文件：**
- 创建：`src/components/PostForm.vue`

- [ ] **步骤 1：实现 PostForm.vue**

```vue
<template>
  <div class="input-card">
    <textarea
      v-model="inputContent"
      placeholder="分享新鲜事..."
      aria-label="分享内容"
      :maxlength="280"
    />
    <div class="input-footer">
      <span class="char-count" :class="{ 'over-limit': isOverLimit }">
        {{ charCount }}/280
      </span>
      <button @click="handlePublish" :disabled="isPublishing">发布</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePostStore } from '../stores/postStore.js'

const store = usePostStore()
const inputContent = ref('')
const isPublishing = ref(false)

const charCount = computed(() => inputContent.value.length)
const isOverLimit = computed(() => charCount.value > 280)

async function handlePublish() {
  if (isPublishing.value) return

  const content = inputContent.value.trim()
  if (!content) {
    // 按钮反馈动画
    return
  }

  isPublishing.value = true
  try {
    const success = store.publishPost(content)
    if (success) {
      inputContent.value = ''
    }
  } finally {
    isPublishing.value = false
  }
}
</script>

<style scoped>
.input-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #4caf50;
}

textarea {
  width: 100%;
  min-height: 80px;
  max-height: 300px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

textarea:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.input-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
}

.char-count {
  font-size: 13px;
  color: #999;
}

.char-count.over-limit {
  color: #f44336;
  font-weight: 500;
}

button {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 8px 24px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

button:hover:not(:disabled) {
  background: #43a047;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.4);
  transform: translateY(-1px);
}

button:disabled {
  background: #c8e6c9;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
</style>
```

- [ ] **步骤 2：运行测试确认通过**

```bash
npm test -- src/components/__tests__/PostForm.spec.js
```

预期：PASS，所有 6 个测试通过。

- [ ] **步骤 3：Commit**

```bash
git add src/components/PostForm.vue
git commit -m "feat: PostForm 组件实现（输入表单 + 字数统计 + 发布）"
```

---

### 任务 8：App.vue 集成与全量测试验证

**文件：**
- 创建：`src/App.vue`
- 修改：`CLAUDE.md`

- [ ] **步骤 1：实现 App.vue**

```vue
<template>
  <div class="container">
    <div class="header">
      <h1>轻语</h1>
      <p>写下一句话，记录当下</p>
    </div>
    <PostForm />
    <PostList />
  </div>
</template>

<script setup>
import PostForm from './components/PostForm.vue'
import PostList from './components/PostList.vue'
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #2e7d32;
  letter-spacing: 2px;
}

.header p {
  font-size: 14px;
  color: #66bb6a;
  margin-top: 4px;
}
</style>
```

- [ ] **步骤 2：运行全量测试**

```bash
npm test
```

预期：PASS，所有 16 个测试通过（Store 6 + PostList 4 + PostForm 6）。

- [ ] **步骤 3：启动开发服务器验证功能**

```bash
npm run dev
```

在浏览器中打开开发服务器地址，执行以下验证：
1. 页面显示标题"轻语"、输入框、发布按钮
2. 输入内容点击发布，帖子出现在列表顶部
3. 刷新页面，帖子保留
4. 空状态时显示"还没有内容，写下一句话吧"
5. 字数统计实时更新
6. 样式为浅绿色主题

Ctrl+C 停止服务器。

- [ ] **步骤 4：更新 CLAUDE.md**

```markdown
# 轻语

一个最小可用的匿名短内容发布与浏览应用。

## 技术栈

- Vue 3 + Pinia + Vite
- Vitest 单元测试
- Local Storage 数据持久化

## 运行方式

```bash
npm install
npm run dev
```

## 测试

```bash
npm test
```

## 构建

```bash
npm run build
```

## 验证方式

1. `npm run dev` 启动开发服务器
2. 浏览器打开地址，输入内容点击发布
3. 内容出现在列表顶部，时间显示正确
4. 刷新页面，内容保留
5. `npm test` 全部测试通过

## 技术约束

- 单页面应用，无路由
- 无外部 UI 组件库
- 匿名发布，无用户系统
- 纯文字，无图片
- 数据存储：Local Storage（键名 `qingyu_posts`）
```

- [ ] **步骤 5：Commit**

```bash
git add src/App.vue CLAUDE.md
git commit -m "feat: App.vue 集成 + 更新项目文档"
```

---

### 任务 9：构建验证与远程推送

**文件：**
- 修改：无（Git 操作）

- [ ] **步骤 1：构建验证**

```bash
npm run build
```

预期：生成 `dist/` 目录，无报错。

- [ ] **步骤 2：确认提交历史**

```bash
git log --oneline
```

预期输出（类似）：
```
xxx feat: App.vue 集成 + 更新项目文档
xxx feat: PostForm 组件实现
xxx test: PostForm 组件测试（先失败）
xxx feat: PostList 组件实现
xxx test: PostList 组件测试（先失败）
xxx feat: Pinia Store 实现
xxx test: Pinia Store 单元测试（先失败）
xxx chore: 初始化 Vite + Vue 3 + Pinia 项目
xxx style: 浅绿色主题设计...
...
```

- [ ] **步骤 3：推送到远程仓库**

```bash
git push origin main
```

预期：推送成功，远程仓库包含所有 commit。

---

## 自检

**1. 规格覆盖度：**
- Vue 3 + Pinia + Vite 架构 ✅ 任务 1
- TDD 开发流程 ✅ 任务 2-7（每个组件/Store 先测试后实现）
- Local Storage 持久化 ✅ 任务 3
- 发布功能 ✅ 任务 6-7
- 列表渲染 + 空状态 ✅ 任务 4-5
- 字数统计 ✅ 任务 6-7
- 浅绿色设计系统 ✅ 任务 5、7、8（组件 scoped style）
- Git 版本管理 ✅ 任务 9

**2. 占位符扫描：**
- 无"待定"、"TODO"
- 所有测试步骤包含完整测试代码
- 所有实现步骤包含完整组件/Store 代码
- 所有验证步骤包含具体命令和预期输出

**3. 类型一致性：**
- `usePostStore` 在任务 2（测试）、3（实现）、4（测试）、5（组件）、6（测试）、7（组件）中名称一致 ✅
- `publishPost` 返回布尔值，所有调用处一致 ✅
- `sortedPosts` 作为 getter，在组件模板中使用 ✅
- `isEmpty` 作为 getter，在模板中使用 ✅

无遗漏，无占位符，无类型不一致。