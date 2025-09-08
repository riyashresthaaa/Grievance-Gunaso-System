import { NextResponse } from 'next/server';
import { commentsAdds, timelineAdds } from '@/app/api/_memory';

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;
  const rows = commentsAdds[id] ?? [];
  return NextResponse.json(rows);
}

export async function POST(req: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;
  const body = await req.json().catch(() => ({}));
  const text = String(body?.text ?? '').trim();
  if (!text) return NextResponse.json({ message: 'Missing text' }, { status: 400 });

  const now = new Date().toISOString();
  const rec = { id: `${id}-${now}`, grievance_id: id, text, created_at_iso: now };

  commentsAdds[id] = [...(commentsAdds[id] ?? []), rec];

  // Also push a timeline entry so detail page shows it immediately
  const tl = { grievance_id: id, ts: now, label_en: 'Citizen commented', label_np: 'नागरिकको टिप्पणी', done: false };
  timelineAdds[id] = [...(timelineAdds[id] ?? []), tl];

  return NextResponse.json(rec, { status: 201 });
}
