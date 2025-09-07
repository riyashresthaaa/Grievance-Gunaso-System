'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { CalendarProvider } from '@/contexts/CalendarContext';
import { ClientTheme } from '@/components/ClientTheme';
import { ToasterProvider } from '@/components/shared/Toaster';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientTheme>
        <CalendarProvider>
          <ToasterProvider>
            {children}
          </ToasterProvider>
        </CalendarProvider>
      </ClientTheme>
    </ThemeProvider>
  );
}
