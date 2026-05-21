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

## MD 发布流程（推荐）

用户写 Markdown 文件发给 Claude Code，Claude Code 自动发布。

### MD 格式

```markdown
---
section: articles
date: 2026-05-21
tags: 交易/Trading, 哲学/Philosophy
---

# 中文标题 / English Title

中文摘要

English description

---

中文正文（可选）

English body (optional)
```

- `section`: `project` 或 `articles`
- `tags`: 逗号分隔，每个格式 `中文/English`（project 不需要）
- `#` 行：`中文标题 / English Title`
- 紧跟两段：中文摘要 + English description
- `---` 之后：正文，先中文后英文（可选）

### Claude Code 处理流程

1. 读取 MD 文件，解析 frontmatter + 标题 + 摘要 + 正文
2. 在 `content.js` 的 `var articles = [` 数组末尾追加新文章
3. 提交 `content.js`：`git add content.js && git commit -m "publish: <文章标题>"`
4. Push 到 GitHub：`git push`
5. GitHub Pages 自动部署（约 30 秒）

## admin.html（备选）

如果用户要自己编辑，浏览器打开 `admin.html`，用 GitHub Token 登录后可直接编辑发布。

## 设计风格

新粗野主义：粗黑边框、硬阴影、零圆角。强调色正红 `#FF0000`。

## 技术栈

纯 HTML/CSS/JS，零依赖。`content.js` 和 `script.js` 通过 `<script src>` 加载。
