/**
 * Utility functions for Korean film data formatting and date manipulation
 */

export function formatNumber(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0';
  const num = typeof val === 'string' ? Number(val) : val;
  if (isNaN(num)) return '0';
  return num.toLocaleString('ko-KR');
}

export function formatCompactKorean(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0명';
  const num = typeof val === 'string' ? Number(val) : val;
  if (isNaN(num)) return '0명';

  if (num >= 100_000_000) {
    return `${(num / 100_000_000).toFixed(1)}억명`;
  }
  if (num >= 10_000) {
    const man = Math.floor(num / 10_000);
    const remainder = Math.floor((num % 10_000) / 1_000);
    if (remainder > 0 && man < 100) {
      return `${(num / 10_000).toFixed(1)}만명`;
    }
    return `${formatNumber(man)}만명`;
  }
  return `${formatNumber(num)}명`;
}

export function formatCompactSales(val: number | string | undefined | null): string {
  if (val === undefined || val === null || val === '') return '0원';
  const num = typeof val === 'string' ? Number(val) : val;
  if (isNaN(num)) return '0원';

  if (num >= 100_000_000) {
    const eok = (num / 100_000_000).toFixed(1);
    return `${eok}억원`;
  }
  if (num >= 10_000) {
    const man = Math.floor(num / 10_000);
    return `${formatNumber(man)}만원`;
  }
  return `${formatNumber(num)}원`;
}

export function toYYYYMMDD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

export function parseYYYYMMDD(str: string): Date {
  const y = parseInt(str.substring(0, 4), 10);
  const m = parseInt(str.substring(4, 6), 10) - 1;
  const d = parseInt(str.substring(6, 8), 10);
  return new Date(y, m, d);
}

const KOREAN_DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDisplayDate(str: string): string {
  if (!str || str.length !== 8) return str;
  const date = parseYYYYMMDD(str);
  const dayName = KOREAN_DAY_NAMES[date.getDay()];
  const y = str.substring(0, 4);
  const m = str.substring(4, 6);
  const d = str.substring(6, 8);
  return `${y}년 ${m}월 ${d}일 (${dayName})`;
}

export function formatShortDate(str: string): string {
  if (!str || str.length !== 8) return str;
  const y = str.substring(0, 4);
  const m = str.substring(4, 6);
  const d = str.substring(6, 8);
  return `${y}.${m}.${d}`;
}

export function formatYYYYMMDDToInput(str: string): string {
  if (!str || str.length !== 8) return '';
  return `${str.substring(0, 4)}-${str.substring(4, 6)}-${str.substring(6, 8)}`;
}

export function inputToYYYYMMDD(input: string): string {
  return input.replace(/-/g, '');
}

export function addDays(str: string, days: number): string {
  const date = parseYYYYMMDD(str);
  date.setDate(date.getDate() + days);
  return toYYYYMMDD(date);
}

export function getYesterdayYYYYMMDD(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return toYYYYMMDD(now);
}

export function getAuditStyle(grade: string): { bg: string; text: string; border: string; label: string } {
  if (!grade) return { bg: 'bg-neutral-100 dark:bg-neutral-800', text: 'text-neutral-700 dark:text-neutral-300', border: 'border-neutral-200 dark:border-neutral-700', label: '정보없음' };
  
  if (grade.includes('전체')) {
    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200/80 dark:border-emerald-800/50',
      label: '전체 관람가',
    };
  }
  if (grade.includes('12')) {
    return {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200/80 dark:border-amber-800/50',
      label: '12세 이상',
    };
  }
  if (grade.includes('15')) {
    return {
      bg: 'bg-orange-50 dark:bg-orange-950/40',
      text: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-200/80 dark:border-orange-800/50',
      label: '15세 이상',
    };
  }
  if (grade.includes('청소년') || grade.includes('19') || grade.includes('제한')) {
    return {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200/80 dark:border-rose-800/50',
      label: '청소년 관람불가',
    };
  }
  return {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200/80 dark:border-blue-800/50',
    label: grade,
  };
}
