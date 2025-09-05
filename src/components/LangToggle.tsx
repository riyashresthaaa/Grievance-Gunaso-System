// src/components/LangToggle.tsx
'use client';

import { Toggle } from '@carbon/react';
import { useTranslation } from 'react-i18next';
import '@/i18n'; 

export function LangToggle() {
  const { i18n, t } = useTranslation();

  return (
    <Toggle
      id="lang-toggle"
      labelText={t('language')}
      labelA="EN"
      labelB="NP"
      toggled={i18n.language.startsWith('np')}
      onToggle={(on) => i18n.changeLanguage(on ? 'np' : 'en')}
    />
  );
}
