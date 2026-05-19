// ══════════════════════════════════════════════════════════
// 文章内容 — 添加新文章只需复制一条 { } 块
// section: 'life' | 'spec' | 'project'
// body:  正文（可选，不写则在详情页只显示标题+日期+描述）
// ══════════════════════════════════════════════════════════

var articles = [
  // ── 生活 ──────────────────────────────────────────────
  {
    section: 'life',
    date: '2026-05-19',
    zh: {
      title: '个人网站上线',
      desc: '用新粗野主义风格搭建了自己的个人网站，发布第一篇内容。',
      body: '一直想有个地方记录自己的东西。不喜欢花里胡哨的设计，选了新粗野主义风格——粗边框、硬阴影、零圆角。\n\n网站分三个板块：生活记录日常，投机写交易思考，项目放作品。内容全存在 content.js 里，复制粘贴就能发文章，推上去自动更新。\n\n感觉很对。'
    },
    en: {
      title: 'Personal Website Launched',
      desc: 'Built my personal website in neo-brutalist style.',
      body: 'Always wanted a place to record my things. Not into fancy designs, so I went with neo-brutalism — bold borders, hard shadows, zero border-radius.\n\nThree sections: Life for daily records, Spec for trading thoughts, Project for my work. All content lives in content.js — just copy-paste to publish, push and it auto-deploys.\n\nFeels right.'
    }
  },
  {
    section: 'life',
    date: '2026-05-10',
    zh: {
      title: '周末骑行深圳湾',
      desc: '沿着海岸线骑了四十公里，海风很舒服，路上看到很多候鸟。',
      body: '周六早上六点出发，从深圳湾公园一路骑到大鹏。四十公里，不算远但也不轻松。\n\n海边的风吹过来特别舒服，路上看到成群的候鸟停在滩涂上。中途在路边小摊喝了碗糖水，继续上路。\n\n回到家洗完澡直接就睡着了。下次想骑到惠州试试。'
    },
    en: {
      title: 'Weekend Ride at Shenzhen Bay',
      desc: 'Rode 40km along the coastline, the sea breeze felt great.',
      body: 'Started at 6am Saturday, rode from Shenzhen Bay Park to Dapeng. 40km — not too far but not easy either.\n\nThe sea breeze was amazing, saw flocks of migratory birds on the mudflats. Stopped for sweet soup at a roadside stall halfway.\n\nFell asleep right after showering at home. Next time might try riding to Huizhou.'
    }
  },
  {
    section: 'life',
    date: '2026-04-28',
    zh: {
      title: '重新开始写日记',
      desc: '每天写一点东西，记录想法和学到的东西。',
      body: '很久没写日记了。前几天翻到大学时候的笔记本，密密麻麻写满了乱七八糟的想法，有些现在看来很幼稚，有些居然还挺有道理。\n\n打算重新开始写。不要求每天长篇大论，就记几句——今天学了什么、想了什么、做了什么。积累下来应该挺有价值的。\n\n于是有了这个网站。'
    },
    en: {
      title: 'Started Journaling Again',
      desc: 'Writing a bit each day, capturing thoughts and learnings.',
      body: 'Haven\'t journaled in a long time. Found my old college notebook the other day — pages filled with messy thoughts, some naive, some surprisingly insightful.\n\nPlanning to start again. Not forcing long entries, just jotting down what I learned, thought, and did each day. Should add up to something valuable.\n\nAnd so this website came to be.'
    }
  },

  // ── 投机 ──────────────────────────────────────────────
  {
    section: 'spec',
    date: '2026-05-15',
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
    section: 'spec',
    date: '2026-05-12',
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
    section: 'spec',
    date: '2026-05-08',
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
  },

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
  }
];
