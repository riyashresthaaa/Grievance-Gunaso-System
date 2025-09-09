// src/components/admin/ClientGrievancesList.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TextInput,
  Dropdown,
  Pagination,
} from '@carbon/react';
import StatusTag from '@/components/shared/StatusTag';
import PriorityTag from '@/components/shared/PriorityTag';

export type GrievanceRow = {
  id: string;
  title?: string;        // may be undefined
  title_en?: string;     // often present
  ward?: string;         // ward id like "1"
  ward_id?: string;      // sometimes this
  category?: string;     // category id like "3"
  category_id?: string;  // sometimes this
  status: 'New' | 'In Progress' | 'Resolved' | 'Rejected' | string;
  priority: 'Low' | 'Medium' | 'High' | string;
  created_at?: string;   // ISO string
  created_at_iso?: string;
};

type Option = { id: string; label: string };

type Props = {
  initialRows: GrievanceRow[];
  categories?: Option[]; // [{id:'1', label:'Road & Infrastructure'}, ...]
  wards?: Option[];      // [{id:'2', label:'Ward 2'}, ...]
};

function toStr(v: unknown) {
  return typeof v === 'string' ? v : v == null ? '' : String(v);
}
function lc(v: unknown) {
  return toStr(v).toLowerCase();
}
function lookupLabel(id: string | undefined, list?: Option[]) {
  if (!id || !list) return '';
  return list.find((o) => o.id === id)?.label ?? '';
}

export default function ClientGrievancesList({ initialRows, categories, wards }: Props) {
  const [filters, setFilters] = useState<{
    q?: string;
    status?: string;
    priority?: string;
    ward?: string;
    category?: string;
  }>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter safely
  const filtered = useMemo(() => {
    return initialRows.filter((r) => {
      const q = lc(filters.q ?? '');

      // Normalize fields safely
      const id = toStr(r.id);
      const title = toStr(r.title ?? r.title_en); // prefer explicit title, then EN
      const status = toStr(r.status);
      const priority = toStr(r.priority);
      const wardId = toStr(r.ward ?? r.ward_id);
      const catId = toStr(r.category ?? r.category_id);

      const inQ = !q || lc(id).includes(q) || lc(title).includes(q);
      const inStatus = !filters.status || status === filters.status;
      const inPriority = !filters.priority || priority === filters.priority;
      const inWard = !filters.ward || wardId === filters.ward;
      const inCat = !filters.category || catId === filters.category;

      return inQ && inStatus && inPriority && inWard && inCat;
    });
  }, [initialRows, filters]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const headers = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'ward', header: 'Ward' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
    { key: 'priority', header: 'Priority' },
    { key: 'created', header: 'Created' },
  ];

  // ✅ Build table rows with label fallbacks (never blank/“null”)
  const rows = pageRows.map((r) => {
    const wardId = String(r.ward ?? r.ward_id ?? '');
    const catId = String(r.category ?? r.category_id ?? '');
    const wardText = lookupLabel(wardId, wards) || (wardId ? `Ward ${wardId}` : '—');
    const catText = lookupLabel(catId, categories) || (catId || '—');

    return {
      id: r.id,
      title: toStr(r.title ?? r.title_en),
      ward: wardText,
      category: catText,
      status: r.status,
      priority: r.priority,
      created: toStr(r.created_at ?? r.created_at_iso ?? ''),
    };
  });

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      {/* Simple filter bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextInput
          id="flt-q"
          labelText="Search"
          placeholder="ID or title"
          value={filters.q ?? ''}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.currentTarget.value }))}
        />
        <Dropdown
          id="flt-status"
          titleText="Status"
          label="All"
          items={['', 'New', 'In Progress', 'Resolved', 'Rejected']}
          selectedItem={filters.status ?? ''}
          itemToString={(s) => (s ? String(s) : 'All')}
          onChange={(e: { selectedItem?: string | null }) =>
            setFilters((f) => ({ ...f, status: e.selectedItem || undefined }))
          }
        />
        <Dropdown
          id="flt-prio"
          titleText="Priority"
          label="All"
          items={['', 'Low', 'Medium', 'High']}
          selectedItem={filters.priority ?? ''}
          itemToString={(s) => (s ? String(s) : 'All')}
          onChange={(e: { selectedItem?: string | null }) =>
            setFilters((f) => ({ ...f, priority: e.selectedItem || undefined }))
          }
        />
        <Dropdown
          id="flt-ward"
          titleText="Ward"
          label="All"
          items={['', ...(wards ?? []).map((w) => w.id)]}
          selectedItem={filters.ward ?? ''}
          itemToString={(id) => (id ? lookupLabel(String(id), wards) || `Ward ${id}` : 'All')}
          onChange={(e: { selectedItem?: string | null }) =>
            setFilters((f) => ({ ...f, ward: e.selectedItem || undefined }))
          }
        />
        <Dropdown
          id="flt-cat"
          titleText="Category"
          label="All"
          items={['', ...(categories ?? []).map((c) => c.id)]}
          selectedItem={filters.category ?? ''}
          itemToString={(id) => (id ? lookupLabel(String(id), categories) || String(id) : 'All')}
          onChange={(e: { selectedItem?: string | null }) =>
            setFilters((f) => ({ ...f, category: e.selectedItem || undefined }))
          }
        />
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <Table size="sm" useZebraStyles>
            <TableHead>
              <TableRow>
                {headers.map((h) => {
                  const headerProps = getHeaderProps({ header: h }) as any;
                  const { key, ...rest } = headerProps;
                  return (
                    <TableHeader key={key} {...rest}>
                      {h.header}
                    </TableHeader>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const rowProps = getRowProps({ row }) as any;
                const { key: rowKey, ...rowRest } = rowProps;

                return (
                  <TableRow key={rowKey} {...rowRest}>
                    {row.cells.map((cell: any) => {
                      const headerKey = cell.info.header as string;
                      if (headerKey === 'status') {
                        return (
                          <TableCell key={cell.id}>
                            <StatusTag value={String(cell.value)} />
                          </TableCell>
                        );
                      }
                      if (headerKey === 'priority') {
                        return (
                          <TableCell key={cell.id}>
                            <PriorityTag value={String(cell.value)} />
                          </TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value as any}</TableCell>;
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <Pagination
        page={page}
        pageSize={pageSize}
        pageSizes={[10, 20, 50]}
        totalItems={total}
        onChange={({ page, pageSize }) => {
          setPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}
