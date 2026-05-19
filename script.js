// ── Assign IDs to articles ──────────────────────────────
let articleId = 0;
for (const a of articles) {
  a._id = articleId++;
}

// ── Render articles ──────────────────────────────────────
function renderAll() {
  const groups = { life: [], spec: [], project: [] };

  for (const a of articles) {
    if (groups[a.section]) groups[a.section].push(a);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.date > a.date ? 1 : -1));
  }

  for (const [section, items] of Object.entries(groups)) {
    const container = document.getElementById('card-list-' + section);
    if (!container) continue;

    container.innerHTML = items.map(a => {
      var t = a.zh.title.replace(/"/g, '&quot;');
      var te = a.en.title.replace(/"/g, '&quot;');
      var d = a.zh.desc.replace(/"/g, '&quot;');
      var de = a.en.desc.replace(/"/g, '&quot;');
      return '<article class="card" data-article-id="' + a._id + '">' +
        '<h3 class="card-title">' +
          '<span data-zh>' + t + '</span>' +
          '<span data-en>' + te + '</span>' +
        '</h3>' +
        '<time class="card-date" datetime="' + a.date + '">' + a.date + '</time>' +
        '<p class="card-desc">' +
          '<span data-zh>' + d + '</span>' +
          '<span data-en>' + de + '</span>' +
        '</p>' +
      '</article>';
    }).join('');
  }
}

// ── Modal ────────────────────────────────────────────────
const sectionNames = {
  life:   { zh: '生活', en: 'Life' },
  spec:   { zh: '投机', en: 'Spec' },
  project:{ zh: '项目', en: 'Project' }
};

function openModal(id) {
  var a = null;
  for (var i = 0; i < articles.length; i++) {
    if (articles[i]._id === id) { a = articles[i]; break; }
  }
  if (!a) return;

  var bodyZh = a.zh.body || a.zh.desc;
  var bodyEn = a.en.body || a.en.desc;

  document.getElementById('modal-tag').innerHTML =
    '<span data-zh>' + sectionNames[a.section].zh + '</span>' +
    '<span data-en>' + sectionNames[a.section].en + '</span>';

  document.getElementById('modal-title').innerHTML =
    '<span data-zh>' + a.zh.title + '</span>' +
    '<span data-en>' + a.en.title + '</span>';

  document.getElementById('modal-date').textContent = a.date;

  document.getElementById('modal-body').innerHTML =
    '<span data-zh>' + bodyZh.replace(/\n/g, '<br>') + '</span>' +
    '<span data-en>' + bodyEn.replace(/\n/g, '<br>') + '</span>';

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// Event delegation for card clicks
document.addEventListener('click', function(e) {
  var card = e.target.closest('.card');
  if (card) {
    var id = parseInt(card.getAttribute('data-article-id'));
    if (!isNaN(id)) openModal(id);
    return;
  }

  // Close button inside modal
  if (e.target.closest('.modal-close')) {
    closeModal();
    return;
  }

  // Click on overlay background (not on modal content)
  if (e.target === document.getElementById('modal-overlay')) {
    closeModal();
  }
});

// ESC to close
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeModal();
});

// ── Language Toggle ───────────────────────────────────────
var currentLang = 'zh-CN';

function toggleLang() {
  currentLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
  document.documentElement.lang = currentLang;
  localStorage.setItem('lang', currentLang);
}

// ── Section Switching ─────────────────────────────────────
function switchSection(section) {
  var sections = document.querySelectorAll('.section');
  for (var i = 0; i < sections.length; i++) sections[i].classList.remove('active');

  var navs = document.querySelectorAll('.nav-item');
  for (var j = 0; j < navs.length; j++) navs[j].classList.remove('active');

  var target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');

  var nav = document.querySelector('[data-section="' + section + '"]');
  if (nav) nav.classList.add('active');
}

// ── Init ──────────────────────────────────────────────────
var saved = localStorage.getItem('lang');
if (saved) {
  currentLang = saved;
  document.documentElement.lang = currentLang;
}

renderAll();
