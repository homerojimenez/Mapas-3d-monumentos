import { useMemo, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OnboardingForm } from '@/components/forms/OnboardingForm';
import { useFinanceStore } from '@/store/useFinanceStore';
import { DashboardPage } from '@/pages/DashboardPage';
import { MonthlyPlannerPage } from '@/pages/MonthlyPlannerPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { SettingsPage } from '@/pages/SettingsPage';

const sections = ['dashboard', 'month', 'transactions', 'categories', 'calendar', 'reports', 'goals', 'settings'] as const;

export default function App() {
  const onboarded = useFinanceStore((s) => s.onboarded);
  const [section, setSection] = useState<(typeof sections)[number]>('dashboard');

  const content = useMemo(() => {
    switch (section) {
      case 'month':
        return <MonthlyPlannerPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'reports':
        return <ReportsPage />;
      case 'goals':
        return <GoalsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  }, [section]);

  if (!onboarded) return <OnboardingForm />;

  return <AppLayout active={section} onNavigate={(next) => setSection(next as (typeof sections)[number])}>{content}</AppLayout>;
}
