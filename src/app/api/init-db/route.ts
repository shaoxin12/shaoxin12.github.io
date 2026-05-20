import { createArticlesTable } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await createArticlesTable();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
