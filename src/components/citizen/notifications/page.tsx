import ClientNotifications from '@/components/citizen/ClientNotifications';
import { absoluteUrl } from '@/utils/absoluteUrl';

async function getAll() {
  const res = await fetch(absoluteUrl('/api/notifications'), { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function NotificationsPage() {
  const rows = await getAll();
  return (
    <section style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 className="cds--type-productive-heading-04">Notifications</h2>
      <ClientNotifications initialAll={rows} />
    </section>
  );
}
