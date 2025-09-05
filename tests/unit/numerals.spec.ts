// tests/unit/numerals.spec.ts
import { describe, it, expect } from 'vitest';
import { toNepaliDigits } from '../../src/utils/numerals';

describe('toNepaliDigits', () => {
  it('converts digits in a date string', () => {
    expect(toNepaliDigits('2025-09-05')).toBe('२०२५-०९-०५');
  });

  it('handles plain numbers', () => {
    expect(toNepaliDigits(1234567890)).toBe('१२३४५६७८९०');
  });

  it('leaves non-digits unchanged', () => {
    expect(toNepaliDigits('ID: G-1002')).toBe('ID: G-१००२');
  });
});
