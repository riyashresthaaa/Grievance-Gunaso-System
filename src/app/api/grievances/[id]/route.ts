import { NextResponse } from 'next/server';
import { getAllGrievances } from '../route';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;
  const all = await getAllGrievances();
  const one = all.find((r) => r.id === id);
  if (!one) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(one);
}
