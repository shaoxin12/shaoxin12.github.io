// ── Assign IDs ──────────────────────────────────────────
var articleId = 0;
for (var i = 0; i < articles.length; i++) {
  articles[i]._id = articleId++;
}

var sectionNames = {
  life:    { zh: '生活', en: 'Life' },
  spec:    { zh: '投机', en: 'Spec' },
  project: { zh: '项目', en: 'Project' }
};

// ── Routing ─────────────────────────────────────────────
function getRoute() {
  var h = location.hash.replace('#', '') || '/life';
  var parts = h.replace(/^\/+/, '').split('/');
  return {
    section: parts[0] || 'life',
    articleId: parts[1] != null ? parseInt(parts[1]) : null
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
  var main = document.getElementById('main-content');

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
  var main = document.getElementById('main-content');

  var items = [];
  for (var i = 0; i < articles.length; i++) {
    if (articles[i].section === section) items.push(articles[i]);
  }
  items.sort(function(a, b) { return b.date > a.date ? 1 : -1; });

  var cards = '';
  for (var j = 0; j < items.length; j++) {
    var a = items[j];
    cards += '<article class="card" onclick="openArticle(\'' + section + '\', ' + a._id + ')">' +
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

  document.getElementById('main-content').innerHTML =
    '<div class="article-detail active">' +
      '<button class="article-back" onclick="goBack()">← ' +
        '<span data-zh>返回</span>' +
        '<span data-en>Back</span>' +
      '</button>' +
      '<div class="article-tag">' +
        '<span data-zh>' + sectionNames[section].zh + '</span>' +
        '<span data-en>' + sectionNames[section].en + '</span>' +
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
    '</div>';
}

function esc(s) {
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
