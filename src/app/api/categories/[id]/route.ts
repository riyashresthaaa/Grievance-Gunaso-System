import { NextResponse } from 'next/server';
import { removeCategory } from '../../_store';

export const dynamic = 'force-dynamic';

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  removeCategory(ctx.params.id);
  return NextResponse.json({ ok: true }, { status: 200 });
}
