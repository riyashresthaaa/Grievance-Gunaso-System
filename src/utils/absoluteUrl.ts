import { headers } from 'next/headers';

export function absoluteUrl(path: string): string {
  // If a full URL was passed already, just return it
  if (/^https?:\/\//i.test(path)) return path;

  const h = headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto =
    (h.get('x-forwarded-proto') ?? (process.env.NODE_ENV === 'production' ? 'https' : 'http'))
      .split(',')[0];

  // Ensure no double slashes when joining
  const base = `${proto}://${host}`.replace(/\/+$/, '');
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rel}`;
}
