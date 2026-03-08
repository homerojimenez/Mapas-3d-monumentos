import Dexie, { Table } from 'dexie';
import { AnnualObligation, Budget, ExpenseCategory, IncomeSource, MonthlySnapshot, QuarterlyObligation, SavingsGoal, Transaction, UserSettings } from '@/types/models';

class FinanceDB extends Dexie {
  settings!: Table<UserSettings, string>;
  incomes!: Table<IncomeSource, string>;
  categories!: Table<ExpenseCategory, string>;
  transactions!: Table<Transaction, string>;
  annual!: Table<AnnualObligation, string>;
  quarterly!: Table<QuarterlyObligation, string>;
  budgets!: Table<Budget, string>;
  goals!: Table<SavingsGoal, string>;
  snapshots!: Table<MonthlySnapshot, string>;

  constructor() {
    super('finanzas-clara');
    this.version(1).stores({
      settings: 'id',
      incomes: 'id, active',
      categories: 'id, archived',
      transactions: 'id, date, type, categoryId',
      annual: 'id, dueMonth',
      quarterly: 'id',
      budgets: 'id, categoryId',
      goals: 'id, targetDate',
      snapshots: 'id, month'
    });
  }
}

export const db = new FinanceDB();
