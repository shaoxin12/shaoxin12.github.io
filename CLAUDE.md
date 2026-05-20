# 杨少新个人网站 (yangshaoxin12.github.io)

## 概述

杨少新的个人网站，**新粗野主义（Neo-Brutalism）** 风格。纯静态站点，部署在 GitHub Pages。

- 访问地址：`https://yangshaoxin12.github.io/`
- 仓库：`yangshaoxin12/yangshaoxin12.github.io`

## 技术栈

纯 HTML/CSS/JS，零依赖，零构建步骤。所有 JS 内联在 `index.html` 中（`<script>` 标签）。`content.js` 和 `script.js` 保留为独立文件仅用于本地编辑参考，实际以 `index.html` 中的内联版本为准。

## 文件结构

```
website/
├── index.html        ← 主文件：HTML 结构 + 内联 JS（articles 数据 + 渲染引擎）
├── style.css         ← Neo-brutalist 样式，含响应式
├── content.js        ← 文章数据（独立副本，方便编辑后内联到 HTML）
├── script.js         ← 渲染引擎（独立副本）
└── CLAUDE.md         ← 本文档
```

## 设计风格

新粗野主义：粗黑边框、硬阴影（无模糊）、零圆角、无渐变。

- **配色**：黑白为主 `#000` / `#FFF`，强调色红 `#DE2A18`
- **字体**：系统无衬线（中文）+ JetBrains Mono（等宽/数字/邮箱）
- **边框**：2-3px solid #000，硬阴影 `box-shadow: 3px 3px 0 #000`
- **按钮按下**：阴影消失 + translate 偏移
- **语言切换**：右上角固定按钮，中/EN 切换，`data-zh` / `data-en` 属性控制显隐，`localStorage` 持久化

## 架构：Hash 路由 SPA

单页应用，通过 `location.hash` 路由：

| URL Hash | 渲染内容 |
|----------|----------|
| `#/project` | 项目板块文章列表 |
| `#/project/0` | 项目文章详情（ID=0） |
| `#/articles` | 文章板块列表 + 标签筛选栏 |
| `#/articles/tag/交易` | 按标签筛选文章 |
| `#/articles/2` | 文章详情 |

核心函数：`getRoute()` 解析 hash，`handleRoute()` 分发渲染，`renderSectionList()` 渲染卡片列表，`renderArticleDetail()` 渲染文章详情，`renderSidebar()` 渲染侧边栏手风琴导航。

所有点击通过 `document` 事件委托处理，顺序：tag badge → detail tag → sub-item → nav toggle → card → back → clear filter → tags bar。

## 两板块结构

- **项目**（project）— 作品展示，无 tag
- **文章**（articles）— 带分类 tag，可筛选

## 侧边栏手风琴

`renderSidebar()` 渲染两个 `nav-group`：项目、文章。当前路由所在的 group 有 `open` class，展开文章标题子列表。桌面端侧边栏固定 240px 宽、独立滚动。移动端隐藏子列表，仅显示横排按钮。

## 文章数据结构

在 `index.html` 的 `<script>` 中找到 `var articles = [...]`，每条格式：

```js
{
  section: 'articles',        // 'project' | 'articles'
  date: '2026-05-15',
  tags: [{ zh: '交易', en: 'Trading' }],  // 可选，可有多个
  zh: {
    title: '标题',
    desc: '卡片摘要',
    body: '正文（可选，支持 \n 换行）'
  },
  en: {
    title: 'Title',
    desc: 'Card summary',
    body: 'Body text'
  }
}
```

**发布新文章**：在 `articles` 数组末尾复制粘贴一条，推送即上线。

## 标签系统

- 每篇文章可有多个 `tags`
- `allTags` 从所有文章中自动收集
- 文章列表上方显示标签筛选栏（仅在未筛选时）
- 筛选后 URL 变为 `#/articles/tag/xxx`，上方显示 ✕ 清除按钮
- 卡片和详情页上的 tag badge 可直接点击筛选

## Giscus 评论

文章详情页底部加载 Giscus 评论区，通过 `createElement('script')` 动态注入。配置：
- `data-mapping="specific"`，`data-term="{section}-{id}"` 确保每篇文章独立讨论
- 分类：General
- 需要用户已安装 Giscus GitHub App

## 语言切换

- 中/EN 按钮在右上角，点击切换 `html[lang]` 属性
- CSS 规则 `html[lang="zh-CN"] [data-en] { display: none }` 控制显隐
- 所有文本通过 `data-zh` / `data-en` 属性提供双语
- 设置保存到 `localStorage`

## 响应式断点

- **Desktop**（>768px）：侧边栏 + 主内容区 grid 布局
- **Mobile**（≤768px）：侧边栏变为顶部横排导航栏，主内容区全宽，100dvh 高度
- **Small Mobile**（≤400px）：进一步缩小字体

## 部署

`git push` 到 master 分支，GitHub Pages 自动构建部署。约 30-60 秒生效。

## 注意事项

- `content.js` 和 `script.js` 是独立副本，实际 HTML 中的内联版本是权威来源。修改后需要同步更新 `index.html`。
- CSS 变量在 `:root` 中定义，修改配色只需改 `--accent` 等变量。
- 移动端隐藏侧边栏子列表（`.sub-list { display: none !important }`），保持简洁。
- Giscus 依赖 GitHub Discussions，若评论不显示检查 Giscus App 是否已安装。
