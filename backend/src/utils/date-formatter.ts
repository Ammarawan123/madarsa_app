/**
 * Date formatting utility for Gregorian and Hijri (Islamic) calendars in Urdu.
 */

const URDU_DIGITS: readonly string[] = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toUrduDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit: string) => URDU_DIGITS[Number(digit)]);
}

// 1. Gregorian Date Formatter (Urdu)
export function formatGregorianUrdu(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = new Intl.DateTimeFormat('ur-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d); // Output Example: "۲۰ ستمبر ۲۰۲۶"
  return toUrduDigits(formatted);
}

// Standard ISO Date (Database queries ke liye)
export function formatYYYYMMDD(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0]; // Output Example: "2026-09-20"
}

// 2. Hijri (Islamic) Date Formatter (Urdu)
export function formatHijriUrdu(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const formatted = new Intl.DateTimeFormat('ur-PK-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d); // Output Example: "۸ ربیع الثانی ۱۴۴۸ هـ"
  return toUrduDigits(formatted);
}

// 3. Combined Response Object for Attendance & Roznamacha
export interface UrduFormattedDateResponse {
  gregorianUrdu: string;   // Urdu Gregorian: "۲۰ ستمبر ۲۰۲۶"
  gregorianRaw: string;    // Raw ISO: "2026-09-20"
  hijriUrdu: string;       // Urdu Hijri: "۸ ربیع الثانی ۱۴۴۸ هـ"
  dayNameUrdu: string;     // Urdu Day Name: "اتوار"
}

export function getFormattedAttendanceDateUrdu(
  date: Date | string = new Date()
): UrduFormattedDateResponse {
  const d = typeof date === 'string' ? new Date(date) : date;

  const dayNameUrdu = new Intl.DateTimeFormat('ur-PK', { weekday: 'long' }).format(d);
  const gregorianUrdu = formatGregorianUrdu(d);
  const gregorianRaw = formatYYYYMMDD(d);
  const hijriUrdu = formatHijriUrdu(d);

  return {
    gregorianUrdu,
    gregorianRaw,
    hijriUrdu,
    dayNameUrdu,
  };
}