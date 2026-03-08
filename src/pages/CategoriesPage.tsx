import { Card } from '@/components/ui/card';
import { useFinanceStore } from '@/store/useFinanceStore';

export function CategoriesPage() {
  const categories = useFinanceStore((s) => s.categories);
  return <Card><h2 className="mb-3 text-lg font-semibold">Categorías</h2><div className="grid grid-cols-2 gap-2 text-sm">{categories.map((c) => <div key={c.id} className="rounded-lg p-2" style={{ backgroundColor: `${c.color}20` }}>{c.name}</div>)}</div></Card>;
}
