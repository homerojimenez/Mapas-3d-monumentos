import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultCategories, demoProfiles, DemoProfile } from '@/data/seed';
import {
  autonomoCashBreakdown,
  calculateMonthlyTotals,
  monthlyProvisionForAnnual,
  monthlyProvisionForQuarterly,
  projectedSavings,
  recommendationsFromRules,
  sum,
  upcomingObligations
} from '@/lib/finance';
import {
  AnnualObligation,
  Budget,
  ExpenseCategory,
  IncomeSource,
  InsightRecommendation,
  QuarterlyObligation,
  SavingsGoal,
  Transaction,
  UserSettings
} from '@/types/models';

interface MonthlySummary {
  income: number;
  expenses: number;
  annualReserve: number;
  quarterlyReserve: number;
  projected: number;
}

interface FinanceState {
  onboarded: boolean;
  settings?: UserSettings;
  incomes: IncomeSource[];
  categories: ExpenseCategory[];
  transactions: Transaction[];
  annual: AnnualObligation[];
  quarterly: QuarterlyObligation[];
  budgets: Budget[];
  goals: SavingsGoal[];
  insights: InsightRecommendation[];
  completeOnboarding: (settings: UserSettings) => void;
  loadDemoProfile: (profileId: DemoProfile['id']) => void;
  addTransaction: (tx: Transaction) => void;
  monthlySummary: () => MonthlySummary;
  autonomoSummary: () => ReturnType<typeof autonomoCashBreakdown>;
  recomputeInsights: () => void;
  resetAllData: () => void;
}

const fallbackProfile = demoProfiles.find((profile) => profile.id === 'autonomo') ?? demoProfiles[0];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      onboarded: false,
      settings: fallbackProfile.settings,
      incomes: fallbackProfile.incomes,
      categories: defaultCategories,
      transactions: fallbackProfile.transactions,
      annual: fallbackProfile.annual,
      quarterly: fallbackProfile.quarterly,
      budgets: [{ id: 'b-1', categoryId: 'groceries', monthlyLimit: 350, warningThreshold: 0.85 }],
      goals: fallbackProfile.goals,
      insights: [],
      completeOnboarding: (settings) => set({ settings, onboarded: true }),
      loadDemoProfile: (profileId) => {
        const profile = demoProfiles.find((item) => item.id === profileId) ?? fallbackProfile;
        set({
          onboarded: true,
          settings: profile.settings,
          incomes: profile.incomes,
          transactions: profile.transactions,
          annual: profile.annual,
          quarterly: profile.quarterly,
          goals: profile.goals,
          insights: []
        });
      },
      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      monthlySummary: () => {
        const state = get();
        const totals = calculateMonthlyTotals(state.transactions, '2026-03');
        const annualReserve = sum(state.annual.map((item) => monthlyProvisionForAnnual(item.amount, item.dueMonth)));
        const quarterlyReserve = sum(state.quarterly.map((item) => monthlyProvisionForQuarterly(item.amount, item.dueMonths)));
        return {
          income: totals.income,
          expenses: totals.expenses,
          annualReserve,
          quarterlyReserve,
          projected: projectedSavings(totals.income, totals.expenses, annualReserve, quarterlyReserve)
        };
      },
      autonomoSummary: () => {
        const summary = get().monthlySummary();
        return autonomoCashBreakdown(summary.income, summary.expenses, summary.quarterlyReserve);
      },
      recomputeInsights: () => {
        const state = get();
        const summary = state.monthlySummary();
        const upcomingCount = upcomingObligations(state.transactions).length + state.annual.length + state.quarterly.length;
        set({
          insights: recommendationsFromRules({
            annual: state.annual,
            quarterly: state.quarterly,
            fixedExpenseRatio: summary.expenses / Math.max(summary.income, 1),
            leisureTrend: 18,
            projected: summary.projected,
            annualReserve: summary.annualReserve,
            upcomingCount
          })
        });
      },
      resetAllData: () => set({ onboarded: false, settings: undefined, transactions: [], incomes: [], annual: [], quarterly: [], budgets: [], goals: [] })
    }),
    { name: 'finance-mvp' }
  )
);
