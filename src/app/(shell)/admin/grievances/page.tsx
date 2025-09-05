// src/app/(shell)/admin/grievances/page.tsx
type Grievance = {
  id: string; title: string; ward: string; category: string; status: string; priority: string; createdAt: string;
};

async function getData(): Promise<Grievance[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/grievances`, { cache: 'no-store' });
  return res.json();
}

export default async function AdminGrievances() {
  const rows = await getData();

  return (
    <>
      <h2>Admin • All Grievances</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(rows.slice(0, 3), null, 2)}</pre>
    </>
  );
}
