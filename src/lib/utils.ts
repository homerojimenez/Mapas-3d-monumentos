import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: Array<string | undefined | false>) => twMerge(clsx(inputs));

export const formatCurrency = (value: number, currency = 'EUR', locale = 'es-ES') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export const formatDate = (iso: string, locale = 'es-ES') => new Intl.DateTimeFormat(locale, { day: '2-digit', month: 'short' }).format(new Date(iso));
