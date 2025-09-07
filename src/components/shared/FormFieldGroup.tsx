'use client';

import {
  Form, TextInput, TextArea, Dropdown, FileUploader, Button, InlineNotification
} from '@carbon/react';
import { useState } from 'react';

export type GrievanceFormValues = {
  title: string;
  description: string;
  category?: string;
  ward?: string;
  attachment?: File | null;
};

type Option = { id: string; label: string };

type Props = {
  initial?: Partial<GrievanceFormValues>;
  categories: Option[];
  wards: Option[];
  disabled?: boolean;
  onSubmit: (values: GrievanceFormValues) => Promise<void> | void;
};

function getInputValue(e: any): string {
  // React 19 + Carbon: prefer target.value; currentTarget may be null
  return e?.target?.value ?? e?.currentTarget?.value ?? '';
}

export default function FormFieldGroup({
  initial,
  categories,
  wards,
  disabled,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<GrievanceFormValues>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    category: initial?.category,
    ward: initial?.ward,
    attachment: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (e) {
      setError((e as Error).message || 'Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = disabled || submitting;

  return (
    <Form aria-label="Grievance form" style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}>
      {error && (
        <InlineNotification kind="error" title="Failed" subtitle={error} role="alert" />
      )}

      <TextInput
        id="g-title"
        labelText="Title"
        placeholder="e.g., Broken street light"
        value={values.title}
        disabled={isDisabled}
        required
        onChange={(e) =>
          setValues((v) => ({ ...v, title: getInputValue(e) }))
        }
      />

      <TextArea
        id="g-desc"
        labelText="Description"
        placeholder="Describe the issue"
        value={values.description}
        disabled={isDisabled}
        required
        onChange={(e) =>
          setValues((v) => ({ ...v, description: getInputValue(e) }))
        }
      />

      <Dropdown
        id="g-category"
        titleText="Category"
        label="Select category"
        disabled={isDisabled}
        items={categories}
        selectedItem={categories.find((o) => o.id === values.category) ?? null}
        itemToString={(o) => (o ? o.label : '')}
        onChange={(e) =>
          setValues((v) => ({ ...v, category: e.selectedItem?.id ?? undefined }))
        }
      />

      <Dropdown
        id="g-ward"
        titleText="Ward"
        label="Select ward"
        disabled={isDisabled}
        items={wards}
        selectedItem={wards.find((o) => o.id === values.ward) ?? null}
        itemToString={(o) => (o ? o.label : '')}
        onChange={(e) =>
          setValues((v) => ({ ...v, ward: e.selectedItem?.id ?? undefined }))
        }
      />

      <FileUploader
        labelTitle="Attachment (optional)"
        labelDescription="Upload images or PDFs"
        buttonLabel="Add file"
        accept={['image/*', 'application/pdf']}
        disabled={isDisabled}
        filenameStatus="edit"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          const file = evt?.target?.files?.[0] ?? null;
          setValues((v) => ({ ...v, attachment: file }));
        }}
      />



      <Button kind="primary" onClick={handleSubmit} disabled={isDisabled}>
        {submitting ? 'Submitting…' : 'Submit'}
      </Button>
    </Form>
  );
}
