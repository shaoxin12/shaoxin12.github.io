// ══════════════════════════════════════════════════════════
// 文章内容 — 添加新文章只需复制一条 { } 块
// section: 'life' | 'spec' | 'project'
// ══════════════════════════════════════════════════════════

const articles = [
  // ── 生活 ──────────────────────────────────────────────
  {
    section: 'life',
    date: '2026-05-19',
    zh: { title: '个人网站上线', desc: '用新粗野主义风格搭建了自己的个人网站，发布第一篇内容。' },
    en: { title: 'Personal Website Launched', desc: 'Built my personal website in neo-brutalist style.' }
  },
  {
    section: 'life',
    date: '2026-05-10',
    zh: { title: '周末骑行深圳湾', desc: '沿着海岸线骑了四十公里，海风很舒服，路上看到很多候鸟。' },
    en: { title: 'Weekend Ride at Shenzhen Bay', desc: 'Rode 40km along the coastline, the sea breeze felt great.' }
  },
  {
    section: 'life',
    date: '2026-04-28',
    zh: { title: '重新开始写日记', desc: '每天写一点东西，记录想法和学到的东西。' },
    en: { title: 'Started Journaling Again', desc: 'Writing a bit each day, capturing thoughts and learnings.' }
  },

  // ── 投机 ──────────────────────────────────────────────
  {
    section: 'spec',
    date: '2026-05-15',
    zh: { title: '建立交易系统 v1', desc: '完成了第一版量化交易系统的搭建，开始回测历史数据。' },
    en: { title: 'Trading System v1', desc: 'Completed v1 of the quant trading system, started backtesting.' }
  },
  {
    section: 'spec',
    date: '2026-05-12',
    zh: { title: '五月交易复盘', desc: '胜率提升到 65%，止损纪律执行得不错，继续优化。' },
    en: { title: 'May Trading Review', desc: 'Win rate improved to 65%, stop-loss discipline was solid.' }
  },
  {
    section: 'spec',
    date: '2026-05-08',
    zh: { title: '学习订单流分析', desc: '开始研究 footprint chart 和成交量分布，打开了新世界。' },
    en: { title: 'Learning Order Flow Analysis', desc: 'Started studying footprint charts and volume profile.' }
  },

  // ── 项目 ──────────────────────────────────────────────
  {
    section: 'project',
    date: '2026-05-01',
    zh: { title: '听墨 Tingmo', desc: 'Windows 桌面 AI 语音输入法，Electron + React + TypeScript。' },
    en: { title: 'Tingmo', desc: 'Windows desktop AI voice input, built with Electron + React + TypeScript.' }
  },
  {
    section: 'project',
    date: '2026-05-01',
    zh: { title: '个人网站', desc: '新粗野主义风格静态网站，纯 HTML/CSS/JS，零依赖。' },
    en: { title: 'Personal Website', desc: 'Neo-brutalist static site, pure HTML/CSS/JS, zero dependencies.' }
  }
];
