import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useFinanceStore } from '@/store/useFinanceStore';

export function MonthlyPlannerPage() {
  const annual = useFinanceStore((s) => s.annual);
  const quarterly = useFinanceStore((s) => s.quarterly);
  const summary = useFinanceStore((s) => s.monthlySummary());

  return (
    <div className="space-y-3">
      <Card>
        <h2 className="mb-2 text-lg font-semibold">Planificador de mes</h2>
        <p className="text-sm text-slate-600">Objetivo: evitar sustos. Aparta cada mes una parte para los pagos grandes.</p>
        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <p>Reserva anual sugerida: <strong>{formatCurrency(summary.annualReserve)}</strong></p>
          <p>Reserva trimestral sugerida: <strong>{formatCurrency(summary.quarterlyReserve)}</strong></p>
          <p>Disponible tras reservas: <strong>{formatCurrency(summary.projected)}</strong></p>
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold">Pagos anuales</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {annual.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-slate-600">Pago completo: {formatCurrency(item.amount)} · Mes de vencimiento: {item.dueMonth}</p>
              <p className="text-slate-700">Reserva mensual automática incluida en el resumen.</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="font-semibold">Pagos trimestrales</h3>
        <ul className="mt-2 space-y-2 text-sm">
          {quarterly.length === 0 && <li className="rounded-lg bg-slate-100 p-2">No hay obligaciones trimestrales activas.</li>}
          {quarterly.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium">{item.title}</p>
              <p className="text-slate-600">Importe trimestral: {formatCurrency(item.amount)} · Meses: {item.dueMonths.join(', ')}</p>
              <p className="text-slate-700">El sistema reparte una reserva mensual para evitar picos de caja.</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
