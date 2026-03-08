import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'month', label: 'Mes' },
  { key: 'transactions', label: 'Movimientos' },
  { key: 'categories', label: 'Categorías' },
  { key: 'calendar', label: 'Calendario' },
  { key: 'reports', label: 'Reportes' },
  { key: 'goals', label: 'Objetivos' },
  { key: 'settings', label: 'Ajustes' }
] as const;

interface AppLayoutProps {
  active: string;
  onNavigate: (next: string) => void;
}

export function AppLayout({ children, active, onNavigate }: PropsWithChildren<AppLayoutProps>) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-5 md:block">
          <h1 className="mb-6 text-xl font-bold text-trust">Finanzas Clara</h1>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={cn('w-full rounded-xl px-3 py-2 text-left text-sm', active === tab.key ? 'bg-blue-600 text-white' : 'hover:bg-slate-100')}
                onClick={() => onNavigate(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
        <main className="w-full p-4 pb-24 md:p-8">{children}</main>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-2 md:hidden">
        <div className="grid grid-cols-4 gap-1 text-xs">
          {tabs.slice(0, 4).map((tab) => (
            <button
              key={tab.key}
              className={cn('rounded-lg px-2 py-2', active === tab.key ? 'bg-blue-600 text-white' : 'hover:bg-slate-100')}
              onClick={() => onNavigate(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
