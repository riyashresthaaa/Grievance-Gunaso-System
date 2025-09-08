import { NextResponse } from 'next/server';
import { readCsv } from '@/utils/readCsv';
import type { Category } from '../categories/route';

export type GrievanceCsv = {
  id: string;
  title_en: string;
  title_np: string;
  category_id: string;
  ward_id: string;
  status: string;
  priority: 'Low' | 'Medium' | 'High';
  created_at_iso: string;
};

export type Grievance = GrievanceCsv & {
  description_en?: string;
  description_np?: string;
};

// ✅ export these so other routes can see new items
export let memoryAdds: Grievance[] = [];
let seq = 1001;

export async function getAllGrievances(): Promise<Grievance[]> {
  const seed = await readCsv<GrievanceCsv>('src/data/grievances.csv');
  return [...seed, ...memoryAdds];
}

async function defaultPriorityForCategory(catId?: string): Promise<'Low' | 'Medium' | 'High'> {
  try {
    const cats = await readCsv<Category>('src/data/categories.csv');
    const cat = cats.find((c) => c.id === String(catId));
    if (cat?.priority === 'High' || cat?.priority === 'Medium' || cat?.priority === 'Low') return cat.priority;
  } catch {}
  return 'Medium';
}

export async function GET() {
  const rows = await getAllGrievances();
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = String(body?.title ?? '').trim();
  const title_np = String(body?.title_np ?? title);
  const description = String(body?.description ?? '').trim();
  const category_id = String(body?.categoryId ?? '');
  const ward_id = String(body?.wardId ?? '');
  if (!title || !category_id || !ward_id) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  const year = new Date().getFullYear();
  const id = `G-${year}-${String(seq++).padStart(4, '0')}`;
  const created_at_iso = new Date().toISOString();
  const priority = await defaultPriorityForCategory(category_id);

  const g: Grievance = {
    id,
    title_en: title,
    title_np,
    description_en: description,
    description_np: description,
    category_id,
    ward_id,
    status: 'New',
    priority,
    created_at_iso,
  };
  memoryAdds.push(g);
  return NextResponse.json(g, { status: 201 });
}
