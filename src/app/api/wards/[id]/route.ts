import { NextResponse } from 'next/server';
import { removeWard } from '../../_store';

export const dynamic = 'force-dynamic';

export async function DELETE(_: Request, ctx: { params: { id: string } }) {
  removeWard(ctx.params.id);
  return NextResponse.json({ ok: true }, { status: 200 });
}
