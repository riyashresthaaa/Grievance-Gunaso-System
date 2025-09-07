'use client';

import { Tile } from '@carbon/react';
import { Time, Checkmark } from '@carbon/icons-react';

export type TimelineItem = {
  id: string;
  label: string;
  timestamp: string; // ISO
  done?: boolean;
};

export default function TicketTimeline({ items }: { items: TimelineItem[] | null }) {
  if (!items || items.length === 0) {
    return <Tile style={{ padding: 'var(--cds-spacing-05)' }}>No updates yet.</Tile>;
  }
  return (
    <Tile style={{ padding: 'var(--cds-spacing-05)', display: 'grid', gap: 'var(--cds-spacing-03)' }}>
      <ol className="cds--type-body-01" style={{ display: 'grid', gap: 'var(--cds-spacing-03)', margin: 0, paddingInlineStart: '1rem' }}>
        {items.map((it) => (
          <li key={it.id} aria-label={`${it.label} at ${it.timestamp}`} style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center' }}>
            {it.done ? <Checkmark /> : <Time />}
            <span>{it.label}</span>
            <span aria-hidden>•</span>
            <time dateTime={it.timestamp}>{new Date(it.timestamp).toLocaleString()}</time>
          </li>
        ))}
      </ol>
    </Tile>
  );
}
