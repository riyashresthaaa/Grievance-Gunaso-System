// src/contexts/CalendarContext.tsx
'use client';
import { createContext, useContext, useState } from 'react';

type Calendar = 'AD' | 'BS';

type Ctx = {
  calendar: Calendar;
  setCalendar: (c: Calendar) => void;
  nepaliNumerals: boolean;
  setNepaliNumerals: (v: boolean) => void;
};

const CalendarCtx = createContext<Ctx | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [calendar, setCalendar] = useState<Calendar>('AD');
  const [nepaliNumerals, setNepaliNumerals] = useState(false);
  return (
    <CalendarCtx.Provider value={{ calendar, setCalendar, nepaliNumerals, setNepaliNumerals }}>
      {children}
    </CalendarCtx.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarCtx);
  if (!ctx) throw new Error('useCalendar must be used within CalendarProvider');
  return ctx;
}
