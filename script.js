// ── Assign IDs ──────────────────────────────────────────
var articleId = 0;
for (var i = 0; i < articles.length; i++) {
  articles[i]._id = articleId++;
}

var sectionNames = {
  project:  { zh: '项目', en: 'Project' },
  articles: { zh: '文章', en: 'Articles' }
};

// ── Collect all tags ────────────────────────────────────
var allTags = {};
for (var i = 0; i < articles.length; i++) {
  var t = articles[i].tag;
  if (t) { allTags[t.zh] = t; }
}

// ── Routing ─────────────────────────────────────────────
function getRoute() {
  var h = location.hash.replace('#', '') || '/project';
  var parts = h.replace(/^\/+/, '').split('/');

  var route = {
    section: parts[0] || 'project',
    articleId: null,
    tag: null
  };

  // Check for tag filter: /articles/tag/交易
  if (parts.length >= 3 && parts[1] === 'tag') {
    route.tag = decodeURIComponent(parts[2]);
    route.articleId = null;
  } else if (parts.length > 1 && parts[1] !== '') {
    route.articleId = parseInt(parts[1]);
  }

  return route;
}

function navigateToSection(section) {
  location.hash = '/' + section;
}

function openArticle(section, id) {
  location.hash = '/' + section + '/' + id;
}

function goBack() {
  var r = getRoute();
  location.hash = '/' + r.section + (r.tag ? '/tag/' + encodeURIComponent(r.tag) : '');
}

function filterByTag(tagZh) {
  location.hash = '/articles/tag/' + encodeURIComponent(tagZh);
}

function clearTagFilter() {
  location.hash = '/articles';
}

// ── Event Delegation ────────────────────────────────────
document.addEventListener('click', function(e) {
  // Card click
  var card = e.target.closest('.card');
  if (card) {
    var id = parseInt(card.getAttribute('data-article-id'));
    var section = card.getAttribute('data-section');
    if (!isNaN(id) && section) openArticle(section, id);
    return;
  }

  // Sidebar sub-item click
  var sub = e.target.closest('.sub-item');
  if (sub) {
    var sid = parseInt(sub.getAttribute('data-id'));
    var ssection = sub.getAttribute('data-section');
    if (!isNaN(sid) && ssection) openArticle(ssection, sid);
    return;
  }

  // Sidebar nav toggle click
  var navToggle = e.target.closest('.nav-item');
  if (navToggle) {
    var s = navToggle.getAttribute('data-section');
    navigateToSection(s);
    return;
  }

  // Tag badge click on card
  var tagBadge = e.target.closest('.card-tag');
  if (tagBadge) {
    e.stopPropagation(); // prevent card click
    var tzh = tagBadge.getAttribute('data-tag-zh');
    if (tzh) filterByTag(tzh);
    return;
  }

  // Tag badge click in article detail
  var detailTag = e.target.closest('.article-cat-tag');
  if (detailTag) {
    var dtzh = detailTag.getAttribute('data-tag-zh');
    if (dtzh) filterByTag(dtzh);
    return;
  }

  // Back button
  if (e.target.closest('.article-back')) {
    goBack();
    return;
  }

  // Clear filter
  var clearBtn = e.target.closest('.filter-clear');
  if (clearBtn) {
    clearTagFilter();
    return;
  }
});

// ── Render Sidebar ──────────────────────────────────────
function renderSidebar() {
  var nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  var r = getRoute();
  var html = '';

  var order = ['project', 'articles'];
  for (var k = 0; k < order.length; k++) {
    var key = order[k];
    var sn = sectionNames[key];

    // Get articles for this section
    var items = [];
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].section === key) items.push(articles[i]);
    }
    items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

    var isActive = r.section === key;

    html += '<div class="nav-group' + (isActive ? ' open' : '') + '">' +
      '<button class="nav-item' + (isActive ? ' active' : '') + '" data-section="' + key + '">' +
        '<span class="nav-arrow">' + (isActive ? '▼' : '▶') + '</span>' +
        '<span class="nav-zh" data-zh>' + sn.zh + '</span>' +
        '<span class="nav-en" data-en>' + sn.en + '</span>' +
        '<span class="nav-count">' + items.length + '</span>' +
      '</button>' +
      '<div class="sub-list">';

    for (var j = 0; j < items.length; j++) {
      var sub = items[j];
      html += '<button class="sub-item" data-section="' + key + '" data-id="' + sub._id + '">' +
        '<span data-zh>' + esc(sub.zh.title) + '</span>' +
        '<span data-en>' + esc(sub.en.title) + '</span>' +
        '<span class="sub-date">' + sub.date + '</span>' +
      '</button>';
    }

    html += '</div></div>';
  }

  nav.innerHTML = html;
}

// ── Render Section List ─────────────────────────────────
function renderSectionList(section, tag) {
  if (!sectionNames[section]) section = 'project';
  var main = document.getElementById('main-content');

  var items = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].section !== section) continue;
    if (tag && (!articles[i].tag || articles[i].tag.zh !== tag)) continue;
    items.push(articles[i]);
  }
  items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

  // Filter header
  var filterHtml = '';
  if (tag) {
    var tagObj = allTags[tag] || { zh: tag, en: tag };
    filterHtml = '<div class="filter-bar">' +
      '<span data-zh>筛选：</span>' +
      '<span data-en>Filter: </span>' +
      '<span class="filter-tag">' +
        '<span data-zh>' + esc(tagObj.zh) + '</span>' +
        '<span data-en>' + esc(tagObj.en) + '</span>' +
      '</span>' +
      '<button class="filter-clear">✕ ' +
        '<span data-zh>清除</span>' +
        '<span data-en>Clear</span>' +
      '</button>' +
    '</div>';
  }

  // Tags bar (only for articles section, not when filtering)
  var tagsBar = '';
  if (!tag && section === 'articles') {
    var tagKeys = Object.keys(allTags).sort();
    if (tagKeys.length > 0) {
      tagsBar = '<div class="tags-bar">';
      for (var t = 0; t < tagKeys.length; t++) {
        var tObj = allTags[tagKeys[t]];
        tagsBar += '<button class="tags-bar-item" onclick="filterByTag(\'' + esc(tObj.zh) + '\')">' +
          '<span data-zh>' + esc(tObj.zh) + '</span>' +
          '<span data-en>' + esc(tObj.en) + '</span>' +
        '</button>';
      }
      tagsBar += '</div>';
    }
  }

  var cards = '';
  for (var j = 0; j < items.length; j++) {
    var a = items[j];
    var tagHtml = '';
    if (a.tag) {
      tagHtml = '<span class="card-tag" data-tag-zh="' + esc(a.tag.zh) + '">' +
        '<span data-zh>' + esc(a.tag.zh) + '</span>' +
        '<span data-en>' + esc(a.tag.en) + '</span>' +
      '</span>';
    }
    cards += '<article class="card" data-article-id="' + a._id + '" data-section="' + section + '">' +
      tagHtml +
      '<h3 class="card-title">' +
        '<span data-zh>' + esc(a.zh.title) + '</span>' +
        '<span data-en>' + esc(a.en.title) + '</span>' +
      '</h3>' +
      '<time class="card-date" datetime="' + a.date + '">' + a.date + '</time>' +
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
      filterHtml +
      '<div class="card-list">' + cards + '</div>' +
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

  var detailTagHtml = '';
  if (a.tag) {
    detailTagHtml = '<span class="article-cat-tag" data-tag-zh="' + esc(a.tag.zh) + '">' +
      '<span data-zh>' + esc(a.tag.zh) + '</span>' +
      '<span data-en>' + esc(a.tag.en) + '</span>' +
    '</span>';
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

  setTimeout(loadGiscus, 50);
}

function loadGiscus() {
  var container = document.getElementById('giscus-container');
  if (!container) return;
  container.innerHTML = '';

  var script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.setAttribute('data-repo', 'hreplo/hreplo.github.io');
  script.setAttribute('data-repo-id', 'R_kgDOSiCCLw');
  script.setAttribute('data-category', 'General');
  script.setAttribute('data-category-id', 'DIC_kwDOSiCCL84C9cSq');
  script.setAttribute('data-mapping', 'url');
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
  var r = getRoute();
  renderSidebar();

  if (r.articleId != null) {
    renderArticleDetail(r.section, r.articleId);
  } else {
    renderSectionList(r.section, r.tag);
  }
}

window.addEventListener('hashchange', handleRoute);
handleRoute();
