import { getArticles, getAllTags, Article } from './articles';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateArticlesJSON(articles: Article[]): string {
  const lines: string[] = [];
  lines.push('var articles = [');

  const projectArticles = articles.filter(a => a.section === 'project');
  const articleArticles = articles.filter(a => a.section === 'articles');

  // Project section
  lines.push('  // ── 项目 ──────────────────────────────────────────────');
  for (let i = 0; i < projectArticles.length; i++) {
    const a = projectArticles[i];
    lines.push('  {');
    lines.push("    section: 'project',");
    lines.push(`    date: '${a.date}',`);
    lines.push('    zh: {');
    lines.push(`      title: '${esc(a.zh_title)}',`);
    lines.push(`      desc: '${esc(a.zh_desc)}',`);
    lines.push(`      body: '${esc(a.zh_body).replace(/\n/g, '\\n')}'`);
    lines.push('    },');
    lines.push('    en: {');
    lines.push(`      title: '${esc(a.en_title)}',`);
    lines.push(`      desc: '${esc(a.en_desc)}',`);
    lines.push(`      body: '${esc(a.en_body).replace(/\n/g, '\\n')}'`);
    lines.push('    }');
    lines.push('  }' + (i < projectArticles.length - 1 || articleArticles.length > 0 ? ',' : ''));
  }

  // Articles section
  lines.push('');
  lines.push('  // ── 文章 ──────────────────────────────────────────────');
  for (let i = 0; i < articleArticles.length; i++) {
    const a = articleArticles[i];
    const tagsStr = a.tags.map(t => `{ zh: '${esc(t.zh)}', en: '${esc(t.en)}' }`).join(', ');
    lines.push('  {');
    lines.push("    section: 'articles',");
    lines.push(`    date: '${a.date}',`);
    lines.push(`    tags: [${tagsStr}],`);
    lines.push('    zh: {');
    lines.push(`      title: '${esc(a.zh_title)}',`);
    lines.push(`      desc: '${esc(a.zh_desc)}',`);
    lines.push(`      body: '${esc(a.zh_body).replace(/\n/g, '\\n')}'`);
    lines.push('    },');
    lines.push('    en: {');
    lines.push(`      title: '${esc(a.en_title)}',`);
    lines.push(`      desc: '${esc(a.en_desc)}',`);
    lines.push(`      body: '${esc(a.en_body).replace(/\n/g, '\\n')}'`);
    lines.push('    }');
    lines.push('  }' + (i < articleArticles.length - 1 ? ',' : ''));
  }

  lines.push('];');
  return lines.join('\n');
}

import { readFileSync } from 'fs';
import { join } from 'path';

function readStaticFile(filename: string): string {
  return readFileSync(join(process.cwd(), filename), 'utf-8');
}

export async function buildStaticHTML(): Promise<{ html: string; css: string }> {
  const articles = await getArticles();

  // Read the old index.html as template
  const oldIndex = readStaticFile('_old_index.html');

  // Generate new articles data
  const newArticlesJSON = generateArticlesJSON(articles);

  // Replace the articles array in the old HTML
  // The pattern is: var articles = [ ... ];
  const startMarker = 'var articles = [';
  const endMarker = '\n];';
  const startIdx = oldIndex.indexOf(startMarker);
  const endIdx = oldIndex.indexOf(endMarker, startIdx) + endMarker.length;

  const newHTML = oldIndex.slice(0, startIdx) + newArticlesJSON + oldIndex.slice(endIdx);

  // Read the old style.css
  const css = readStaticFile('_old_style.css');

  return { html: newHTML, css };
}

export async function publishToGitHub(html: string, css: string, token: string): Promise<string> {
  const owner = 'yangshaoxin12';
  const repo = 'yangshaoxin12.github.io';
  const branch = 'master';

  const files = [
    { path: 'index.html', content: html },
    { path: 'style.css', content: css },
  ];

  for (const file of files) {
    // Get current file SHA (if exists)
    let sha = '';
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}?ref=${branch}`,
        { headers: { Authorization: `token ${token}`, 'User-Agent': 'website-publish' } }
      );
      if (getRes.ok) {
        const data = await getRes.json();
        sha = data.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    // Create or update file
    const body: any = {
      message: `publish: update ${file.path}`,
      content: Buffer.from(file.content, 'utf-8').toString('base64'),
      branch,
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${file.path}`,
      {
        method: 'PUT',
        headers: { Authorization: `token ${token}`, 'User-Agent': 'website-publish', 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(`GitHub API error for ${file.path}: ${JSON.stringify(err)}`);
    }
  }

  return `https://${owner}.github.io`;
}
