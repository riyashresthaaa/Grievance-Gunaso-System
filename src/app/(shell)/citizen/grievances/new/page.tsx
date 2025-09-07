'use client';

import FormFieldGroup, { GrievanceFormValues } from '@/components/shared/FormFieldGroup';
import { useToaster } from '@/components/shared/Toaster';
import { InlineNotification } from '@carbon/react';
import { useState } from 'react';

export default function NewGrievance() {
  const { notify } = useToaster();
  const [resetKey, setResetKey] = useState(0);            // remount form to clear it
  const [showSuccess, setShowSuccess] = useState(false);  // page-level success banner

  const categories = [
    { id: 'Infrastructure', label: 'Infrastructure' },
    { id: 'Utilities', label: 'Utilities' },
    { id: 'Public Safety', label: 'Public Safety' },
  ];
  const wards = Array.from({ length: 32 }, (_, i) => ({ id: `Ward ${i + 1}`, label: `Ward ${i + 1}` }));

  const handleSubmit = async (values: GrievanceFormValues) => {
    // TODO: POST via route handler/MSW later
    await new Promise((r) => setTimeout(r, 800));
    notify('success', 'Grievance submitted', 'We received your ticket.');
    setShowSuccess(true);
    setResetKey((k) => k + 1);             // clears the form (remounts)
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <section aria-labelledby="title" style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      <h2 id="title">Submit Grievance</h2>

      {showSuccess && (
        <InlineNotification kind="success" title="Submitted" subtitle="We received your ticket." role="status" />
      )}

      <FormFieldGroup
        key={resetKey}             // force remount to clear fields & uploader
        categories={categories}
        wards={wards}
        onSubmit={handleSubmit}
      />
    </section>
  );
}
