# 杨少新个人网站 (yangshaoxin12.github.io)

纯静态站点，部署在 GitHub Pages。

- 访问地址：`https://yangshaoxin12.github.io/`
- 仓库：`yangshaoxin12/yangshaoxin12.github.io`

## 文件结构

```
├── index.html    ← HTML 结构，加载外部 CSS + JS
├── style.css     ← Neo-brutalist 样式
├── content.js    ← 文章数据（var articles = [...]）
├── script.js     ← 渲染引擎（路由、侧边栏、卡片列表等）
└── admin.html    ← 本地后台编辑器（浏览器打开，用 GitHub API 编辑发布）
```

## 发布流程

1. 浏览器打开 `admin.html`
2. 输入 GitHub Token（首次仅一次，存 localStorage）
3. 编辑文章 → 保存（自动提交 content.js 到 GitHub）
4. 点「发布到公网」（同步所有文件到 GitHub）
5. GitHub Pages 自动部署（约 30 秒生效）

不需要 Vercel、不需要数据库、不需要构建。

## 设计风格

新粗野主义：粗黑边框、硬阴影、零圆角。强调色正红 `#FF0000`。

## 技术栈

纯 HTML/CSS/JS，零依赖。`content.js` 和 `script.js` 通过 `<script src>` 加载。
