'use client';

import { Tile, Button } from '@carbon/react';
import { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  disabled?: boolean;
};
export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  disabled,
}: Props) {
  return (
    <Tile style={{ padding: 'var(--cds-spacing-05)', textAlign: 'center' }} aria-live="polite">
      <div style={{ display: 'grid', gap: 'var(--cds-spacing-03)', placeItems: 'center' }}>
        {icon}
        <h3 className="cds--type-heading-02" style={{ margin: 0 }}>{title}</h3>
        {description && (
          <p className="cds--type-body-01" style={{ margin: 0 }}>{description}</p>
        )}
        {actionLabel && onAction && (
          <Button kind="primary" onClick={onAction} disabled={disabled}>
            {actionLabel}
          </Button>
        )}
      </div>
    </Tile>
  );
}
