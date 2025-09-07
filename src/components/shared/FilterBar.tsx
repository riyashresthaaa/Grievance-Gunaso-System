'use client';

import { Search, Dropdown, Button, DatePicker, DatePickerInput } from '@carbon/react';
import { useState } from 'react';

type Option = { id: string; label: string };
type Props = {
  statusOptions: Option[];
  priorityOptions: Option[];
  wardOptions: Option[];
  disabled?: boolean;
  onApply: (filters: { q: string; status?: string; priority?: string; ward?: string; range?: [Date, Date] }) => void;
  onClear?: () => void;
};

export default function FilterBar({
  statusOptions,
  priorityOptions,
  wardOptions,
  disabled,
  onApply,
  onClear,
}: Props) {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Option | null>(null);
  const [priority, setPriority] = useState<Option | null>(null);
  const [ward, setWard] = useState<Option | null>(null);
  const [range, setRange] = useState<[Date, Date] | undefined>();

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }} aria-label="Filters">
      <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
        <Search
          id="flt-q"
          labelText="Search"
          placeholder="Search tickets"
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          disabled={disabled}
        />
        <Dropdown
          id="flt-status"
          titleText="Status"
          label="Any"
          items={statusOptions}
          selectedItem={status}
          itemToString={(o) => (o ? o.label : '')}
          onChange={(e) => setStatus(e.selectedItem ?? null)}
          disabled={disabled}
        />
        <Dropdown
          id="flt-priority"
          titleText="Priority"
          label="Any"
          items={priorityOptions}
          selectedItem={priority}
          itemToString={(o) => (o ? o.label : '')}
          onChange={(e) => setPriority(e.selectedItem ?? null)}
          disabled={disabled}
        />
        <Dropdown
          id="flt-ward"
          titleText="Ward"
          label="Any"
          items={wardOptions}
          selectedItem={ward}
          itemToString={(o) => (o ? o.label : '')}
          onChange={(e) => setWard(e.selectedItem ?? null)}
          disabled={disabled}
        />
      </div>

      <DatePicker
        datePickerType="range"
        onChange={(dates: Date[]) => {
          if (dates?.length === 2) setRange([dates[0], dates[1]]);
        }}
      >
        <DatePickerInput id="date-start" labelText="Start date" placeholder="dd/mm/yyyy" />
        <DatePickerInput id="date-end" labelText="End date" placeholder="dd/mm/yyyy" />
      </DatePicker>

      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)' }}>
        <Button
          kind="primary"
          disabled={disabled}
          onClick={() =>
            onApply({
              q,
              status: status?.id,
              priority: priority?.id,
              ward: ward?.id,
              range,
            })
          }
        >
          Apply
        </Button>
        <Button kind="tertiary" disabled={disabled} onClick={() => { setQ(''); setStatus(null); setPriority(null); setWard(null); setRange(undefined); onClear?.(); }}>
          Clear
        </Button>
      </div>
    </div>
  );
}
