import { AnnualObligation, ExpenseCategory, IncomeSource, QuarterlyObligation, SavingsGoal, Transaction, UserSettings } from '@/types/models';

export const defaultCategories: ExpenseCategory[] = [
  ['housing', 'Vivienda', '#f97316', 'Home'],
  ['groceries', 'Supermercado', '#84cc16', 'ShoppingBasket'],
  ['transport', 'Transporte', '#06b6d4', 'Bus'],
  ['subscriptions', 'Suscripciones', '#a855f7', 'BadgeEuro'],
  ['health', 'Salud', '#ef4444', 'HeartPulse'],
  ['leisure', 'Ocio', '#ec4899', 'PartyPopper'],
  ['education', 'Educación', '#f59e0b', 'GraduationCap'],
  ['taxes', 'Impuestos', '#f43f5e', 'ReceiptText'],
  ['insurance', 'Seguros', '#6366f1', 'Shield'],
  ['pets', 'Mascotas', '#14b8a6', 'PawPrint'],
  ['savings', 'Ahorro', '#22c55e', 'PiggyBank'],
  ['debt', 'Deuda', '#dc2626', 'Landmark'],
  ['family', 'Familia', '#0ea5e9', 'Users'],
  ['business', 'Negocio', '#334155', 'BriefcaseBusiness']
].map(([id, name, color, icon], index) => ({ id, name, color, icon, archived: false, sortOrder: index }));

export interface DemoProfile {
  id: 'salaried' | 'household' | 'freelancer' | 'autonomo';
  title: string;
  settings: UserSettings;
  incomes: IncomeSource[];
  transactions: Transaction[];
  annual: AnnualObligation[];
  quarterly: QuarterlyObligation[];
  goals: SavingsGoal[];
}

const baseAnnual: AnnualObligation[] = [
  { id: 'a-car', title: 'Seguro del coche', amount: 520, dueMonth: 7, categoryId: 'insurance', createdAt: '2026-01-01' },
  { id: 'a-ibi', title: 'IBI', amount: 390, dueMonth: 10, categoryId: 'housing', createdAt: '2026-01-01' },
  { id: 'a-dental', title: 'Revisión dental familiar', amount: 240, dueMonth: 11, categoryId: 'health', createdAt: '2026-01-01' }
];

export const demoProfiles: DemoProfile[] = [
  {
    id: 'salaried',
    title: 'Empleado con nómina',
    settings: { id: 'settings', language: 'es', currency: 'EUR', incomeProfile: 'fixedSalary', mode: 'personal', createdAt: '2026-01-01' },
    incomes: [{ id: 'inc-salary', name: 'Nómina', amount: 2100, isVariable: false, frequency: 'monthly', expectedDate: 28, scope: 'personal', active: true }],
    transactions: [
      { id: 'tx-rent', date: '2026-03-01', type: 'expense', categoryId: 'housing', amount: 860, description: 'Alquiler', kind: 'fixed', scope: 'personal' },
      { id: 'tx-groceries', date: '2026-03-03', type: 'expense', categoryId: 'groceries', amount: 132, description: 'Compra semanal', kind: 'variable', scope: 'personal' },
      { id: 'tx-income', date: '2026-03-28', type: 'income', amount: 2100, description: 'Nómina marzo', scope: 'personal' }
    ],
    annual: baseAnnual,
    quarterly: [],
    goals: [{ id: 'goal-emergency', name: 'Fondo emergencia', targetAmount: 5000, currentAmount: 1900, targetDate: '2026-12-31' }]
  },
  {
    id: 'household',
    title: 'Pareja / hogar',
    settings: { id: 'settings', language: 'es', currency: 'EUR', incomeProfile: 'multipleIncomes', mode: 'household', createdAt: '2026-01-01' },
    incomes: [
      { id: 'inc-a', name: 'Nómina Ana', amount: 1850, isVariable: false, frequency: 'monthly', expectedDate: 29, scope: 'personal', active: true },
      { id: 'inc-b', name: 'Nómina Pablo', amount: 1700, isVariable: false, frequency: 'monthly', expectedDate: 25, scope: 'personal', active: true }
    ],
    transactions: [
      { id: 'tx-housing', date: '2026-03-01', type: 'expense', categoryId: 'housing', amount: 1150, description: 'Hipoteca', kind: 'fixed', shared: true, paidBy: 'Ana', scope: 'personal' },
      { id: 'tx-school', date: '2026-03-09', type: 'expense', categoryId: 'family', amount: 210, description: 'Comedor escolar', kind: 'fixed', shared: true, paidBy: 'Pablo', scope: 'personal' }
    ],
    annual: baseAnnual,
    quarterly: [],
    goals: [{ id: 'goal-trip', name: 'Viaje familiar', targetAmount: 2800, currentAmount: 900, targetDate: '2026-09-01' }]
  },
  {
    id: 'freelancer',
    title: 'Freelancer creativo',
    settings: { id: 'settings', language: 'es', currency: 'EUR', incomeProfile: 'variableIncome', mode: 'selfEmployed', createdAt: '2026-01-01' },
    incomes: [
      { id: 'inc-design', name: 'Proyecto branding', amount: 1300, isVariable: true, frequency: 'monthly', expectedDate: 14, scope: 'business', active: true },
      { id: 'inc-web', name: 'Mantenimiento web', amount: 650, isVariable: false, frequency: 'monthly', expectedDate: 3, scope: 'business', active: true }
    ],
    transactions: [
      { id: 'tx-software', date: '2026-03-02', type: 'expense', categoryId: 'business', amount: 82, description: 'Herramientas SaaS', kind: 'fixed', scope: 'business' },
      { id: 'tx-cowork', date: '2026-03-05', type: 'expense', categoryId: 'business', amount: 190, description: 'Coworking', kind: 'fixed', scope: 'business' }
    ],
    annual: baseAnnual,
    quarterly: [{ id: 'q-1', title: 'Reserva IRPF', amount: 1200, dueMonths: [3, 6, 9, 12], categoryId: 'taxes', createdAt: '2026-01-01' }],
    goals: [{ id: 'goal-gear', name: 'Nuevo portátil', targetAmount: 1700, currentAmount: 620, targetDate: '2026-10-30' }]
  },
  {
    id: 'autonomo',
    title: 'Autónomo español',
    settings: { id: 'settings', language: 'es', currency: 'EUR', incomeProfile: 'freelancer', mode: 'selfEmployed', createdAt: '2026-01-01' },
    incomes: [
      { id: 'inc-client-a', name: 'Cliente Retainer', amount: 2200, isVariable: false, frequency: 'monthly', expectedDate: 10, scope: 'business', active: true },
      { id: 'inc-client-b', name: 'Proyectos puntuales', amount: 1400, isVariable: true, frequency: 'monthly', expectedDate: 22, scope: 'business', active: true }
    ],
    transactions: [
      { id: 'tx-autonomo-fee', date: '2026-03-31', type: 'expense', categoryId: 'taxes', amount: 326, description: 'Cuota autónomos', kind: 'fixed', scope: 'business' },
      { id: 'tx-vat', date: '2026-03-20', type: 'expense', categoryId: 'taxes', amount: 450, description: 'IVA trimestral (simulado)', kind: 'quarterly', scope: 'business' },
      { id: 'tx-rent-home', date: '2026-03-01', type: 'expense', categoryId: 'housing', amount: 780, description: 'Alquiler vivienda', kind: 'fixed', scope: 'personal' }
    ],
    annual: baseAnnual,
    quarterly: [
      { id: 'q-iva', title: 'Reserva IVA', amount: 1800, dueMonths: [3, 6, 9, 12], categoryId: 'taxes', createdAt: '2026-01-01' },
      { id: 'q-irpf', title: 'Reserva IRPF', amount: 1350, dueMonths: [3, 6, 9, 12], categoryId: 'taxes', createdAt: '2026-01-01' }
    ],
    goals: [{ id: 'goal-cushion', name: 'Colchón 6 meses', targetAmount: 9000, currentAmount: 2200, targetDate: '2027-06-30' }]
  }
];

export const csvTemplate = `date,type,description,amount,category,kind,scope\n2026-03-01,expense,Alquiler,850,housing,fixed,personal\n2026-03-08,income,Nómina,2100,,monthly,personal`;
