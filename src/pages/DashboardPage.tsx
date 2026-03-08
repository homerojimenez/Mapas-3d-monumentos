import { AdBannerPlaceholder } from '@/components/ads/AdPlaceholder';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useFinanceStore } from '@/store/useFinanceStore';

export function DashboardPage() {
  const monthlySummary = useFinanceStore((s) => s.monthlySummary);
  const recomputeInsights = useFinanceStore((s) => s.recomputeInsights);
  const insights = useFinanceStore((s) => s.insights);
  const settings = useFinanceStore((s) => s.settings);
  const autonomoSummary = useFinanceStore((s) => s.autonomoSummary());

  const totals = monthlySummary();
  const cards = [
    { label: 'Lo que entra', value: totals.income, help: 'Tus ingresos de este mes' },
    { label: 'Lo que gastas', value: totals.expenses, help: 'Pagos ya registrados' },
    { label: 'Reserva anual', value: totals.annualReserve, help: 'Para pagos anuales' },
    { label: 'Reserva trimestral', value: totals.quarterlyReserve, help: 'Para impuestos/pagos trimestrales' },
    { label: 'Te queda hoy', value: totals.income - totals.expenses, help: 'Antes de reservas' },
    { label: 'Fin de mes estimado', value: totals.projected, help: 'Después de reservas' }
  ];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Tu mes de un vistazo</h1>
        <p className="text-sm text-slate-600">Información simple: entra, sale, reservas y dinero realmente disponible.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((item) => (
          <Card key={item.label}>
            <p className="text-xs uppercase text-slate-500">{item.label}</p>
            <p className="text-2xl font-semibold">{formatCurrency(item.value)}</p>
            <p className="text-xs text-slate-500">{item.help}</p>
          </Card>
        ))}
      </div>

      {settings?.mode === 'selfEmployed' && (
        <Card className="border-reserve/30 bg-sky-50">
          <h3 className="font-semibold text-sky-900">Panel autónomo (España)</h3>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <p>Ingresado: <strong>{formatCurrency(autonomoSummary.earnedIncome)}</strong></p>
            <p>Caja disponible: <strong>{formatCurrency(autonomoSummary.availableCash)}</strong></p>
            <p>Reserva impuestos: <strong>{formatCurrency(autonomoSummary.taxReserve)}</strong></p>
            <p>Dinero realmente gastable: <strong>{formatCurrency(autonomoSummary.spendable)}</strong></p>
          </div>
        </Card>
      )}

      <DashboardOverview />

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Recomendaciones</h3>
          <button className="text-sm text-blue-600" onClick={recomputeInsights}>Actualizar</button>
        </div>
        <ul className="space-y-2 text-sm">
          {insights.length === 0 && <li className="rounded-lg bg-slate-100 p-2">Pulsa “Actualizar” para recibir guía automática.</li>}
          {insights.map((item) => <li key={item.id} className="rounded-lg bg-slate-100 p-2">{item.text}</li>)}
        </ul>
      </Card>

      <AdBannerPlaceholder />
    </div>
  );
}
