import { toNepaliDigits } from './numerals';

export function formatDate(
  d: Date,
  opts?: Intl.DateTimeFormatOptions & { calendar?: 'AD' | 'BS'; nepali?: boolean }
) {
  const { calendar = 'AD', nepali = false, ...intl } = opts || {};

  if (calendar === 'BS') {
    
  }

  const base = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...intl,
  }).format(d);

  return nepali ? toNepaliDigits(base) : base;
}
