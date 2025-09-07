'use client';

import { Modal, Button, InlineLoading } from '@carbon/react';
import { useState } from 'react';

type Props = {
  open: boolean;
  title: string;
  body?: React.ReactNode;
  primaryLabel: string;
  secondaryLabel?: string;
  onRequestClose: () => void;
  onConfirm: () => Promise<void> | void;
};

export default function ModalConfirm({
  open,
  title,
  body,
  primaryLabel,
  secondaryLabel = 'Cancel',
  onRequestClose,
  onConfirm,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setErr(null);
    try {
      await onConfirm();
      onRequestClose();
    } catch (e) {
      setErr((e as Error).message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      modalHeading={title}
      aria-label={title}
      primaryButtonText={loading ? '' : primaryLabel}
      secondaryButtonText={secondaryLabel}
      onRequestClose={loading ? undefined : onRequestClose}
      onRequestSubmit={loading ? undefined : handleConfirm}
      passiveModal={false}
    >
      <div className="cds--type-body-01" style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
        {body}
        {err && <div role="alert" className="cds--type-body-01">{err}</div>}
        {loading && <InlineLoading description="Processing..." />}
      </div>
    </Modal>
  );
}
