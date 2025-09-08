import { NextResponse } from 'next/server';
import { readCsv } from '@/utils/readCsv';
import type { TL } from '../grievances/[id]/timeline/route';
import { timelineAdds } from '@/app/api/_memory';

type Notification = {
  id: string;
  grievance_id: string;
  kind: 'info' | 'success' | 'warning' | 'error';
  title_en: string;
  title_np: string;
  created_at_iso: string;
};

function kindFor(label: string): Notification['kind'] {
  const l = label.toLowerCase();
  if (l.includes('resolved')) return 'success';
  if (l.includes('rejected') || l.includes('error')) return 'error';
  if (l.includes('in progress')) return 'warning';
  return 'info';
}

export async function GET() {
  const csv = await readCsv<TL>('src/data/timeline.csv');

  const fromCsv: Notification[] = csv.map((x) => ({
    id: `${x.grievance_id}-${x.ts}`,
    grievance_id: x.grievance_id,
    kind: kindFor(x.label_en),
    title_en: x.label_en,
    title_np: x.label_np,
    created_at_iso: x.ts,
  }));

  const fromMem: Notification[] = Object.values(timelineAdds).flat().map((x) => ({
    id: `${x.grievance_id}-${x.ts}`,
    grievance_id: x.grievance_id,
    kind: kindFor(x.label_en),
    title_en: x.label_en,
    title_np: x.label_np,
    created_at_iso: x.ts,
  }));

  const list = [...fromCsv, ...fromMem].sort((a, b) => b.created_at_iso.localeCompare(a.created_at_iso));
  return NextResponse.json(list);
}
