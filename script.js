// ── Assign IDs ──────────────────────────────────────────
var articleId = 0;
for (var i = 0; i < articles.length; i++) {
  articles[i]._id = articleId++;
}

var sectionNames = {
  project:  { zh: '项目', en: 'Project' },
  articles: { zh: '文章', en: 'Articles' }
};

// ── Routing ─────────────────────────────────────────────
function getRoute() {
  var h = location.hash.replace('#', '') || '/project';
  var parts = h.replace(/^\/+/, '').split('/');
  return {
    section: parts[0] || 'project',
    articleId: (parts.length > 1 && parts[1] !== '') ? parseInt(parts[1]) : null
  };
}

function navigateToSection(section) {
  location.hash = '/' + section;
}

function openArticle(section, id) {
  location.hash = '/' + section + '/' + id;
}

function goBack() {
  var r = getRoute();
  location.hash = '/' + r.section;
}

function handleRoute() {
  var r = getRoute();

  // Update sidebar active
  var navs = document.querySelectorAll('.nav-item');
  for (var i = 0; i < navs.length; i++) {
    var s = navs[i].getAttribute('data-section');
    navs[i].classList.toggle('active', s === r.section);
  }

  if (r.articleId != null) {
    renderArticleDetail(r.section, r.articleId);
  } else {
    renderSectionList(r.section);
  }
}

// ── Render Section List ─────────────────────────────────
function renderSectionList(section) {
  if (!sectionNames[section]) section = 'project';
  var main = document.getElementById('main-content');

  var items = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].section === section) items.push(articles[i]);
  }
  items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

  var cards = '';
  for (var j = 0; j < items.length; j++) {
    var a = items[j];
    var tagHtml = '';
    if (a.tag) {
      tagHtml = '<span class="card-tag">' +
        '<span data-zh>' + esc(a.tag.zh) + '</span>' +
        '<span data-en>' + esc(a.tag.en) + '</span>' +
      '</span>';
    }
    cards += '<article class="card" onclick="openArticle(\'' + section + '\', ' + a._id + ')">' +
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
    detailTagHtml = '<span class="article-cat-tag">' +
      '<span data-zh>' + esc(a.tag.zh) + '</span>' +
      '<span data-en>' + esc(a.tag.en) + '</span>' +
    '</span>';
  }

  document.getElementById('main-content').innerHTML =
    '<div class="article-detail active">' +
      '<button class="article-back" onclick="goBack()">← ' +
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

  // Load Giscus after DOM update
  setTimeout(loadGiscus, 50);
}

function loadGiscus() {
  var container = document.getElementById('giscus-container');
  if (!container) return;

  // Remove old Giscus iframe if any
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

// Route on hash change
window.addEventListener('hashchange', handleRoute);

// Initial route
handleRoute();
