'use client';

import { Theme } from '@carbon/react';
import { useTheme } from '@/contexts/ThemeContext';
import { ReactNode, useState, useEffect } from 'react';

export function ClientTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme();            // 'g10' | 'g90'
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const active = mounted ? theme : 'g10';

  return (
    <Theme theme={active}>
      <div
        className={`cds--${active}`}
        style={{
          minHeight: '100vh',
          opacity: mounted ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        {children}
      </div>
    </Theme>
  );
}
