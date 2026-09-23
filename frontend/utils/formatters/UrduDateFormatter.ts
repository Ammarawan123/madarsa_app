const URDU_WEEKDAYS = ["اتوار", "پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ"];
const URDU_MONTHS = [
  "جنوری",
  "فروری",
  "مارچ",
  "اپریل",
  "مئی",
  "جون",
  "جولائی",
  "اگست",
  "ستمبر",
  "اکتوبر",
  "نومبر",
  "دسمبر",
];
const URDU_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toUrduDigits(val: number | string | undefined | null): string {
  if (val === undefined || val === null) return '۰';
  if (typeof val === 'number' && isNaN(val)) return '۰';
  const str = String(val);
  if (!str.trim()) return '۰';
  return str.replace(/[0-9]/g, (d) => URDU_DIGITS[Number(d)]);
}

export class UrduDateFormatter {
  static formatDate(date: Date): string {
    return `${URDU_WEEKDAYS[date.getDay()]}، ${toUrduDigits(date.getDate())} ${URDU_MONTHS[date.getMonth()]} ${toUrduDigits(date.getFullYear())}`;
  }

  static formatTime(date: Date): string {
    const hours = date.getHours();
    const displayHours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${toUrduDigits(displayHours)}:${toUrduDigits(minutes)} ${hours >= 12 ? "شام" : "صبح"}`;
  }
}
