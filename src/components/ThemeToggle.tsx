'use client';

import { Toggle } from '@carbon/react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // g10 <-> g90

  return (
    <Toggle
      labelText="Theme"
      labelA="Light"
      labelB="Dark"
      id="theme-toggle"
      toggled={theme === 'g90'}
      onToggle={toggleTheme}
    />
  );
}
