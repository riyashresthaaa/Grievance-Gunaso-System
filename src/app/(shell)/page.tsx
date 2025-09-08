'use client';

import { Button, Tile } from '@carbon/react';
import { Grid, Column } from '@carbon/react';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <section aria-labelledby="home-title" style={{ display: 'grid', gap: 'var(--cds-spacing-07)' }}>
      {/* Welcome area */}
      <Grid condensed>
        <Column sm={4} md={8} lg={16}>
          <h2 id="home-title" className="cds--type-productive-heading-04" style={{ marginBottom: 'var(--cds-spacing-03)' }}>
            Welcome
          </h2>
          <Tile style={{ padding: 'var(--cds-spacing-05)', display: 'grid', gap: 'var(--cds-spacing-03)' }}>
            <p className="cds--type-body-01" style={{ margin: 0 }}>
              “गुनासो दर्ता गर्न र ट्र्याक गर्नुस्”
            </p>
            <div style={{ display: 'flex', gap: 'var(--cds-spacing-03)', flexWrap: 'wrap' }}>
              <Button as={Link} href="/citizen/grievances/new" kind="primary">
                Submit Grievance
              </Button>
              <Button as={Link} href="/citizen/grievances" kind="secondary">
                My Grievances
              </Button>
            </div>
          </Tile>
        </Column>
      </Grid>
    </section>
  );
}
