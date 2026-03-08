import { Card } from '@/components/ui/card';
import { useFinanceStore } from '@/store/useFinanceStore';

export function GoalsPage() {
  const goals = useFinanceStore((s) => s.goals);
  return <Card><h2 className="mb-2 text-lg font-semibold">Objetivos de ahorro</h2>{goals.map((goal) => <div key={goal.id} className="mb-3"><p>{goal.name}</p><progress className="w-full" value={goal.currentAmount} max={goal.targetAmount} /></div>)}</Card>;
}
