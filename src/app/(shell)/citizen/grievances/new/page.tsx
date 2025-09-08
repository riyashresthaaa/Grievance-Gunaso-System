'use client';

import FormFieldGroup, { GrievanceFormValues } from '@/components/shared/FormFieldGroup';
import { InlineNotification, Button } from '@carbon/react';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useToaster } from '@/components/shared/Toaster';
import { useRouter } from 'next/navigation';

type Opt = { id: string; label: string };

export default function NewGrievance() {
  const { notify } = useToaster();
  const router = useRouter();

  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const draftRef = useRef<GrievanceFormValues | null>(null);

  const categories: Opt[] = [
    { id: '1', label: 'Road & Infrastructure' },
    { id: '2', label: 'Health & Sanitation' },
    { id: '3', label: 'Electricity & Water' },
  ];
  const wards: Opt[] = Array.from({ length: 32 }, (_, i) => ({ id: String(i + 1), label: `Ward ${i + 1}` }));

  const handleSubmit = async (values: GrievanceFormValues) => {
    setSubmitting(true);
    setTrackingId(null);
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          title_np: values.title,
          description: values.description,
          categoryId: values.category,
          wardId: values.ward,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message ?? 'Submit failed');
      }
      const g = await res.json();
      setTrackingId(g.id);

      const key = 'myGrievances';
      const prev: string[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!prev.includes(g.id)) localStorage.setItem(key, JSON.stringify([...prev, g.id]));

      notify('success', 'Grievance submitted', `Tracking ID ${g.id}`);
    } catch (e: any) {
      notify('error', 'Failed to submit', e?.message ?? 'Error');
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const goReview = () => {
    const v = draftRef.current;
    if (!v || !v.title || !v.category || !v.ward) {
      notify('warning', 'Missing fields', 'Please fill Title, Category, Ward before review.');
      return;
    }
    sessionStorage.setItem('draftGrievance', JSON.stringify(v));
    router.push('/citizen/grievances/new/review');
  };

  const copyLink = async () => {
    if (!trackingId) return;
    const url = `${location.origin}/citizen/grievances/${trackingId}`;
    await navigator.clipboard.writeText(url);
    notify('info', 'Link copied', url);
  };

  return (
    <section aria-labelledby="title" style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 id="title" className="cds--type-productive-heading-04">Submit Grievance</h2>

      {trackingId && (
        <InlineNotification kind="success" role="status" title="Submitted" subtitle={`Tracking ID: ${trackingId}`} />
      )}

      <FormFieldGroup
        categories={categories}
        wards={wards}
        onSubmit={handleSubmit}
        disabled={submitting}
        onChangeValues={(v) => { draftRef.current = v; }}
      />

      {/* Review & Consent entry + success actions */}
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', flexWrap: 'wrap' }}>
        <Button kind="secondary" onClick={goReview}>Review & Consent</Button>
        {trackingId && (
          <>
            <Button kind="primary" as={Link} href={`/citizen/grievances/${trackingId}`}>View Details</Button>
            <Button kind="tertiary" as={Link} href="/citizen/grievances">Go to My Tickets</Button>
            <Button kind="ghost" onClick={copyLink}>Copy tracking link</Button>
          </>
        )}
      </div>
    </section>
  );
}
