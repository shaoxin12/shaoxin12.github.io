// ── Render articles from content.js ────────────────────────
function renderAll() {
  const groups = { life: [], spec: [], project: [] };

  // Group and sort by date descending
  for (const a of articles) {
    if (groups[a.section]) groups[a.section].push(a);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (b.date > a.date ? 1 : -1));
  }

  // Render each section
  for (const [section, items] of Object.entries(groups)) {
    const container = document.getElementById('card-list-' + section);
    if (!container) continue;

    container.innerHTML = items.map(a => `
      <article class="card">
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
