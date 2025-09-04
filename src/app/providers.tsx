// src/app/providers.tsx
'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { ClientTheme } from '@/components/ClientTheme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientTheme>{children}</ClientTheme>
    </ThemeProvider>
  );
}
