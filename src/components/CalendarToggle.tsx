// src/components/CalendarToggle.tsx
'use client';

import { Toggle, Dropdown } from '@carbon/react';
import { useCalendar } from '@/contexts/CalendarContext';
import { useTranslation } from 'react-i18next';

export function CalendarToggle() {
  const { t } = useTranslation();
  const { calendar, setCalendar, nepaliNumerals, setNepaliNumerals } = useCalendar();

  return (
    <div style={{ display: 'flex', gap: '.75rem' }}>
      <Dropdown
        id="calendar-dropdown"
        titleText={t('calendar')}
        label={calendar}
        items={['AD', 'BS']}
        selectedItem={calendar}
        onChange={(e) => setCalendar(e.selectedItem)}
      />
      <Toggle
        id="numerals-toggle"
        labelText={t('numeralsNepali')}
        labelA="Off"
        labelB="On"
        toggled={nepaliNumerals}
        onToggle={setNepaliNumerals}
      />
    </div>
  );
}
