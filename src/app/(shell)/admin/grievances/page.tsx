// src/app/(shell)/admin/grievances/page.tsx
import ClientGrievancesList from '@/components/admin/ClientGrievancesList';
import { absoluteUrl } from '@/utils/absoluteUrl';

type Opt = { id: string; label: string };

async function getOptions(endpoint: string): Promise<Opt[]> {
  const res = await fetch(absoluteUrl(endpoint), { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getRows() {
  const res = await fetch(absoluteUrl('/api/grievances'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load grievances');
  return res.json();
}

export default async function AdminGrievancesPage() {
  const [rows, categories, wards] = await Promise.all([
    getRows(),
    getOptions('/api/categories'), // must return [{id,label}]
    getOptions('/api/wards'),      // must return [{id,label}]
  ]);

  return (
    <ClientGrievancesList
      initialRows={rows}
      categories={categories}
      wards={wards}
    />
  );
}
