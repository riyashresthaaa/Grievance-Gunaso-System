// src/app/(shell)/dev/components/page.tsx
'use client';

import { useState } from 'react';
import AppDataTable, { GrievanceRow } from '@/components/shared/AppDataTable';
import FilterBar from '@/components/shared/FilterBar';
import EmptyState from '@/components/shared/EmptyState';
import StatusTag from '@/components/shared/StatusTag';
import PriorityTag from '@/components/shared/PriorityTag';
import ModalConfirm from '@/components/shared/ModalConfirm';
import TicketTimeline from '@/components/shared/TicketTimeline';
import { Button, Toggle } from '@carbon/react';
import { useToaster } from '@/components/shared/Toaster';

const SAMPLE_ROWS: GrievanceRow[] = [
  { id: 'G-1001', title: 'Broken street light', ward: 'Ward 5', category: 'Infrastructure', status: 'New', priority: 'Medium', createdAt: '2025-09-01' },
  { id: 'G-1002', title: 'Water leakage', ward: 'Ward 12', category: 'Utilities', status: 'In Progress', priority: 'High', createdAt: '2025-09-02' },
  { id: 'G-1003', title: 'Blocked drain', ward: 'Ward 6', category: 'Utilities', status: 'Resolved', priority: 'Low', createdAt: '2025-09-03' },
];

export default function ComponentsPlayground() {
  const { notify } = useToaster();

  // Table state toggles
  const [loading, setLoading] = useState(false);
  const [makeEmpty, setMakeEmpty] = useState(false);
  const [makeError, setMakeError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const tableRows = makeEmpty ? [] : SAMPLE_ROWS;

  // Modal
  const [modalOpen, setModalOpen] = useState(false);

  // Timeline data
  const [timelineEmpty, setTimelineEmpty] = useState(false);
  const timelineItems = timelineEmpty
    ? []
    : [
        { id: 't1', label: 'Submitted', timestamp: '2025-09-01T09:00:00Z', done: true },
        { id: 't2', label: 'Assigned to staff', timestamp: '2025-09-01T12:00:00Z', done: true },
        { id: 't3', label: 'Work in progress', timestamp: '2025-09-02T08:30:00Z' },
      ];

  // Filter options
  const statusOptions = [
    { id: 'New', label: 'New' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Resolved', label: 'Resolved' },
    { id: 'Rejected', label: 'Rejected' },
  ];
  const priorityOptions = [
    { id: 'Low', label: 'Low' },
    { id: 'Medium', label: 'Medium' },
    { id: 'High', label: 'High' },
  ];
  const wardOptions = [
    { id: 'Ward 5', label: 'Ward 5' },
    { id: 'Ward 6', label: 'Ward 6' },
    { id: 'Ward 12', label: 'Ward 12' },
  ];

  return (
    <section style={{ display: 'grid', gap: 'var(--cds-spacing-07)' }}>
      <h2>Components Playground</h2>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', flexWrap: 'wrap' }}>
        <StatusTag value="New" />
        <StatusTag value="In Progress" />
        <StatusTag value="Resolved" />
        <StatusTag value="Rejected" />
        <PriorityTag value="Low" />
        <PriorityTag value="Medium" />
        <PriorityTag value="High" />
      </div>

      {/* Toaster */}
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center' }}>
        <Button onClick={() => notify('success', 'Success', 'This is a success toast')}>Show success toast</Button>
        <Button kind="tertiary" onClick={() => notify('error', 'Error', 'This is an error toast')}>Show error toast</Button>
      </div>

      {/* Modal */}
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center' }}>
        <Button onClick={() => setModalOpen(true)}>Open confirm modal</Button>
        <ModalConfirm
          open={modalOpen}
          title="Confirm action"
          primaryLabel="Confirm"
          onRequestClose={() => setModalOpen(false)}
          onConfirm={async () => {
            await new Promise((r) => setTimeout(r, 800));
            notify('success', 'Action completed');
          }}
        />
      </div>

      {/* FilterBar */}
      <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
        <h3>FilterBar</h3>
        <FilterBar
          statusOptions={statusOptions}
          priorityOptions={priorityOptions}
          wardOptions={wardOptions}
          onApply={(f) => notify('info', 'Filters applied', JSON.stringify(f))}
          onClear={() => notify('warning', 'Filters cleared')}
        />
      </div>

      {/* Toggles for table states */}
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-05)', alignItems: 'center' }}>
        <Toggle id="tg-loading" labelText="Table loading" labelA="Off" labelB="On" toggled={loading} onToggle={setLoading} />
        <Toggle id="tg-empty" labelText="Table empty" labelA="Off" labelB="On" toggled={makeEmpty} onToggle={setMakeEmpty} />
        <Toggle id="tg-error" labelText="Table error" labelA="Off" labelB="On" toggled={makeError} onToggle={setMakeError} />
      </div>

      {/* AppDataTable */}
      <div>
        <h3>AppDataTable</h3>
        <AppDataTable
          rows={tableRows}
          loading={loading}
          error={makeError ? 'Simulated error' : null}
          page={page}
          pageSize={pageSize}
          totalItems={tableRows.length}
          onPageChange={(p, ps) => { setPage(p); setPageSize(ps); }}
        />
      </div>

      {/* Timeline */}
      <div>
        <div style={{ display: 'flex', gap: 'var(--cds-spacing-05)', alignItems: 'center', marginBottom: 'var(--cds-spacing-03)' }}>
          <h3 style={{ margin: 0 }}>TicketTimeline</h3>
          <Toggle id="tg-timeline-empty" labelText="Timeline empty" labelA="Off" labelB="On" toggled={timelineEmpty} onToggle={setTimelineEmpty} />
        </div>
        <TicketTimeline items={timelineItems} />
      </div>

      {/* EmptyState demo */}
      <div>
        <h3>EmptyState</h3>
        <EmptyState
          title="No results"
          description="Try adjusting filters or date range."
          actionLabel="Refresh"
          onAction={() => notify('info', 'Refreshed')}
        />
      </div>
    </section>
  );
}
