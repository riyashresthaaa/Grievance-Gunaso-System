'use client';

import { Tag } from '@carbon/react';

type Priority = 'Low' | 'Medium' | 'High' | 'Unknown';
const map: Record<Priority, { kind: React.ComponentProps<typeof Tag>['type']; label: string }> = {
  Low: { kind: 'gray', label: 'Low' },
  Medium: { kind: 'purple', label: 'Medium' },
  High: { kind: 'red', label: 'High' },
  Unknown: { kind: 'cool-gray', label: 'Unknown' },
};

export default function PriorityTag({ value }: { value?: string }) {
  const key = (value as Priority) || 'Unknown';
  const meta = map[key] ?? map.Unknown;
  return <Tag type={meta.kind} title={meta.label} filter={false}>{meta.label}</Tag>;
}
