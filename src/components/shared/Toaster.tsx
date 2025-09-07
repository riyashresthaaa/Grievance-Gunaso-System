'use client';

import { createContext, useContext, useId, useMemo, useState } from 'react';
import { ToastNotification } from '@carbon/react';

type ToastKind = 'success' | 'error' | 'info' | 'warning';
type Toast = { id: string; kind: ToastKind; title: string; subtitle?: string };

type Ctx = {
  notify: (kind: ToastKind, title: string, subtitle?: string) => void;
  remove: (id: string) => void;
};
const ToasterCtx = createContext<Ctx | null>(null);

export function useToaster() {
  const ctx = useContext(ToasterCtx);
  if (!ctx) throw new Error('useToaster must be used within ToasterProvider');
  return ctx;
}

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const baseId = useId();
  const api = useMemo<Ctx>(() => ({
    notify: (kind, title, subtitle) => {
      const id = `${baseId}-${Date.now()}`;
      setToasts((t) => [...t, { id, kind, title, subtitle }]);
    },
    remove: (id) => setToasts((t) => t.filter((x) => x.id !== id)),
  }), [baseId]);

  return (
    <ToasterCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: 'fixed',
          right: 'var(--cds-spacing-05)',
          top: 'var(--cds-spacing-05)',
          display: 'grid',
          gap: 'var(--cds-spacing-03)',
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <ToastNotification
            key={t.id}
            timeout={5000}
            kind={t.kind}
            title={t.title}
            subtitle={t.subtitle}
            onCloseButtonClick={() => api.remove(t.id)}
            role="status"
            lowContrast
          />
        ))}
      </div>
    </ToasterCtx.Provider>
  );
}
