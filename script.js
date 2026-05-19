// ── Assign IDs to articles for modal lookup ──────────────
let articleId = 0;
for (const a of articles) {
  a._id = articleId++;
}

// ── Render articles from content.js ────────────────────────
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

    container.innerHTML = items.map(a => `
      <article class="card" onclick="openModal(${a._id})">
        <h3 class="card-title">
          <span data-zh>${a.zh.title}</span>
          <span data-en>${a.en.title}</span>
        </h3>
        <time class="card-date" datetime="${a.date}">${a.date}</time>
        <p class="card-desc">
          <span data-zh>${a.zh.desc}</span>
          <span data-en>${a.en.desc}</span>
        </p>
      </article>
    `).join('');
  }
}

// ── Modal ────────────────────────────────────────────────
const sectionNames = {
  life:   { zh: '生活', en: 'Life' },
  spec:   { zh: '投机', en: 'Spec' },
  project:{ zh: '项目', en: 'Project' }
};

function openModal(id) {
  const a = articles.find(x => x._id === id);
  if (!a) return;

  const bodyZh = a.zh.body || a.zh.desc;
  const bodyEn = a.en.body || a.en.desc;

  document.getElementById('modal-tag').innerHTML =
    `<span data-zh>${sectionNames[a.section].zh}</span><span data-en>${sectionNames[a.section].en}</span>`;

  document.getElementById('modal-title').innerHTML =
    `<span data-zh>${a.zh.title}</span><span data-en>${a.en.title}</span>`;

  document.getElementById('modal-date').textContent = a.date;

  document.getElementById('modal-body').innerHTML =
    `<span data-zh>${bodyZh.replace(/\n/g, '<br>')}</span><span data-en>${bodyEn.replace(/\n/g, '<br>')}</span>`;

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Language Toggle ───────────────────────────────────────
let currentLang = 'zh-CN';

function toggleLang() {
  currentLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
  document.documentElement.lang = currentLang;
  localStorage.setItem('lang', currentLang);
}

// ── Section Switching ─────────────────────────────────────
function switchSection(section) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const target = document.getElementById('section-' + section);
  if (target) target.classList.add('active');

  const nav = document.querySelector('[data-section="' + section + '"]');
  if (nav) nav.classList.add('active');
}

// ── Init ──────────────────────────────────────────────────
const saved = localStorage.getItem('lang');
if (saved) {
  currentLang = saved;
  document.documentElement.lang = currentLang;
}

renderAll();
