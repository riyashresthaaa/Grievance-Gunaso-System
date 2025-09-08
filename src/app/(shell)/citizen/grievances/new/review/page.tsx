'use client';

import { Tile, Button, InlineNotification } from '@carbon/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToaster } from '@/components/shared/Toaster';

type Draft = { title: string; description: string; category?: string; ward?: string };

export default function ReviewPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const { notify } = useToaster();
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('draftGrievance');
      if (raw) setDraft(JSON.parse(raw));
    } catch {}
  }, []);

  const submit = async () => {
    if (!draft) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          title_np: draft.title,
          description: draft.description,
          categoryId: draft.category,
          wardId: draft.ward,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message ?? 'Submit failed');
      }
      const g = await res.json();
      setSuccessId(g.id);

      const key = 'myGrievances';
      const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!prev.includes(g.id)) localStorage.setItem(key, JSON.stringify([...prev, g.id]));

      notify('success', 'Submitted', `Tracking ID ${g.id}`);
    } catch (e: any) {
      setError(e?.message ?? 'Error');
      notify('error', 'Failed to submit', e?.message ?? 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!draft) {
    return (
      <section style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
        <InlineNotification kind="warning" title="No draft found" subtitle="Please fill the form first." role="status" />
        <Button as={Link} href="/citizen/grievances/new">Back to form</Button>
      </section>
    );
  }

  return (
    <section style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 className="cds--type-productive-heading-04">Review & Consent</h2>

      {error && <InlineNotification kind="error" title="Failed" subtitle={error} role="alert" />}

      <Tile style={{ display: 'grid', gap: 'var(--cds-spacing-03)', padding: 'var(--cds-spacing-05)' }}>
        <div><strong>Title:</strong> {draft.title}</div>
        <div><strong>Category:</strong> {draft.category ?? '-'}</div>
        <div><strong>Ward:</strong> {draft.ward ?? '-'}</div>
        <div><strong>Description:</strong> {draft.description || '-'}</div>
        <div className="cds--type-caption-01">By submitting, you agree to the processing of your data as per policy.</div>
      </Tile>

      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', flexWrap: 'wrap' }}>
        {!successId ? (
          <>
            <Button kind="secondary" onClick={() => router.back()} disabled={submitting}>Back</Button>
            <Button kind="primary" onClick={submit} disabled={submitting}>Submit</Button>
          </>
        ) : (
          <>
            <Button as={Link} href={`/citizen/grievances/${successId}`} kind="primary">View Details</Button>
            <Button as={Link} href="/citizen/grievances" kind="tertiary">My Tickets</Button>
          </>
        )}
      </div>
    </section>
  );
}
