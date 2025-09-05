// src/app/api/grievances/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

export async function GET() {
  const file = join(process.cwd(), 'src', 'data', 'grievances.csv');
  const csv = await fs.readFile(file, 'utf-8');
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return NextResponse.json(records);
}
