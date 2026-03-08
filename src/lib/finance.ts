import { addDays, addMonths, differenceInCalendarMonths, endOfMonth, isAfter, isBefore, parseISO, startOfMonth } from 'date-fns';
import { AnnualObligation, Budget, InsightRecommendation, QuarterlyObligation, Transaction } from '@/types/models';

export const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

export const monthlyProvisionForAnnual = (amount: number, dueMonth: number, now = new Date()) => {
  const currentMonth = now.getMonth() + 1;
  const monthsLeft = dueMonth >= currentMonth ? dueMonth - currentMonth + 1 : 12 - currentMonth + dueMonth + 1;
  return amount / Math.max(monthsLeft, 1);
};

export const monthlyProvisionForQuarterly = (amount: number, dueMonths: number[], now = new Date()) => {
  const month = now.getMonth() + 1;
  const nextDue = dueMonths.find((m) => m >= month) ?? dueMonths[0];
  const monthsLeft = nextDue >= month ? nextDue - month + 1 : 12 - month + nextDue + 1;
  return amount / Math.max(monthsLeft, 1);
};

export const calculateMonthlyTotals = (transactions: Transaction[], monthISO: string) => {
  const monthStart = startOfMonth(parseISO(`${monthISO}-01`));
  const monthEnd = endOfMonth(monthStart);
  const filtered = transactions.filter((tx) => {
    const date = parseISO(tx.date);
    return !isBefore(date, monthStart) && !isAfter(date, monthEnd);
  });

  const income = sum(filtered.filter((tx) => tx.type === 'income').map((tx) => tx.amount));
  const expenses = sum(filtered.filter((tx) => tx.type === 'expense').map((tx) => tx.amount));
  return { income, expenses, savings: income - expenses };
};

export const projectedSavings = (income: number, expenses: number, annualReserve: number, quarterlyReserve: number) =>
  income - expenses - annualReserve - quarterlyReserve;

export const autonomoCashBreakdown = (income: number, expense: number, taxReserve: number) => ({
  earnedIncome: income,
  availableCash: income - expense,
  taxReserve,
  spendable: income - expense - taxReserve
});

export const budgetHealth = (spent: number, budget: Budget) => {
  const ratio = spent / budget.monthlyLimit;
  if (ratio >= 1) return 'exceeded';
  if (ratio >= budget.warningThreshold) return 'warning';
  return 'good';
};

export const trendComparison = (current: number, previous: number) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

export const upcomingObligations = (transactions: Transaction[], days = 30, now = new Date()) => {
  const end = addDays(now, days);
  return transactions.filter((tx) => tx.type === 'expense' && parseISO(tx.date) >= now && parseISO(tx.date) <= end);
};

export const recommendationsFromRules = (params: {
  annual: AnnualObligation[];
  quarterly: QuarterlyObligation[];
  fixedExpenseRatio: number;
  leisureTrend: number;
  projected: number;
  annualReserve: number;
  upcomingCount: number;
}): InsightRecommendation[] => {
  const items: InsightRecommendation[] = [];
  if (params.annual.length >= 3) items.push({ id: 'annual', severity: 'warning', text: `Tienes ${params.annual.length} pagos anuales que conviene preparar.` });
  if (params.leisureTrend > 25) items.push({ id: 'leisure', severity: 'warning', text: `Tu gasto en ocio está ${params.leisureTrend.toFixed(0)}% por encima de tu media.` });
  if (params.fixedExpenseRatio > 0.6) items.push({ id: 'fixed', severity: 'warning', text: `Tus gastos fijos ya consumen ${(params.fixedExpenseRatio * 100).toFixed(0)}% de tus ingresos.` });
  if (params.annualReserve > 0) items.push({ id: 'reserve', severity: 'info', text: `Reserva ${params.annualReserve.toFixed(0)}€ este mes para pagos anuales.` });
  if (params.upcomingCount >= 4) items.push({ id: 'timing', severity: 'warning', text: `Tienes ${params.upcomingCount} pagos importantes en los próximos 30 días.` });
  if (params.projected < 0) items.push({ id: 'risk', severity: 'critical', text: 'Riesgo de cierre en negativo este mes si no ajustas gastos.' });
  return items;
};

export const monthsBetween = (from: string, to: string) => differenceInCalendarMonths(parseISO(to), parseISO(from));
export const nextMonthDate = (now = new Date()) => addMonths(now, 1);
