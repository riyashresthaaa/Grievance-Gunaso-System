import { NextResponse } from 'next/server';
import { readCsv } from '@/utils/readCsv';
import { getAllGrievances } from '../../route';
import { timelineAdds } from '@/app/api/_memory';

export type TL = { grievance_id: string; ts: string; label_en: string; label_np: string; done: string | boolean };

export async function GET(_: Request, ctx: { params: { id: string } }) {
  const id = ctx.params.id;

  const all = await getAllGrievances();
  const t = await readCsv<TL>('src/data/timeline.csv');

  const base = t
    .filter((x) => x.grievance_id === id)
    .map((x) => ({
      id: `${x.grievance_id}-${x.ts}`,
      timestamp: x.ts,
      label_en: x.label_en,
      label_np: x.label_np,
      done: x.done === true || x.done === 'true',
    }));

  const mem = (timelineAdds[id] ?? []).map((x) => ({
    id: `${x.grievance_id}-${x.ts}`,
    timestamp: x.ts,
    label_en: x.label_en,
    label_np: x.label_np,
    done: x.done,
  }));

  const items = [...base, ...mem].sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (items.length === 0) {
    const g = all.find((r) => r.id === id);
    if (g) {
      items.push({
        id: `${id}-${g.created_at_iso}`,
        timestamp: g.created_at_iso,
        label_en: 'Submitted',
        label_np: 'दर्ता भयो',
        done: true,
      });
    }
  }

  return NextResponse.json(items);
}
