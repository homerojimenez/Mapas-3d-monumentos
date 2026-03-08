import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <section className={cn('rounded-2xl border border-slate-200 bg-white p-4 shadow-sm', className)}>{children}</section>;
}
