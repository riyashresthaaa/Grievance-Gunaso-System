import { NextResponse } from 'next/server';
import { addWard, loadSeedWards } from '../_store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const all = await loadSeedWards();
  return NextResponse.json(all, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const w = addWard({
    id: body.id ? String(body.id) : undefined,
    name: body.name ? String(body.name) : undefined,
  });
  return NextResponse.json(w, { status: 201 });
}
