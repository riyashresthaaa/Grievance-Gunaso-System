'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  ComboBox, Dropdown, Button, InlineLoading, InlineNotification, Tile, Tag,
} from '@carbon/react';
import { useToaster } from '@/components/shared/Toaster';

type Row = {
  id: string;
  title_en: string;
  category_id: string | null;
  ward_id: string | null;
  status: string;
  priority: string;
  owner?: string | null;
  created_at_iso: string;
};

const STATUS = ['New', 'Open', 'In Progress', 'Resolved', 'Rejected'] as const;
const PRIORITY = ['Low', 'Medium', 'High'] as const;

// Fake owners for assigning
const OWNERS = ['Anil Sharma', 'Bina Karki', 'Chirag Thapa', 'Deepa Shrestha'];

export default function AdminTriagePage() {
  const { notify } = useToaster();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/grievances', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load');
        const all = (await res.json()) as Row[];
        if (!cancel) setRows(all);
      } catch (e) {
        if (!cancel) setErr((e as Error).message || 'Failed to load');
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  const queue = useMemo(
    () => rows.filter((r) => !['Resolved', 'Rejected'].includes(r.status)),
    [rows]
  );

  const headers = [
    { key: 'id', header: 'ID' },
    { key: 'title', header: 'Title' },
    { key: 'status', header: 'Status' },
    { key: 'priority', header: 'Priority' },
    { key: 'owner', header: 'Owner' },
    { key: 'actions', header: 'Actions' },
  ];

  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<Row>>>({});

  const setDraft = (id: string, patch: Partial<Row>) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));

  const doSave = async (id: string) => {
    const patch = drafts[id];
    if (!patch) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: patch.owner,
          status: patch.status,
          priority: patch.priority,
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      setRows((rs) =>
        rs.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
      notify('success', 'Assignment updated');
    } catch {
      notify('error', 'Failed to update');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Tile style={{ padding: 'var(--cds-spacing-05)' }}>
        <InlineLoading description="Loading queue…" />
      </Tile>
    );
  }
  if (err) {
    return (
      <InlineNotification kind="error" title="Error" subtitle={err} role="alert" />
    );
  }

  const tableRows = queue.map((r) => ({
    id: r.id,
    title: r.title_en,
    status: r.status,
    priority: r.priority,
    owner: r.owner ?? '',
  }));

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 className="cds--type-productive-heading-03" style={{ margin: 0 }}>
        Queue & Assign
      </h2>

      <DataTable rows={tableRows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <Table size="sm" useZebraStyles>
            <TableHead>
              <TableRow>
                {headers.map((h) => {
                  const headerProps = getHeaderProps({ header: h });
                  const { key, ...rest } = headerProps as any;
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
                const r = queue.find((g) => g.id === row.id)!;

                const rowProps = getRowProps({ row });
                const { key: rowKey, ...rowRest } = rowProps as any;

                const draft = drafts[r.id] ?? {};
                const status = (draft.status ?? r.status) as Row['status'];
                const priority = (draft.priority ?? r.priority) as Row['priority'];
                const owner = (draft.owner ?? r.owner ?? '') as string;

                return (
                  <TableRow key={rowKey} {...rowRest}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.title_en}</TableCell>
                    <TableCell>
                      {/* ...status Dropdown unchanged... */}
                    </TableCell>
                    <TableCell>
                      {/* ...priority Dropdown unchanged... */}
                    </TableCell>
                    <TableCell style={{ minWidth: 220 }}>
                      {/* ...owner ComboBox unchanged... */}
                    </TableCell>
                    <TableCell>
                      {/* ...Save/Reset buttons unchanged... */}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTable>

    </div>
  );
}
