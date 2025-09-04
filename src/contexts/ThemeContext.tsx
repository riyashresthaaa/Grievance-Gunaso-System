// src/contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'g10' | 'g90';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('g10');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'g10' || saved === 'g90') setTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => setTheme(t => (t === 'g10' ? 'g90' : 'g10'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
