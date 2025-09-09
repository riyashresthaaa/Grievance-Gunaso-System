'use client';

import { useEffect, useState } from 'react';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  Button, Modal, TextInput, Dropdown, InlineNotification,
} from '@carbon/react';

type Category = {
  id: string;
  name_en: string;
  name_np?: string;
  priority: 'Low' | 'Medium' | 'High' | string;
};

const PRIORITY = ['Low', 'Medium', 'High'] as const;

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [nameEn, setNameEn] = useState('');
  const [nameNp, setNameNp] = useState('');
  const [priority, setPriority] = useState<Category['priority']>('Medium');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setErr(null);
    const res = await fetch('/api/categories', { cache: 'no-store' });
    if (!res.ok) { setErr('Failed to load categories'); return; }
    setRows(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!nameEn.trim()) return;
    setSaving(true);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name_en: nameEn.trim(), name_np: nameNp.trim(), priority }),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      setNameEn(''); setNameNp(''); setPriority('Medium');
      load();
    } else {
      setErr('Failed to add category');
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) load();
    else setErr('Failed to delete category');
  };

  const headers = [
    { key: 'id', header: 'ID' },
    { key: 'name_en', header: 'Name (EN)' },
    { key: 'name_np', header: 'Name (NP)' },
    { key: 'priority', header: 'Priority' },
    { key: 'actions', header: 'Actions' },
  ];

  const tableRows = rows.map((r) => ({
    id: r.id,
    name_en: r.name_en,
    name_np: r.name_np ?? '',
    priority: r.priority,
    actions: '',
  }));

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2 className="cds--type-productive-heading-03" style={{ margin: 0 }}>Categories</h2>
        <Button onClick={() => setOpen(true)}>Add Category</Button>
      </div>

      {err && <InlineNotification kind="error" title="Error" subtitle={err} role="alert" />}

      <DataTable rows={tableRows} headers={headers}>
        {({ rows, headers, getHeaderProps, getRowProps }) => (
          <Table size="sm">
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
                const item = tableRows.find((x) => x.id === row.id)!;
                const rowProps = getRowProps({ row });
                const { key: rowKey, ...rowRest } = rowProps as any;

                return (
                  <TableRow key={rowKey} {...rowRest}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.name_en}</TableCell>
                    <TableCell>{item.name_np}</TableCell>
                    <TableCell>{item.priority}</TableCell>
                    <TableCell>
                      <Button kind="danger--tertiary" size="sm" onClick={() => remove(item.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTable>


      <Modal
        open={open}
        modalHeading="Add Category"
        primaryButtonText={saving ? 'Saving…' : 'Add'}
        secondaryButtonText="Cancel"
        onRequestClose={() => setOpen(false)}
        onRequestSubmit={add}
        primaryButtonDisabled={saving || !nameEn.trim()}
      >
        <div style={{ display: 'grid', gap: '1rem', paddingTop: '0.5rem' }}>
          <TextInput id="cat-en" labelText="Name (EN)" value={nameEn} onChange={(e) => setNameEn(e.currentTarget.value)} />
          <TextInput id="cat-np" labelText="Name (NP)" value={nameNp} onChange={(e) => setNameNp(e.currentTarget.value)} />
          <Dropdown
            id="cat-pr"
            titleText="Priority"
            label="Select priority"
            size="sm"
            items={[...PRIORITY]}
            selectedItem={priority}
            itemToString={(s) => s}
            onChange={(e: any) => setPriority(e.selectedItem)}
          />
        </div>
      </Modal>
    </div>
  );
}
