/**
 * Helper utilities
 */

export function formatDate(date: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...(timeZone && { timeZone }),
  };
  return new Intl.DateTimeFormat('en-CA', options).format(date);
}

export function formatTime(date: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(timeZone && { timeZone }),
  };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

export function getSafeTimeZone(tz?: string): string {
  if (!tz) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return tz;
  } catch {
    console.warn(`Invalid timezone: ${tz}, using default`);
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}

export function sanitizeClassName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
