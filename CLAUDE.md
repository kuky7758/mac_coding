# 轻语

一个最小可用的匿名短内容发布与浏览应用。

## 技术栈

- **前端**: Vue 3 + Pinia + Vite
- **后端**: Hono (Node.js)
- **存储**: 内存 Map（服务器重启数据清空）
- **测试**: Vitest（前后端共用）
- **数据交互**: RESTful API + 匿名 UUID 标识

## 功能

- 匿名发布纯文字内容（最多 280 字）
- 按时间倒序浏览已发布内容
- 实时字数统计
- **点赞 / 取消点赞**
- **收藏 / 取消收藏**
- 空状态提示

## 项目结构

```
├── src/                    # 前端代码
│   ├── api/client.js       # API 请求封装
│   ├── components/         # Vue 组件
│   ├── composables/        # 组合式函数
│   └── stores/             # Pinia 状态管理
├── backend/                # 后端代码
│   ├── src/routes/         # API 路由
│   ├── src/store/          # 内存存储
│   └── tests/              # 后端单元测试
└── docs/api-contract.md    # API 契约文档
```

## 运行方式

需要同时启动前后端服务：

```bash
# 终端 1：启动后端（端口 3000）
cd backend
npm install
node src/index.js

# 终端 2：启动前端（端口 5173）
npm install
npm run dev
```

## 测试

```bash
# 前端测试
npm test

# 后端测试
cd backend
npm test
```

## 构建

```bash
npm run build
```

## 验证方式

1. 同时启动前后端服务
2. 浏览器打开前端地址，输入内容点击发布
3. 内容出现在列表顶部，时间显示正确
4. 点击 ❤️ 点赞，计数增加，按钮变绿
5. 点击 ⭐ 收藏，计数增加，按钮变绿
6. 刷新页面，内容、点赞/收藏状态保留
7. 前后端 `npm test` 全部测试通过

## 技术约束

- 单页面应用，无路由
- 无外部 UI 组件库
- 匿名发布，无用户系统（通过 localStorage UUID 标识）
- 纯文字，无图片
- 后端为内存存储，重启后数据清空
