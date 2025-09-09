import { NextResponse } from 'next/server';
import { addCategory, loadSeedCategories } from '../_store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const all = await loadSeedCategories();
  return NextResponse.json(all, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body?.name_en) return NextResponse.json({ error: 'name_en required' }, { status: 400 });
  const c = addCategory({
    id: body.id ? String(body.id) : undefined,
    name_en: String(body.name_en),
    name_np: body.name_np ? String(body.name_np) : '',
    priority: body.priority ? String(body.priority) : 'Medium',
  });
  return NextResponse.json(c, { status: 201 });
}
