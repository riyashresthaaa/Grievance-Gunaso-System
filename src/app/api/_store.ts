// src/app/api/_store.ts
import path from 'node:path';
import fs from 'node:fs/promises';
import { parse } from 'csv-parse/sync';

export type Grievance = {
  id: string;
  title_en: string;
  title_np?: string;
  category_id: string | null;
  ward_id: string | null;
  status: string;
  priority: string;
  created_at_iso: string;
  owner?: string | null;
};

export type Category = {
  id: string;
  name_en: string;
  name_np?: string;
  priority: 'Low' | 'Medium' | 'High' | string;
};

export type Ward = { id: string; name?: string };

// In-memory runtime data (no real DB)
const runtimeGrievances: Grievance[] = [];
const grievancePatches = new Map<string, Partial<Grievance>>();

const runtimeCategories: Category[] = [];
const deletedCategoryIds = new Set<string>();

const runtimeWards: Ward[] = [];
const deletedWardIds = new Set<string>();

async function readCsvSafe(rel: string): Promise<any[]> {
  try {
    const csvPath = path.join(process.cwd(), 'src', 'data', rel);
    const raw = await fs.readFile(csvPath, 'utf8');
    return parse(raw, { columns: true, skip_empty_lines: true }) as any[];
  } catch {
    return [];
  }
}

// ---------- Grievances ----------
export async function loadSeedGrievances(): Promise<Grievance[]> {
  const rows = await readCsvSafe('grievances.csv');
  return rows.map((r) => ({
    id: String(r.id),
    title_en: r.title_en ?? r.title ?? '',
    title_np: r.title_np ?? '',
    category_id: r.category_id ? String(r.category_id) : null,
    ward_id: r.ward_id ? String(r.ward_id) : null,
    status: String(r.status ?? 'New'),
    priority: String(r.priority ?? 'Medium'),
    created_at_iso: String(r.created_at_iso ?? new Date().toISOString()),
    owner: r.owner ?? null,
  }));
}

export async function getAllGrievances(): Promise<Grievance[]> {
  const seed = await loadSeedGrievances();
  const applyPatch = (g: Grievance): Grievance => {
    const p = grievancePatches.get(g.id);
    return p ? { ...g, ...p } : g;
  };
  return [...seed.map(applyPatch), ...runtimeGrievances.map(applyPatch)];
}

export function createGrievance(input: {
  title: string;
  title_np?: string;
  category_id?: string | null;
  ward_id?: string | null;
  status?: string;
  priority?: string;
}): Grievance {
  const id = `G-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const g: Grievance = {
    id,
    title_en: input.title,
    title_np: input.title_np ?? '',
    category_id: input.category_id ?? null,
    ward_id: input.ward_id ?? null,
    status: input.status ?? 'New',
    priority: input.priority ?? 'Medium',
    created_at_iso: new Date().toISOString(),
    owner: null,
  };
  runtimeGrievances.unshift(g);
  return g;
}

export async function getGrievanceById(id: string): Promise<Grievance | null> {
  const all = await getAllGrievances();
  return all.find((g) => g.id === id) ?? null;
}

export function patchGrievance(id: string, patch: Partial<Grievance>) {
  const current = grievancePatches.get(id) ?? {};
  grievancePatches.set(id, { ...current, ...patch });
}

// ---------- Categories ----------
export async function loadSeedCategories(): Promise<Category[]> {
  const rows = await readCsvSafe('categories.csv');
  const seed = rows.map((r) => ({
    id: String(r.id),
    name_en: r.name_en ?? '',
    name_np: r.name_np ?? '',
    priority: (r.priority ?? 'Medium') as Category['priority'],
  }));
  const alive = seed.filter((c) => !deletedCategoryIds.has(c.id));
  return [...alive, ...runtimeCategories];
}

export function addCategory(input: Omit<Category, 'id'> & { id?: string }): Category {
  const id = input.id ?? String(Date.now());
  const c: Category = { id, name_en: input.name_en, name_np: input.name_np, priority: input.priority };
  runtimeCategories.unshift(c);
  return c;
}

export function removeCategory(id: string) {
  deletedCategoryIds.add(id);
}

// ---------- Wards ----------
export async function loadSeedWards(): Promise<Ward[]> {
  const rows = await readCsvSafe('wards.csv');
  let seed: Ward[];
  if (rows.length > 0) {
    seed = rows.map((r) => ({ id: String(r.id), name: r.name ?? `Ward ${r.id}` }));
  } else {
    seed = Array.from({ length: 32 }, (_, i) => ({ id: String(i + 1), name: `Ward ${i + 1}` }));
  }
  const alive = seed.filter((w) => !deletedWardIds.has(w.id));
  return [...alive, ...runtimeWards];
}

export function addWard(input: { id?: string; name?: string }): Ward {
  const id = input.id ?? String(Date.now());
  const w: Ward = { id, name: input.name ?? `Ward ${id}` };
  runtimeWards.unshift(w);
  return w;
}

export function removeWard(id: string) {
  deletedWardIds.add(id);
}
