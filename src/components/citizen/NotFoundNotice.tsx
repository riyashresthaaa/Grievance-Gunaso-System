'use client';

import { InlineNotification, Button } from '@carbon/react';
import Link from 'next/link';

export default function NotFoundNotice() {
  return (
    <section style={{ display: 'grid', gap: 'var(--cds-spacing-03)' }}>
      <InlineNotification
        kind="error"
        title="Not found"
        subtitle="That ticket does not exist."
        role="alert"
      />
      <Button as={Link} href="/citizen/grievances" kind="tertiary">
        Back to My Tickets
      </Button>
    </section>
  );
}
