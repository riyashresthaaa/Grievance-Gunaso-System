import { NextResponse } from 'next/server';
import { readCsv } from '@/utils/readCsv';

export type Category = {
  id: string;
  name_en: string;
  name_np: string;
  priority: 'Low' | 'Medium' | 'High';
};

export async function GET() {
  const rows = await readCsv<Category>('src/data/categories.csv');
  return NextResponse.json(rows);
}
