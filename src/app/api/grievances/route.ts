import { NextResponse } from 'next/server';
import { createGrievance, getAllGrievances } from '../_store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const all = await getAllGrievances();
  return NextResponse.json(all, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body?.title) return NextResponse.json({ error: 'title required' }, { status: 400 });
  const g = createGrievance({
    title: String(body.title),
    title_np: body.title_np ? String(body.title_np) : undefined,
    category_id: body.category_id ? String(body.category_id) : undefined,
    ward_id: body.ward_id ? String(body.ward_id) : undefined,
    status: body.status ? String(body.status) : undefined,
    priority: body.priority ? String(body.priority) : undefined,
  });
  return NextResponse.json({ id: g.id }, { status: 201 });
}
