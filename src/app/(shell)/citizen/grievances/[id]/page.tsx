import ClientCitizenDetail from '@/components/citizen/ClientCitizenDetail';
import NotFoundNotice from '@/components/citizen/NotFoundNotice';
import { absoluteUrl } from '@/utils/absoluteUrl';

async function getOne(id: string) {
  const res = await fetch(absoluteUrl(`/api/grievances/${id}`), { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function getTimeline(id: string) {
  const res = await fetch(absoluteUrl(`/api/grievances/${id}/timeline`), { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

async function getCategories() {
  const res = await fetch(absoluteUrl('/api/categories'), { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function CitizenDetailPage({ params }: { params: { id: string } }) {
  const data = await getOne(params.id);
  if (!data) {
    // Render a CLIENT component that uses Carbon, instead of Carbon in this server file
    return <NotFoundNotice />;
  }

  const [timeline, cats] = await Promise.all([getTimeline(params.id), getCategories()]);
  const categories = cats.map((c: any) => ({
    id: String(c.id),
    label_en: c.name_en,
    label_np: c.name_np,
  }));

  return <ClientCitizenDetail data={data} timeline={timeline} categories={categories} />;
}
