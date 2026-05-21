# 杨少新个人网站 (shaoxin12.github.io)

纯静态站点，部署在 GitHub Pages。

- 访问地址：`https://shaoxin12.github.io/`
- 仓库：`shaoxin12/shaoxin12.github.io`（默认分支 `main`）

## 文件结构

```
├── index.html    ← HTML 结构，加载外部 CSS + JS
├── style.css     ← Neo-brutalist 样式
├── content.js    ← 文章数据（var articles = [...]）
├── script.js     ← 渲染引擎（路由、侧边栏、卡片列表等）
└── admin.html    ← 本地后台编辑器（浏览器打开，用 GitHub API 编辑发布）
```

## 设计风格

新粗野主义：粗黑边框、硬阴影、零圆角。强调色正红 `#FF0000`。侧边栏宽度 260px。

### 字体层级

| 元素 | 桌面 | 平板 | 小屏 |
|------|------|------|------|
| 导航按钮（项目/文章） | 16px | 15px | 14px |
| 侧边栏子菜单 | 15px | — | — |
| 卡片标题 | 22px | 19px | 17px |
| 卡片摘要 | 16px | 15px | 14px |
| 正文 | 21px | 19px | 18px |
| 标签（card-tag/article-tag） | 12px | 11px | — |
| tag筛选按钮 | 13px | 12px | — |

## 文章格式（content.js）

```javascript
{
  section: 'articles',  // 'project' | 'articles'
  date: '2026-05-21',
  tags: [{ zh: '交易', en: 'Trading' }],
  zh: { title: '标题', desc: '摘要', body: '正文（\\n换行）' },
  en: { title: 'Title', desc: 'Desc', body: 'Body' }
}
```

- body 支持 HTML 标签，如 `<b>粗体</b>`、`<img src="...">`
- 图片自适应宽度 + 灰边框（CSS 已内置）

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

### Claude Code 处理流程

1. 读取 MD 文件，解析 frontmatter + 标题 + 摘要 + 正文
2. 在 `content.js` 的 `var articles = [` 数组末尾追加新文章
3. `git add content.js && git commit -m "publish: <文章标题>" && git push`
4. GitHub Pages 自动部署（约 30 秒）

## admin.html（备选）

浏览器打开 `admin.html`，用 GitHub Token 登录后可直接编辑发布。Token 需要 `repo` 权限。

## 每次改动后

`git push` 即部署，不需要通知用户。https://shaoxin12.github.io 约 30 秒生效。
