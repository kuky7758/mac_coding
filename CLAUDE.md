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
