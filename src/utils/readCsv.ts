import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'csv-parse/sync';

export async function readCsv<T = Record<string, string>>(relPath: string): Promise<T[]> {
  const abs = join(process.cwd(), relPath);
  const buf = await readFile(abs);
  const records = parse(buf, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as T[];
  return records;
}
