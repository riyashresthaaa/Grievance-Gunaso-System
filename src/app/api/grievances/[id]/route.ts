import { NextResponse } from 'next/server';
import { getGrievanceById, patchGrievance } from '../../_store';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const item = await getGrievanceById(ctx.params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item, { status: 200 });
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;
  const body = await req.json().catch(() => ({}));
  const patch: any = {};
  if (typeof body.owner === 'string') patch.owner = body.owner;
  if (typeof body.status === 'string') patch.status = body.status;
  if (typeof body.priority === 'string') patch.priority = body.priority;
  patchGrievance(id, patch);
  return NextResponse.json({ ok: true }, { status: 200 });
}
