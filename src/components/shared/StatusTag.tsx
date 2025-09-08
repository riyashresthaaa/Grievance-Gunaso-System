'use client';

import { Tag } from '@carbon/react';

type Status = 'New' | 'Open' | 'In Progress' | 'Resolved' | 'Rejected' | 'Unknown';

const map: Record<Status, { kind: React.ComponentProps<typeof Tag>['type']; label: string }> = {
  New: { kind: 'blue', label: 'New' },
  Open: { kind: 'blue', label: 'Open' },
  'In Progress': { kind: 'magenta', label: 'In Progress' },
  Resolved: { kind: 'green', label: 'Resolved' },
  Rejected: { kind: 'red', label: 'Rejected' },
  Unknown: { kind: 'cool-gray', label: 'Unknown' },
};

export default function StatusTag({ value }: { value?: string }) {
  const key = (value as Status) || 'Unknown';
  const meta = map[key] ?? map.Unknown;
  return <Tag type={meta.kind} title={meta.label} filter={false}>{meta.label}</Tag>;
}
