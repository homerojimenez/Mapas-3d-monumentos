import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { csvTemplate } from '@/data/seed';
import { useFinanceStore } from '@/store/useFinanceStore';

export function SettingsPage() {
  const resetAllData = useFinanceStore((s) => s.resetAllData);

  const exportJson = () => {
    const blob = new Blob([localStorage.getItem('finance-mvp') ?? '{}'], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'finanzas-backup.json';
    link.click();
  };

  return (
    <div className="space-y-3">
      <Card>
        <h2 className="text-lg font-semibold">Privacidad y confianza</h2>
        <p className="mt-2 text-sm text-slate-600">Tus datos están en local. Esta app no ofrece asesoría legal o fiscal.</p>
      </Card>
      <Card>
        <h3 className="font-semibold">Importación / Exportación</h3>
        <p className="mt-1 text-xs text-slate-500">Plantilla CSV:</p>
        <pre className="mt-2 overflow-auto rounded bg-slate-100 p-2 text-xs">{csvTemplate}</pre>
        <div className="mt-3 flex gap-2">
          <Button onClick={exportJson}>Exportar JSON</Button>
          <Button className="bg-red-600 hover:bg-red-700" onClick={resetAllData}>Borrar todos los datos</Button>
        </div>
      </Card>
    </div>
  );
}
