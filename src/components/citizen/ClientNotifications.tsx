'use client';

import { Tile, Tag, Button } from '@carbon/react';
import Link from 'next/link';
import { useMemo } from 'react';

type Notif = {
  id: string;
  grievance_id: string;
  kind: 'info' | 'success' | 'warning' | 'error';
  title_en: string;
  title_np: string;
  created_at_iso: string;
};

export default function ClientNotifications({ initialAll, lang = 'en' }: { initialAll: Notif[]; lang?: 'en' | 'np' }) {
  const myIds: string[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('myGrievances') || '[]'); } catch { return []; }
  }, []);

  const rows = initialAll.filter((n) => myIds.includes(n.grievance_id));

  if (rows.length === 0) {
    return (
      <Tile style={{ padding: 'var(--cds-spacing-05)' }}>
        <div className="cds--type-heading-02" style={{ marginBottom: 'var(--cds-spacing-03)' }}>No notifications</div>
        <Button as={Link} href="/citizen/grievances/new" kind="primary">Submit a grievance</Button>
      </Tile>
    );
    }

  const tagType = (k: Notif['kind']) =>
    k === 'success' ? 'green' : k === 'error' ? 'red' : k === 'warning' ? 'yellow' : 'blue';

  return (
    <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
      {rows.map((n) => (
        <Tile key={n.id} style={{ padding: 'var(--cds-spacing-05)', display: 'grid', gap: 'var(--cds-spacing-03)' }}>
          <div className="cds--type-body-01" style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', alignItems: 'center' }}>
              <Tag type={tagType(n.kind) as any}>{n.kind}</Tag>
              <span>{lang === 'np' ? n.title_np : n.title_en}</span>
            </div>
            <Button as={Link} href={`/citizen/grievances/${n.grievance_id}`} kind="tertiary">View details</Button>
          </div>
          <div className="cds--type-caption-01">{new Date(n.created_at_iso).toLocaleString()}</div>
        </Tile>
      ))}
    </div>
  );
}
