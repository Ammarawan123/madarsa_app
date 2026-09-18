const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const HIJRI_MONTHS = [
  'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدہ', 'ذو الحجہ',
];

function toUrduDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (digit) => URDU_DIGITS[Number(digit)]);
}

export class HijriDateFormatter {
  static formatDate(date: Date): string {
    // Kuwaiti algorithm — Gregorian se Hijri conversion
    const jd = Math.floor(
      (1461 * (date.getFullYear() + 4800 + (date.getMonth() - 14) / 12)) / 4 +
        (367 * (date.getMonth() - 2 - 12 * ((date.getMonth() - 14) / 12))) / 12 -
        (3 * ((date.getFullYear() + 4900 + (date.getMonth() - 14) / 12) / 100)) / 4 +
        date.getDate() -
        32075
    );

    const l1 = jd - 1948440 + 10632;
    const n = Math.floor((l1 - 1) / 10631);
    const l2 = l1 - 10631 * n + 354;
    const j =
      Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
      Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 =
      l2 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    const hijriMonth = Math.floor((24 * l3) / 709);
    const hijriDay = l3 - Math.floor((709 * hijriMonth) / 24);
    const hijriYear = 30 * n + j - 30;

    const monthName = HIJRI_MONTHS[hijriMonth - 1] ?? HIJRI_MONTHS[0];

    return `${toUrduDigits(hijriDay)} ${monthName}، ${toUrduDigits(hijriYear)} ہجری`;
  }
}