// ══════════════════════════════════════════════════════════
// 文章内容 — 添加新文章只需复制一条 { } 块
// section: 'project' | 'articles'
// tag:    文章分类标签（仅 articles 需要）
// body:   正文（可选，不写则详情页只显示标题+日期+描述）
// ══════════════════════════════════════════════════════════

var articles = [
  // ── 项目 ──────────────────────────────────────────────
  {
    section: 'project',
    date: '2026-05-01',
    zh: {
      title: '听墨 Tingmo',
      desc: 'Windows 桌面 AI 语音输入法，Electron + React + TypeScript。',
      body: '听墨是一个 Windows 桌面 AI 语音输入工具。按住快捷键说话，松手自动识别并输入到当前光标位置。\n\n技术栈：Electron + React + TypeScript + Vite。语音识别使用了 Whisper 模型本地推理，延迟控制在 500ms 以内。\n\n界面设计分两部分：悬浮窗用了暗色玻璃态风格，设置页采用了新粗野主义——也是后来这个个人网站的视觉来源。\n\nGitHub: github.com/hreplo/tingmo'
    },
    en: {
      title: 'Tingmo',
      desc: 'Windows desktop AI voice input, built with Electron + React + TypeScript.',
      body: 'Tingmo is a Windows desktop AI voice input tool. Hold a hotkey, speak, release to transcribe and type at the cursor.\n\nStack: Electron + React + TypeScript + Vite. Speech recognition uses Whisper model running locally, with latency under 500ms.\n\nUI has two parts: the floating window uses a dark glassmorphism style, while the settings page uses neo-brutalism — which later inspired this personal website.\n\nGitHub: github.com/hreplo/tingmo'
    }
  },
  {
    section: 'project',
    date: '2026-05-01',
    zh: {
      title: '个人网站',
      desc: '新粗野主义风格静态网站，纯 HTML/CSS/JS，零依赖。',
      body: '就是这个网站。\n\n纯静态，三个文件：index.html + style.css + script.js。内容抽到 content.js 里，加文章就是复制粘贴一个对象。部署在 GitHub Pages，推送即上线。\n\n设计上完全遵循新粗野主义：3px 黑边框，硬阴影无模糊，零圆角，红色强调。不需要什么 SSR、Tailwind、React——几个文件，干干净净。'
    },
    en: {
      title: 'Personal Website',
      desc: 'Neo-brutalist static site, pure HTML/CSS/JS, zero dependencies.',
      body: 'This is it — the website you\'re looking at.\n\nPure static, three files: index.html + style.css + script.js. Content lives in content.js — adding a post is copying and pasting one object. Deployed on GitHub Pages, push to publish.\n\nDesign follows neo-brutalism strictly: 3px black borders, hard shadows with zero blur, zero border-radius, red accent. No SSR, no Tailwind, no React — just a few files, clean and simple.'
    }
  },

  // ── 文章 ──────────────────────────────────────────────
  {
    section: 'articles',
    date: '2026-05-15',
    tag: { zh: '交易', en: 'Trading' },
    zh: {
      title: '建立交易系统 v1',
      desc: '完成了第一版量化交易系统的搭建，开始回测历史数据。',
      body: '花了两个周末把第一版量化系统搭好了。技术栈：Python + Pandas + Backtrader。\n\n目前支持：\n- 多品种数据加载（BTC、ETH、SOL）\n- 自定义策略编写和回测\n- 基本的风险指标（夏普、最大回撤、胜率）\n\n回测了几个基础策略，效果一般。接下来要加入订单流数据和更精细的止损逻辑。路还很长，但总算有个可以迭代的基础了。'
    },
    en: {
      title: 'Trading System v1',
      desc: 'Completed v1 of the quant trading system, started backtesting.',
      body: 'Spent two weekends building v1 of the quant system. Stack: Python + Pandas + Backtrader.\n\nCurrently supports:\n- Multi-asset data loading (BTC, ETH, SOL)\n- Custom strategy writing and backtesting\n- Basic risk metrics (Sharpe, max drawdown, win rate)\n\nBacktested a few basic strategies with mediocre results. Next step: order flow data and more refined stop-loss logic. Long road ahead, but at least there\'s a foundation to iterate on.'
    }
  },
  {
    section: 'articles',
    date: '2026-05-12',
    tag: { zh: '交易', en: 'Trading' },
    zh: {
      title: '五月交易复盘',
      desc: '胜率提升到 65%，止损纪律执行得不错，继续优化。',
      body: '五月过半，做一次复盘。\n\n本月交易 20 笔，胜率 65%（13 赢 7 输），盈亏比 1.8:1。最满意的不是盈利，是止损纪律——没有一次扛单，到了止损位就走。\n\n亏钱的那几笔主要问题是追高。行情启动后急匆匆冲进去，结果买在顶部。解决方案：等回调，不做追高单。\n\n六月目标：胜率保持 60%+，盈亏比提到 2:1 以上。'
    },
    en: {
      title: 'May Trading Review',
      desc: 'Win rate improved to 65%, stop-loss discipline was solid.',
      body: 'Halfway through May, time for a review.\n\n20 trades this month, 65% win rate (13 wins, 7 losses), 1.8:1 profit/loss ratio. Most proud of the stop-loss discipline — never held a losing position hoping it would turn around. Hit the stop, got out.\n\nThe losing trades were mostly chasing breakouts. FOMO\'d in at the top. Solution: wait for pullbacks, no chasing.\n\nJune goals: maintain 60%+ win rate, push P/L ratio above 2:1.'
    }
  },
  {
    section: 'articles',
    date: '2026-05-08',
    tag: { zh: '交易', en: 'Trading' },
    zh: {
      title: '学习订单流分析',
      desc: '开始研究 footprint chart 和成交量分布，打开了新世界。',
      body: '以前看盘都是看 K 线，这周开始学订单流。Footprint chart 能看到每个价位上的买卖量对比，成交量分布图能看到哪里成交最密集。\n\n最大的收获：K 线图上看起来"放量突破"的信号，在 footprint 上看可能完全是假突破——一堆被动卖单被吃掉而已。\n\n正在看 Axia Futures 的课程，推荐给做日内交易的朋友。'
    },
    en: {
      title: 'Learning Order Flow Analysis',
      desc: 'Started studying footprint charts and volume profile.',
      body: 'Used to just look at candlesticks, this week started learning order flow. Footprint charts show buy vs sell volume at each price level, volume profile shows where the most trading happens.\n\nThe biggest insight: what looks like a "high volume breakout" on candlesticks could be a complete fake-out on footprint — just a bunch of passive sell orders getting eaten.\n\nWatching Axia Futures courses. Recommended for anyone doing intraday trading.'
    }
  }
];
