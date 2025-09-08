'use client';

import AppDataTable, { GrievanceRow } from '@/components/shared/AppDataTable';
import FilterBar from '@/components/shared/FilterBar';
import { useMemo, useState } from 'react';

type Opt = { id: string; label: string };

export type CitizenRow = {
  id: string;
  title_en: string;
  title_np: string;
  category_id: string;
  ward_id: string;
  status: string;
  priority: string;
  created_at_iso: string;
};

export default function ClientCitizenList({
  initialAll,
  categories,
  lang = 'en',
}: {
  initialAll: CitizenRow[];
  categories: Opt[];
  lang?: 'en' | 'np';
}) {
  const myIds: string[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('myGrievances') || '[]'); } catch { return []; }
  }, []);
  const onlyMine = initialAll.filter((r) => myIds.includes(r.id));

  const wardLabel = (w: string) => `Ward ${w}`;
  const catLabel = (c: string) => categories.find((x) => x.id === c)?.label ?? c;

  const [filters, setFilters] = useState<{ q: string; status?: string; priority?: string; ward?: string; range?: [Date, Date] }>({ q: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const asTableRows = (rows: CitizenRow[]): GrievanceRow[] =>
    rows.map((r) => ({
      id: r.id,
      title: lang === 'np' ? r.title_np || r.title_en : r.title_en,
      ward: wardLabel(r.ward_id),
      category: catLabel(r.category_id),
      status: r.status,
      priority: r.priority,
      createdAt: r.created_at_iso,
    }));

  const filtered = useMemo(() => {
    return onlyMine.filter((r) => {
      const q = filters.q?.toLowerCase() ?? '';
      const label = (lang === 'np' ? r.title_np || r.title_en : r.title_en).toLowerCase();
      const inQ = !q || r.id.toLowerCase().includes(q) || label.includes(q);
      const inStatus = !filters.status || r.status === filters.status;
      const inPriority = !filters.priority || r.priority === filters.priority;
      const inWard = !filters.ward || r.ward_id === filters.ward;
      const inRange = !filters.range || (
        new Date(r.created_at_iso) >= filters.range[0] && new Date(r.created_at_iso) <= filters.range[1]
      );
      return inQ && inStatus && inPriority && inWard && inRange;
    });
  }, [onlyMine, filters, lang]);

  const pageRows = filtered.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

  const statusOptions: Opt[] = [
    { id: 'New', label: 'New' },
    { id: 'Open', label: 'Open' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Rejected', label: 'Rejected' },
  ];
  const priorityOptions: Opt[] = [
    { id: 'Low', label: 'Low' },
    { id: 'Medium', label: 'Medium' },
    { id: 'High', label: 'High' },
  ];
  const wardOptions: Opt[] = Array.from(new Set(onlyMine.map((r) => r.ward_id))).map((w) => ({ id: w, label: `Ward ${w}` }));

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <FilterBar
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        wardOptions={wardOptions}
        onApply={(f) => { setFilters(f); setPage(1); }}
        onClear={() => { setFilters({ q: '' }); setPage(1); }}
      />

      <AppDataTable
        rows={asTableRows(pageRows)}
        loading={false}
        error={null}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
      />
    </div>
  );
}
