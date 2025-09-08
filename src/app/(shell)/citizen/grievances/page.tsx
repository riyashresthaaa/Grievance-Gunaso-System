import ClientCitizenList from '@/components/citizen/ClientCitizenList';
import { absoluteUrl } from '@/utils/absoluteUrl';

async function getAll() {
  const res = await fetch(absoluteUrl('/api/grievances'), { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load grievances');
  return res.json();
}

async function getCategories() {
  const res = await fetch(absoluteUrl('/api/categories'), { cache: 'no-store' });
  if (!res.ok) return [];
  const cats = await res.json();
  return cats.map((c: any) => ({ id: String(c.id), label: c.name_en }));
}

export default async function CitizenListPage() {
  const [rows, cats] = await Promise.all([getAll(), getCategories()]);
  // Pass everything; the client will filter to "my" IDs from localStorage.
  return <ClientCitizenList initialAll={rows} categories={cats} />;
}
