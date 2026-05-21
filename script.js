// ── Assign IDs ──────────────────────────────────────────
if (typeof articles === 'undefined') {
  document.getElementById('main-content').innerHTML = '<div style="padding:32px;color:red;font:14px monospace;">Error: articles not loaded. Check content.js.</div>';
} else {

var articleId = 0;
for (var i = 0; i < articles.length; i++) {
  articles[i]._id = articleId++;
}

var sectionNames = {
  project:  { zh: '项目', en: 'Project' },
  articles: { zh: '文章', en: 'Articles' }
};

var allTags = {};
for (var i = 0; i < articles.length; i++) {
  var tags = articles[i].tags;
  if (tags) {
    for (var j = 0; j < tags.length; j++) {
      allTags[tags[j].zh] = tags[j];
    }
  }
}
} // end if typeof articles check

// ── Routing ─────────────────────────────────────────────
function getRoute() {
  var h = location.hash.replace('#', '') || '/';
  var parts = h.replace(/^\/+/, '').split('/');

  var route = {
    home: false,
    section: null,
    articleId: null,
    tags: []
  };

  // Home page (empty hash or just "/")
  if (!parts[0] || parts[0] === '') {
    route.home = true;
    return route;
  }

  route.section = parts[0] || 'project';

  // Multi-tag filter: /articles/tag/交易+哲学
  if (parts.length >= 3 && parts[1] === 'tag') {
    var raw = decodeURIComponent(parts[2]);
    route.tags = raw ? raw.split('+') : [];
  } else if (parts.length > 1 && parts[1] !== '') {
    route.articleId = parseInt(parts[1]);
  }

  return route;
}

function navigateHome() {
  location.hash = '';
}

function navigateToSection(section) {
  location.hash = '/' + section;
}

function filterByTag(tagZh) {
  location.hash = '/articles/tag/' + encodeURIComponent(tagZh);
}

function toggleTag(tagZh) {
  var r = getRoute();
  var tags = r.tags ? r.tags.slice() : [];
  var idx = tags.indexOf(tagZh);
  if (idx >= 0) {
    tags.splice(idx, 1);
  } else {
    tags.push(tagZh);
  }
  if (tags.length > 0) {
    location.hash = '/articles/tag/' + encodeURIComponent(tags.join('+'));
  } else {
    location.hash = '/articles';
  }
}

// ── Event Delegation (order matters: specific → general) ──
document.addEventListener('click', function(e) {
  // 1. Tag badge on card — single-tag filter, don't open article
  var cardTag = e.target.closest('.card-tag');
  if (cardTag) {
    e.preventDefault();
    var tzh = cardTag.getAttribute('data-tag-zh');
    if (tzh) filterByTag(tzh);
    return;
  }

  // 2. Tag badge in article detail
  var detailTag = e.target.closest('.article-cat-tag');
  if (detailTag) {
    e.preventDefault();
    var dtzh = detailTag.getAttribute('data-tag-zh');
    if (dtzh) filterByTag(dtzh);
    return;
  }

  // 3. Sidebar sub-item
  var sub = e.target.closest('.sub-item');
  if (sub) {
    var sid = parseInt(sub.getAttribute('data-id'));
    var ssection = sub.getAttribute('data-section');
    if (!isNaN(sid) && ssection) {
      location.hash = '/' + ssection + '/' + sid;
    }
    return;
  }

  // 4. Sidebar nav toggle button
  var navToggle = e.target.closest('.nav-item');
  if (navToggle) {
    var s = navToggle.getAttribute('data-section');
    navigateToSection(s);
    return;
  }

  // 5. Card click — open article
  var card = e.target.closest('.card');
  if (card) {
    var id = parseInt(card.getAttribute('data-article-id'));
    var section = card.getAttribute('data-section');
    if (!isNaN(id) && section) {
      location.hash = '/' + section + '/' + id;
    }
    return;
  }

  // 6. Back button
  if (e.target.closest('.article-back')) {
    var r = getRoute();
    if (r.tags && r.tags.length > 0) {
      location.hash = '/' + r.section + '/tag/' + encodeURIComponent(r.tags.join('+'));
    } else {
      location.hash = '/' + r.section;
    }
    return;
  }

  // 7. Tags bar item — multi-select toggle
  var tbi = e.target.closest('.tags-bar-item');
  if (tbi) {
    var tzh2 = tbi.getAttribute('data-tag-zh');
    if (tzh2) toggleTag(tzh2);
    return;
  }
});

// ── Render Home Page ─────────────────────────────────────
function renderHome() {
  var main = document.getElementById('main-content');
  main.innerHTML =
    '<section class="section active home-section">' +
      '<div class="home-hero">' +
        '<h1 class="home-name">杨少新</h1>' +
        '<p class="home-tagline">' +
          '<span data-zh>构建、交易、写作</span>' +
          '<span data-en>Build, Trade, Write</span>' +
        '</p>' +
      '</div>' +
      '<div class="home-cards">' +
        '<button class="home-card" onclick="navigateToSection(\'project\')">' +
          '<span class="home-card-arrow">→</span>' +
          '<span class="home-card-title" data-zh>项目</span>' +
          '<span class="home-card-title" data-en>Project</span>' +
          '<span class="home-card-sub" data-zh>作品与实验</span>' +
          '<span class="home-card-sub" data-en>Works &amp; Experiments</span>' +
        '</button>' +
        '<button class="home-card" onclick="navigateToSection(\'articles\')">' +
          '<span class="home-card-arrow">→</span>' +
          '<span class="home-card-title" data-zh>文章</span>' +
          '<span class="home-card-title" data-en>Articles</span>' +
          '<span class="home-card-sub" data-zh>交易笔记与思考</span>' +
          '<span class="home-card-sub" data-en>Trading Notes &amp; Thoughts</span>' +
        '</button>' +
      '</div>' +
    '</section>';
}

// ── Render Sidebar Accordion ─────────────────────────────
function renderSidebar() {
  var nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  var r = getRoute();
  var html = '';
  var order = ['project', 'articles'];

  for (var k = 0; k < order.length; k++) {
    var key = order[k];
    var sn = sectionNames[key];

    var items = [];
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].section === key) items.push(articles[i]);
    }
    items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

    var isOpen = r.section === key;

    html += '<div class="nav-group' + (isOpen ? ' open' : '') + '">' +
      '<button class="nav-item' + (isOpen ? ' active' : '') + '" data-section="' + key + '">' +
        '<span class="nav-arrow">' + (isOpen ? '▾' : '▸') + '</span>' +
        '<span class="nav-zh" data-zh>' + sn.zh + '</span>' +
        '<span class="nav-en" data-en>' + sn.en + '</span>' +
        '<span class="nav-count">' + items.length + '</span>' +
      '</button>' +
      '<div class="sub-list">';

    for (var j = 0; j < items.length; j++) {
      var sub = items[j];
      var isActiveSub = r.articleId != null && r.articleId === sub._id && r.section === key;

      html += '<button class="sub-item' + (isActiveSub ? ' active' : '') + '" data-section="' + key + '" data-id="' + sub._id + '">' +
        '<span class="sub-item-title">' +
          '<span data-zh>' + esc(sub.zh.title) + '</span>' +
          '<span data-en>' + esc(sub.en.title) + '</span>' +
        '</span>' +
      '</button>';
    }

    html += '</div></div>';
  }

  nav.innerHTML = html;
}

// ── Render Section List ─────────────────────────────────
function renderSectionList(section, tags) {
  if (!sectionNames[section]) section = 'project';
  var main = document.getElementById('main-content');

  var items = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].section !== section) continue;
    // Multi-tag filter: article must have at least one selected tag
    if (tags && tags.length > 0) {
      var hasTag = false;
      if (articles[i].tags) {
        for (var t = 0; t < articles[i].tags.length; t++) {
          if (tags.indexOf(articles[i].tags[t].zh) >= 0) { hasTag = true; break; }
        }
      }
      if (!hasTag) continue;
    }
    items.push(articles[i]);
  }
  items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

  // Tags bar — always visible for articles section (multi-select)
  var tagsBar = '';
  if (section === 'articles') {
    var tagKeys = Object.keys(allTags).sort();
    if (tagKeys.length > 0) {
      tagsBar = '<div class="tags-bar">';
      for (var ti = 0; ti < tagKeys.length; ti++) {
        var tObj = allTags[tagKeys[ti]];
        var isActive = tags && tags.indexOf(tObj.zh) >= 0;
        tagsBar += '<button class="tags-bar-item' + (isActive ? ' active' : '') + '" data-tag-zh="' + esc(tObj.zh) + '">' +
          '<span data-zh>' + esc(tObj.zh) + '</span>' +
          '<span data-en>' + esc(tObj.en) + '</span>' +
        '</button>';
      }
      tagsBar += '</div>';
    }
  }

  // Cards
  var cards = '';
  for (var j = 0; j < items.length; j++) {
    var a = items[j];
    var tagHtml = '';
    if (a.tags) {
      for (var ti2 = 0; ti2 < a.tags.length; ti2++) {
        tagHtml += '<span class="card-tag" data-tag-zh="' + esc(a.tags[ti2].zh) + '">' +
          '<span data-zh>' + esc(a.tags[ti2].zh) + '</span>' +
          '<span data-en>' + esc(a.tags[ti2].en) + '</span>' +
        '</span>';
      }
    }
    cards += '<article class="card" data-article-id="' + a._id + '" data-section="' + section + '">' +
      tagHtml +
      '<h3 class="card-title">' +
        '<span data-zh>' + esc(a.zh.title) + '</span>' +
        '<span data-en>' + esc(a.en.title) + '</span>' +
      '</h3>' +
      '<time class="card-date">' + a.date + '</time>' +
      '<p class="card-desc">' +
        '<span data-zh>' + esc(a.zh.desc) + '</span>' +
        '<span data-en>' + esc(a.en.desc) + '</span>' +
      '</p>' +
    '</article>';
  }

  main.innerHTML =
    '<section class="section active">' +
      '<h2 class="section-title">' +
        '<span data-zh>' + sectionNames[section].zh + '</span>' +
        '<span data-en>' + sectionNames[section].en + '</span>' +
      '</h2>' +
      '<div class="section-divider"></div>' +
      tagsBar +
      '<div class="card-list">' + (cards || '<p class="empty-msg"><span data-zh>没有匹配的文章</span><span data-en>No matching articles</span></p>') + '</div>' +
    '</section>';
}

// ── Render Article Detail ───────────────────────────────
function renderArticleDetail(section, id) {
  var a = null;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].section === section && articles[i]._id === id) {
      a = articles[i];
      break;
    }
  }
  if (!a) { navigateToSection(section); return; }

  var bodyZh = a.zh.body || a.zh.desc;
  var bodyEn = a.en.body || a.en.desc;

  // Category tags in detail
  var detailTagHtml = '';
  if (a.tags) {
    for (var t = 0; t < a.tags.length; t++) {
      detailTagHtml += '<span class="article-cat-tag" data-tag-zh="' + esc(a.tags[t].zh) + '">' +
        '<span data-zh>' + esc(a.tags[t].zh) + '</span>' +
        '<span data-en>' + esc(a.tags[t].en) + '</span>' +
      '</span>';
    }
  }

  document.getElementById('main-content').innerHTML =
    '<div class="article-detail active">' +
      '<button class="article-back">← ' +
        '<span data-zh>返回</span>' +
        '<span data-en>Back</span>' +
      '</button>' +
      '<div class="article-tags">' +
        '<span class="article-tag">' +
          '<span data-zh>' + sectionNames[section].zh + '</span>' +
          '<span data-en>' + sectionNames[section].en + '</span>' +
        '</span>' +
        detailTagHtml +
      '</div>' +
      '<h1 class="article-header">' +
        '<span data-zh>' + esc(a.zh.title) + '</span>' +
        '<span data-en>' + esc(a.en.title) + '</span>' +
      '</h1>' +
      '<time class="article-date">' + a.date + '</time>' +
      '<div class="article-divider"></div>' +
      '<div class="article-body">' +
        '<span data-zh>' + bodyZh.replace(/\n/g, '<br>') + '</span>' +
        '<span data-en>' + bodyEn.replace(/\n/g, '<br>') + '</span>' +
      '</div>' +
      '<div class="comments-section">' +
        '<div class="comments-title">' +
          '<span data-zh>评论</span>' +
          '<span data-en>Comments</span>' +
        '</div>' +
        '<div class="giscus-container" id="giscus-container"></div>' +
      '</div>' +
    '</div>';

  setTimeout(function() { loadGiscus(section, id); }, 100);
}

function loadGiscus(section, id) {
  var container = document.getElementById('giscus-container');
  if (!container) return;
  container.innerHTML = '';

  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'shaoxin12/shaoxin12.github.io');
  script.setAttribute('data-repo-id', 'R_kgDOSiCCLw');
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDOSiCCL84C9cSq');
  script.setAttribute('data-mapping', 'specific');
  script.setAttribute('data-term', section + '-' + id);
  script.setAttribute('data-reactions-enabled', '0');
  script.setAttribute('data-emit-metadata', '0');
  script.setAttribute('data-input-position', 'top');
  script.setAttribute('data-theme', 'light');
  script.setAttribute('data-lang', currentLang);
  script.setAttribute('crossorigin', 'anonymous');
  script.async = true;
  container.appendChild(script);
}

function esc(s) {
  s = s || '';
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Language Toggle ─────────────────────────────────────
var currentLang = 'zh-CN';

function toggleLang() {
  currentLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
  document.documentElement.lang = currentLang;
  localStorage.setItem('lang', currentLang);
}

// ── Init ────────────────────────────────────────────────
var saved = localStorage.getItem('lang');
if (saved) {
  currentLang = saved;
  document.documentElement.lang = currentLang;
}

function handleRoute() {
  try {
    var r = getRoute();
    renderSidebar();

    if (r.home) {
      renderHome();
    } else if (r.articleId != null) {
      renderArticleDetail(r.section, r.articleId);
    } else {
      renderSectionList(r.section, r.tags);
    }
  } catch (err) {
    var main = document.getElementById('main-content');
    if (main) main.innerHTML = '<div style="padding:32px;color:var(--accent);font-family:monospace;"><strong>Error:</strong> ' + err.message + '</div>';
  }
}

window.addEventListener('hashchange', handleRoute);
handleRoute();
