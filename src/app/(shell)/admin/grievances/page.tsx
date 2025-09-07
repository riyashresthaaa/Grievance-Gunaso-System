import ClientGrievancesList from '@/components/admin/ClientGrievancesList';
import type { GrievanceRow } from '@/components/shared/AppDataTable';
import { absoluteUrl } from '@/utils/absoluteUrl';

async function getData(): Promise<GrievanceRow[]> {
  const res = await fetch(absoluteUrl('/api/grievances'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load grievances');
  return res.json();
}

export default async function AdminGrievances() {
  const rows = await getData();
  return <ClientGrievancesList initialRows={rows} />;
}
