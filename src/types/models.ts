export type Language = 'es' | 'en';
export type FinanceMode = 'personal' | 'household' | 'selfEmployed';
export type Frequency = 'monthly' | 'biweekly' | 'quarterly' | 'yearly' | 'oneTime';
export type ExpenseKind = 'fixed' | 'variable' | 'annual' | 'quarterly' | 'oneTime';

export interface UserSettings {
  id: string;
  language: Language;
  currency: string;
  incomeProfile: 'fixedSalary' | 'multipleIncomes' | 'variableIncome' | 'freelancer';
  mode: FinanceMode;
  createdAt: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  isVariable: boolean;
  frequency: Frequency;
  expectedDate?: number;
  notes?: string;
  scope: 'personal' | 'business';
  active: boolean;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  archived: boolean;
  sortOrder: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  categoryId?: string;
  amount: number;
  description: string;
  kind?: ExpenseKind;
  shared?: boolean;
  paidBy?: string;
  scope: 'personal' | 'business';
}

export interface RecurringRule {
  id: string;
  transactionId: string;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  skipMonths?: string[];
}

export interface AnnualObligation {
  id: string;
  title: string;
  amount: number;
  dueMonth: number;
  categoryId: string;
  createdAt: string;
}

export interface QuarterlyObligation {
  id: string;
  title: string;
  amount: number;
  dueMonths: number[];
  categoryId: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  monthlyLimit: number;
  warningThreshold: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface MonthlySnapshot {
  id: string;
  month: string;
  totalIncome: number;
  totalExpense: number;
  reservedAnnual: number;
  reservedQuarterly: number;
  savings: number;
  closedAt: string;
}

export interface HouseholdMember {
  id: string;
  name: string;
}

export interface InsightRecommendation {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  text: string;
}
