'use client';

import AppDataTable, { GrievanceRow } from '@/components/shared/AppDataTable';
import FilterBar from '@/components/shared/FilterBar';
import ModalConfirm from '@/components/shared/ModalConfirm';
import { useMemo, useState } from 'react';
import { useToaster } from '@/components/shared/Toaster';

type Option = { id: string; label: string };

export default function ClientGrievancesList({ initialRows }: { initialRows: GrievanceRow[] }) {
  const { notify } = useToaster();

  const statusOptions: Option[] = [
    { id: 'New', label: 'New' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Rejected', label: 'Rejected' },
  ];
  const priorityOptions: Option[] = [
    { id: 'Low', label: 'Low' },
    { id: 'Medium', label: 'Medium' },
    { id: 'High', label: 'High' },
  ];
  const wardOptions: Option[] = Array.from(new Set(initialRows.map(r => r.ward))).map(w => ({ id: w, label: w }));

  const [filters, setFilters] = useState<{ q: string; status?: string; priority?: string; ward?: string; range?: [Date, Date] }>({ q: '' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialRows.filter(r => {
      const q = filters.q?.toLowerCase() ?? '';
      const inQ = !q || r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q);
      const inStatus = !filters.status || r.status === filters.status;
      const inPriority = !filters.priority || r.priority === filters.priority;
      const inWard = !filters.ward || r.ward === filters.ward;
      const inRange = !filters.range || (
        new Date(r.createdAt) >= filters.range[0] && new Date(r.createdAt) <= filters.range[1]
      );
      return inQ && inStatus && inPriority && inWard && inRange;
    });
  }, [initialRows, filters]);

  const startIdx = (page - 1) * pageSize;
  const pageRows = filtered.slice(startIdx, startIdx + pageSize);

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
        rows={pageRows}
        loading={false}
        error={null}
        page={page}
        pageSize={pageSize}
        totalItems={filtered.length}
        onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
      />

      <ModalConfirm
        open={modalOpen}
        title={`Confirm action for ${selectedId ?? ''}`}
        primaryLabel="Confirm"
        onRequestClose={() => setModalOpen(false)}
        onConfirm={async () => {
          await new Promise(r => setTimeout(r, 800));
          notify('success', 'Action completed', `Ticket ${selectedId ?? ''} updated`);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
