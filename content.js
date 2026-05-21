// ══════════════════════════════════════════════════════════
// 文章内容
// section: 'project' | 'articles'
// tags:   文章分类标签（数组，可有多个）
// body:   正文（可选，支持 \n 换行）
// ══════════════════════════════════════════════════════════

var articles = [
  // ── 项目 ──────────────────────────────────────────────
  {
    section: 'project',
    date: '2026-05-01',
    zh: {
      title: '听墨 Tingmo',
      desc: 'Windows 桌面 AI 语音输入法，Electron + React + TypeScript。',
      body: '听墨是一个 Windows 桌面 AI 语音输入工具。按住快捷键说话，松手自动识别并输入到当前光标位置。\n\n技术栈：Electron + React + TypeScript + Vite。语音识别使用了 Whisper 模型本地推理，延迟控制在 500ms 以内。\n\n界面设计分两部分：悬浮窗用了暗色玻璃态风格，设置页采用了新粗野主义——也是后来这个个人网站的视觉来源。\n\nGitHub: github.com/shaoxin12/tingmo'
    },
    en: {
      title: 'Tingmo',
      desc: 'Windows desktop AI voice input, built with Electron + React + TypeScript.',
      body: 'Tingmo is a Windows desktop AI voice input tool. Hold a hotkey, speak, release to transcribe and type at the cursor.\n\nStack: Electron + React + TypeScript + Vite. Speech recognition uses Whisper model running locally, with latency under 500ms.\n\nUI has two parts: the floating window uses a dark glassmorphism style, while the settings page uses neo-brutalism, which later inspired this personal website.\n\nGitHub: github.com/shaoxin12/tingmo'
    }
  },
  {
    section: 'project',
    date: '2026-05-01',
    zh: {
      title: '个人网站',
      desc: '新粗野主义风格静态网站，纯 HTML/CSS/JS，零依赖。',
      body: '就是这个网站。\n\n纯静态，零依赖，部署在 GitHub Pages，推送即上线。\n\n设计上完全遵循新粗野主义：3px 黑边框，硬阴影无模糊，零圆角，正红强调色。不需要 SSR、Tailwind、React——几个文件，干干净净。'
    },
    en: {
      title: 'Personal Website',
      desc: 'Neo-brutalist static site, pure HTML/CSS/JS, zero dependencies.',
      body: 'This is the site you are looking at.\n\nPure static, zero dependencies, deployed on GitHub Pages, push to publish.\n\nDesign follows neo-brutalism strictly: 3px black borders, hard shadows with zero blur, zero border-radius, pure red accent. No SSR, no Tailwind, no React — just a few files, clean and simple.'
    }
  },

  // ── 文章 ──────────────────────────────────────────────
  {
    section: 'articles',
    date: '2026-05-09',
    tags: [{ zh: '交易', en: 'Trading' }, { zh: '哲学', en: 'Philosophy' }],
    zh: {
      title: 'AI硬件回头看',
      desc: '对过去一年AI硬件大行情的反思：为什么全程旁观，以及今后如何改变。',
      body: '今天是2026年4月23日，AI硬件再次新高，而我的账户又新低了。\n\n作为一个追风口的选手，居然对过去一年最大最强最持久的风口视而不见，这不得不说是一种失败。\n\n2022年11月30日，ChatGPT 3.5发布，我也差不多是这个时候入的市。不去对时代最强风口下注，反而玩起超短，追涨杀跌，一路亏损。现在我明白了，像我这种愚人，大概只能在大行情上赚钱。\n\nAI硬件最肥美的大概有两段。一段是2023年，大语言模型刚进入大众视野，新概念的炒作总是最流畅的。第二段是2025年4月9日到今天——特朗普关税引发全球暴跌，光模块经历半年回调后再次暴击，随后一路狂飙，叠加出业绩和机构景气度投资，造成了史无前例的狂暴牛。而我全程旁观，从未参与。\n\n最近的市场有一句话很火：你要站在光里，不要光站在那里。当市场进入抱团阶段，其他题材无法吸取到市场资金——要么加入，要么空仓。\n\n机构行情的解决办法就是找到产业趋势、机构抱团的核心票，买入拿着就行了。19-21的宁德时代，23-26的中际旭创，这就是时代的答案。\n\n既然认识到我无法靠交易赚钱，只能靠行情发财，那今后也往这方向走。我把行情分为两类：业绩 + 题材。业绩就是机构抱团的方向，题材就是散户抱团的方向。而无论题材还是业绩都要立足现实，没有行情是靠人们的想象走出来的。\n\n昔之善战者，先为不可胜，以待敌之可胜。不可胜在己，可胜在敌。\n\n2026.5.9更新：产业链核心公司还是在美股，存储相当夸张，26年一季度海力士净利润40.35万亿韩元约1868亿人民币，全年利润预计达万亿人民币。AI硬件英伟达是第一个出业绩的（训练需求爆发），然后存储出业绩（推理需求爆发）。AI已经不仅仅是个叙事了，它切实地改变了我们的生活。'
    },
    en: {
      title: 'AI Hardware Retrospective',
      desc: 'Reflecting on missing the AI hardware bull run and how to change going forward.',
      body: 'April 23, 2026. AI hardware hits new highs while my account hits new lows.\n\nAs someone who chases trends, completely missing the biggest, strongest, most persistent trend of the past year is nothing short of failure.\n\nChatGPT 3.5 launched on November 30, 2022 — around when I started trading. Instead of betting on the strongest trend of our era, I played short-term games, chasing ups and downs, losing money all the way. Now I understand: someone like me can only make money on big cyclical moves.\n\nAI hardware had two fat waves. The first was 2023, when LLMs first entered public consciousness — new concepts always produce the smoothest rallies. The second began April 9, 2025, after Trump tariffs triggered a global crash. Optical modules, after a six-month pullback, got hammered again then exploded upward. Combined with real earnings growth and institutional conviction, this produced a historic bull run. I watched from the sidelines the entire time.\n\nThe solution to institutional trends is simple: identify the industry trend, find the core stocks institutions are clustering around, buy them, and hold. CATL from 2019-2021. Zhongji Innolight from 2023-2026. These are the answers of their eras.\n\nI categorize all market moves into two types: earnings-driven and theme-driven. Earnings = institutional clustering. Themes = retail clustering. Both must be grounded in reality — no market move was ever built on imagination alone.\n\nThe ancient saying applies: The skilled warrior first makes himself invincible, then waits for the enemy to become vulnerable. Invincibility lies in yourself; vulnerability lies in the enemy.\n\nUpdate May 9, 2026: The core companies remain in US markets. Storage numbers are staggering — SK Hynix Q1 2026 net profit reached 40.35 trillion won (~186.8 billion RMB). Full-year profit projected at nearly 1 trillion RMB. NVIDIA delivered first on training demand; storage is now delivering on inference demand. AI is no longer just a narrative — it has tangibly changed our lives.'
    }
  },
  {
    section: 'articles',
    date: '2026-02-16',
    tags: [{ zh: '交易', en: 'Trading' }],
    zh: {
      title: '2025年年报',
      desc: '全年收益+108.20%，首次年度盈利。复盘2025牛市行情与个人交易得失。',
      body: '净资产：26246元。净资产增长率：310.09%。\n\n从今年开始每年坚持写年报，想到哪写到哪。\n\n2025年的A股毫无疑问是牛市。细数全年行情：2月春节后，DeepSeek、哪吒2；机器人，化工的中毅达；4月9日特朗普加关税，股市暴跌砸出黄金坑，开始了以CPO为代表的AI趋势大行情，一直持续到年尾，中际旭创、新易盛一波下来直接十倍；4月还炒了内需消费一小波；5月印巴冲突，成飞集成、利君股份，还有新城路的成名战永安药业；6月稳定币恒宝股份、东信和平，创新药昂立康、舒泰神、广生堂，军工长城军工；7月雅下水电站，北方稀土业绩爆炸，机器人又走上一波趋势；8月AI液冷、淳中科技；9月科技趋势+锂电储能爆发，存储涨价德明利、江波龙、香农芯创；10-11月台湾题材平潭发展、海峡创新、合富中国；12月商业航天，强度叹为观止。此外，黄金全年涨幅58.52%，白银127.68%。\n\n回到自己账户，全年收益+108.20%。因中间多次入金，看盈利金额：全年盈利+10739.36，距离回本还差3937.48。\n\n盈利主要来源：平潭发展 +4776.89，国投白银LOF +1800.53，长城军工 +1430.95，立讯精密 +1059.61。\n\n亏损主要来源：长川科技 -838.77，香农芯创 -515.49，桂发祥 -483.96，长盛轴承 -476.82，紫光股份 -452.90，多伦科技 -431.84。\n\n今年是盈利的第一年，其实有很多操作是不满意的。遗憾的股很多：拓维信息、恒宝股份、长城军工、北方稀土、香农芯创、平潭发展、海峡创新、天普股份、振德医疗、航天发展。\n\n一年其实不用干得多，把握好大题材，把握好龙头，还有一些确定性机会，一年十倍真不是玩笑。相反如果总是着眼小处，隔日交易，就很容易卖飞龙头，踏空行情。这点真是我新一年要重点突破的——持股，持股，多持股。\n\n主升爆发推满，题材分歧买核心，交易要上仓位，龙头确认不能轻易卖出，手里无论如何至少都得拿着一点。这是今年牛市的心得。另外，追高的毛病已经在慢慢改掉了，这点我很欣慰。'
    },
    en: {
      title: '2025 Annual Report',
      desc: 'Full-year return +108.20%, first profitable year. A review of the 2025 bull market.',
      body: 'Net assets: 26,246 RMB. Growth rate: 310.09%.\n\nStarting this year, I will write an annual report every year.\n\n2025 was unquestionably a bull market for A-shares. The year began with DeepSeek and Ne Zha 2 after Spring Festival; robotics and chemical stocks followed. On April 9, Trump tariffs crashed the market, creating a golden buying opportunity — CPO-led AI trends dominated from then until year-end, with Zhongji Innolight and Eoptolink delivering 10x returns. Throughout the year: India-Pakistan conflict plays, stablecoin and innovative drug rallies, military industrials, the Yalong hydro project, rare earth earnings explosions, AI liquid cooling, lithium storage, memory price surges, Taiwan-themed plays, and commercial aerospace to close the year. Gold rose 58.52%, silver 127.68%.\n\nMy account: +108.20% for the year, but with multiple deposits the percentage is misleading. Net profit: +10,739.36 RMB, with 3,937.48 remaining to break even on cumulative losses.\n\nTop winners: Pingtan Development +4,776.89, CSI Silver LOF +1,800.53, Great Wall Military +1,430.95, Luxshare Precision +1,059.61.\n\nTop losers: Changchuan Technology -838.77, Shannon Core -515.49, Guifaxiang -483.96, Changsheng Bearing -476.82, Unisplendour -452.90, Duolun Technology -431.84.\n\nThis was my first profitable year, but many trades left me unsatisfied. Stocks I regret missing: Tuowei, Hengbao, Great Wall Military, Northern Rare Earth, Shannon Core, Pingtan Development, Haixia Innovation, Tianpu, Zhende Medical, Aerospace Development.\n\nYou really don\'t need many trades in a year. Catch the big themes, hold the leaders, seize the certain opportunities — 10x in a year is no joke. The key breakthrough for the new year: hold, hold, hold longer. Main wave breakouts go all in. Theme divergences buy the core. Commit size. Don\'t easily sell confirmed leaders. Always keep at least some position. And I\'m slowly breaking the habit of chasing highs — that brings me some peace.'
    }
  },
  {
    section: 'articles',
    date: '2026-05-17',
    tags: [{ zh: '交易', en: 'Trading' }],
    zh: {
      title: '投机备忘录',
      desc: '投机第一原则：不亏本。交易错题集与模式总结——做主升，低频重仓。',
      body: '投机第一原则：不亏本。\n\n挑选好故事。\n\n人真的总是有自我毁灭的倾向吗？明明已经知道买ETF长期下来就是会亏钱的，但还是忍不住去买。这就像是走在路上看到有一只恶犬，知道会被咬还是要去踹它一脚。\n\n这种病叫"情绪"——让人焦虑踏空又害怕回落，然后明知不是买点，仍然要去找T0的ETF买一笔才过瘾；让人在路上看到恶犬，明知会被咬，也要因为不爽去踹一脚；让人遇到明知不可战胜的敌人还要因为热血而去送死。\n\n既然像我这样有"情绪"的人总是亏钱，那么要赚钱，《我》应该成为我的对手盘，也就是成为"情绪"的对手盘——当我因为情绪买入的时候，《我》就该卖出，当我因为情绪卖出的时候，《我》就应该买入。短线资金是A股最有"情绪"的资金，这其中有大机会。\n\n止戈为武：交易是有成本的，不出手比出手更需要学习。判断是否出手需要大盘、情绪、题材的综合分析。穷尽错误后剩下的就是正确。\n\n一点经验：\n- 分时追高的大多亏损，赚钱的大多是开盘买的，绝对不能分时追高！赚情绪溢价，但买入绝不带情绪溢价\n- 不要在情绪高点做T\n- 想买的票炸板了不要立刻去买，要买也得等企稳了再看，低吸也是一样，企稳再买。涨不卖，跌不买\n- 做趋势买点在均线回踩，注意这个回踩一定不是加速后的回踩，趋势加速后没有买点\n- 绝对不做日内香港证券ETF\n- 做主升，失败是要确定的，10点前一般不卖出\n- 高位股一定慎重慎重再慎重\n- 下跌趋势的高开一定万分谨慎，干脆不买\n- 正常持股周期是三天往上\n\n确定模式：做主升。核心趋势，低频重仓。\n\n时间一长就会放松警惕，放松对买点的要求，开始频繁出手，甚至做出非模式的买点。所以此篇应常常温习，以尽力减少亏损。\n\n昔之善战者，先为不可胜，以待敌之可胜。不可胜在己，可胜在敌。\n\n慢止盈，快止损。分歧买入，拿到再次分歧卖出。不要在途中预期没有兑现时卖出。重点在于预期，预期没有兑现之前当然不能走。'
    },
    en: {
      title: 'Trading Memo',
      desc: 'First rule of speculation: don\'t lose money. A collection of trading mistakes and pattern summaries.',
      body: 'First rule of speculation: Don\'t lose money.\n\nPick good stories.\n\nDo people really have a tendency toward self-destruction? Knowing full well that buying ETFs loses money over time, yet unable to resist. Like seeing a vicious dog on the road, knowing you\'ll get bitten, but still kicking it.\n\nThis disease is called "emotion" — it makes you anxious about missing out, fearful of pullbacks, buying when you know it\'s not the right entry. It makes you kick the dog because you\'re annoyed. It makes you charge at an unbeatable enemy out of passion.\n\nSince emotional people like me always lose money, to make money, "I" should become my own counterparty — when I buy out of emotion, "I" should sell. When I sell out of panic, "I" should buy. Short-term capital in A-shares is the most emotional money — therein lies great opportunity.\n\nCeasing arms is martial virtue: trading has costs. Not acting requires more learning than acting. Whether to act requires comprehensive analysis of the broader market, sentiment, and theme. After exhausting all mistakes, what remains is correctness.\n\nKey lessons:\n- Most chase-buyers lose money; most winners buy at the open. Never chase intraday! Capture sentiment premium, but never buy with sentiment premium yourself\n- Never make T-trades at sentiment peaks\n- If a stock you want blows the limit, don\'t rush to buy. Wait for stabilization. Same for dip-buys — buy after stabilization. Don\'t sell into strength, don\'t buy into weakness\n- Trend entries are at moving average pullbacks — note: not pullbacks after acceleration. No entries exist after trend acceleration\n- Never day-trade Hong Kong securities ETFs\n- Trade main waves. Failure must be confirmed. Generally don\'t sell before 10am\n- Be extremely cautious with high-position stocks\n- Be hyper-vigilant about gap-ups in downtrends — better to simply not buy\n- Normal holding period: three days minimum\n\nEstablished pattern: Trade main waves. Core trends. Low frequency, heavy position.\n\nOver time, vigilance relaxes, entry standards loosen, frequency increases, non-pattern trades creep in. This memo must be reviewed regularly to minimize losses.\n\nThe skilled warrior first makes himself invincible, then waits for the enemy to become vulnerable. Invincibility lies in yourself; vulnerability lies in the enemy.\n\nSlow take-profit, fast stop-loss. Buy on divergence, sell on the next divergence. Don\'t sell midway when expectations haven\'t materialized. The key is expectation — if it hasn\'t played out yet, of course you don\'t leave.'
    }
  }
];
