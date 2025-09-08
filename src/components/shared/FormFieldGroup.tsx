'use client';

import {
  Form,
  TextInput,
  TextArea,
  Dropdown,
  FileUploader,
  Button,
  InlineNotification,
} from '@carbon/react';
import { useState, useCallback } from 'react';

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
  /** Optional live-change observer (used by the Review & Consent page handoff) */
  onChangeValues?: (values: GrievanceFormValues) => void;
};

const getInputValue = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
): string => e.currentTarget?.value ?? e.target?.value ?? '';

export default function FormFieldGroup({
  initial,
  categories,
  wards,
  disabled,
  onSubmit,
  onChangeValues,
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

  const isDisabled = !!disabled || submitting;

  // Helper: update local state and notify parent (if provided)
  const setAndNotify = useCallback(
    (updater: (v: GrievanceFormValues) => GrievanceFormValues) => {
      setValues(prev => {
        const next = updater(prev);
        onChangeValues?.(next);
        return next;
      });
    },
    [onChangeValues]
  );

  const handleSubmit = async () => {
    setError(null);

    // minimal required field validation
    if (!values.title.trim() || !values.category || !values.ward) {
      setError('Please fill Title, Category, and Ward.');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(values);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Submit failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form
      aria-label="Grievance form"
      style={{ display: 'grid', gap: 'var(--cds-spacing-05)' }}
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {error && (
        <InlineNotification
          kind="error"
          role="alert"
          title="Failed"
          subtitle={error}
        />
      )}

      <TextInput
        id="g-title"
        labelText="Title"
        placeholder="e.g., Broken street light"
        value={values.title}
        disabled={isDisabled}
        required
        onChange={(e) => setAndNotify((v) => ({ ...v, title: getInputValue(e) }))}
      />

      <TextArea
        id="g-desc"
        labelText="Description"
        placeholder="Describe the issue"
        value={values.description}
        disabled={isDisabled}
        required
        onChange={(e) =>
          setAndNotify((v) => ({ ...v, description: getInputValue(e) }))
        }
      />

      <Dropdown
        id="g-category"
        titleText="Category"
        label="Select category"
        disabled={isDisabled}
        items={categories}
        selectedItem={
          categories.find((o) => o.id === values.category) ?? null
        }
        itemToString={(o) => (o ? o.label : '')}
        onChange={(e: { selectedItem?: Option | null }) =>
          setAndNotify((v) => ({
            ...v,
            category: e.selectedItem?.id ?? undefined,
          }))
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
        onChange={(e: { selectedItem?: Option | null }) =>
          setAndNotify((v) => ({
            ...v,
            ward: e.selectedItem?.id ?? undefined,
          }))
        }
      />

      <FileUploader
        labelTitle="Attachment (optional)"
        labelDescription="Upload images or PDFs"
        buttonLabel="Add file"
        accept={['image/*', 'application/pdf']}
        disabled={isDisabled}
        /** stop perpetual spinner; allow editing/removal UI */
        filenameStatus="edit"
        onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
          const file = evt.target?.files?.[0] ?? null;
          setAndNotify((v) => ({ ...v, attachment: file }));
        }}
      />

      <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)' }}>
        <Button kind="primary" type="submit" disabled={isDisabled}>
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      </div>
    </Form>
  );
}
