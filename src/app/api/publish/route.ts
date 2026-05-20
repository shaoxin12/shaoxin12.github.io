import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { buildStaticHTML, publishToGitHub } from '@/lib/publish';

export async function POST() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'GITHUB_TOKEN not configured' }, { status: 500 });
  }

  try {
    const { html, css } = await buildStaticHTML();
    const url = await publishToGitHub(html, css, token);

    // Clear ISR cache for all public pages
    revalidatePath('/', 'layout');
    revalidatePath('/project', 'layout');
    revalidatePath('/articles', 'layout');

    return NextResponse.json({ ok: true, url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
