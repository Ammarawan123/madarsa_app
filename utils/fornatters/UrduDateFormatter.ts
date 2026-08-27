const URDU_WEEKDAYS = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
const URDU_MONTHS = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر',
];

// Sirf 0-9 English digits ko Urdu-Arabic digits mein convert karta hai
const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

function toUrduDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => URDU_DIGITS[Number(digit)]);
}

export class UrduDateFormatter {
  static formatDate(date: Date): string {
    const weekday = URDU_WEEKDAYS[date.getDay()];
    const day = toUrduDigits(date.getDate());
    const month = URDU_MONTHS[date.getMonth()];
    const year = toUrduDigits(date.getFullYear());

    return `${weekday}، ${day} ${month} ${year}`;
  }

  static formatTime(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'شام' : 'صبح';

    hours = hours % 12 || 12;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : String(minutes);

    return `${toUrduDigits(hours)}:${toUrduDigits(paddedMinutes)} ${period}`;
  }
}