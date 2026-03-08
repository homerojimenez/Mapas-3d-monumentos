import { AdCardPlaceholder } from '@/components/ads/AdPlaceholder';
import { Card } from '@/components/ui/card';

export function ReportsPage() {
  return <div className="space-y-3"><Card><h2 className="text-lg font-semibold">Reportes</h2><p className="text-sm text-slate-600">Tendencias: mensual, categorías, fijo vs variable, ahorro, previsión anual y trimestral.</p></Card><AdCardPlaceholder /></div>;
}
