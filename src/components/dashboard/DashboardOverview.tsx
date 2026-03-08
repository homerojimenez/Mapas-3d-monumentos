import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

const byCategory = [
  { name: 'Vivienda', value: 860, color: '#f97316' },
  { name: 'Supermercado', value: 280, color: '#84cc16' },
  { name: 'Transporte', value: 130, color: '#06b6d4' },
  { name: 'Impuestos', value: 326, color: '#f43f5e' }
];

const byMonth = [
  { month: 'Dic', income: 3200, expense: 2300 },
  { month: 'Ene', income: 2800, expense: 2100 },
  { month: 'Feb', income: 3550, expense: 2400 },
  { month: 'Mar', income: 3600, expense: 2550 }
];

export function DashboardOverview() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-1 font-semibold">¿En qué se va tu dinero?</h3>
        <p className="mb-3 text-xs text-slate-500">Distribución por categorías del mes.</p>
        <div className="h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={byCategory} dataKey="value" innerRadius={50} outerRadius={82}>
                {byCategory.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <h3 className="mb-1 font-semibold">Ingresos vs gastos recientes</h3>
        <p className="mb-3 text-xs text-slate-500">Comparativa de los últimos meses.</p>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={byMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Bar dataKey="income" name="Ingresos" fill="#16a34a" />
              <Bar dataKey="expense" name="Gastos" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
