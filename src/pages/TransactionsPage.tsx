import { Card } from '@/components/ui/card';
import { useFinanceStore } from '@/store/useFinanceStore';

export function TransactionsPage() {
  const txs = useFinanceStore((s) => s.transactions);
  return (
    <Card>
      <h2 className="mb-2 text-lg font-semibold">Movimientos</h2>
      <ul className="space-y-2 text-sm">
        {txs.map((tx) => <li key={tx.id} className="flex justify-between border-b border-slate-100 pb-2"><span>{tx.description}</span><strong>{tx.amount}€</strong></li>)}
      </ul>
    </Card>
  );
}
