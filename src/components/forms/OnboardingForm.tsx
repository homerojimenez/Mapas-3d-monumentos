import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFinanceStore } from '@/store/useFinanceStore';

const schema = z.object({
  language: z.enum(['es', 'en']),
  currency: z.string().min(3),
  incomeProfile: z.enum(['fixedSalary', 'multipleIncomes', 'variableIncome', 'freelancer']),
  mode: z.enum(['personal', 'household', 'selfEmployed'])
});

type FormData = z.infer<typeof schema>;

export function OnboardingForm() {
  const complete = useFinanceStore((s) => s.completeOnboarding);
  const loadDemoProfile = useFinanceStore((s) => s.loadDemoProfile);
  const { register, handleSubmit, formState } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { language: 'es', currency: 'EUR', incomeProfile: 'fixedSalary', mode: 'personal' }
  });

  const onSubmit = (data: FormData) => complete({ id: 'settings', ...data, createdAt: new Date().toISOString() });

  return (
    <Card className="mx-auto mt-8 max-w-2xl space-y-4">
      <h2 className="text-2xl font-bold">Bienvenido a Finanzas Clara</h2>
      <p className="text-sm text-slate-600">Empieza con tu configuración o carga un ejemplo real para aprender en 1 minuto.</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => loadDemoProfile('salaried')}>Demo empleado</Button>
        <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => loadDemoProfile('household')}>Demo hogar</Button>
        <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => loadDemoProfile('freelancer')}>Demo freelance</Button>
        <Button className="bg-slate-200 text-slate-800 hover:bg-slate-300" onClick={() => loadDemoProfile('autonomo')}>Demo autónomo España</Button>
      </div>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <label className="text-sm">Idioma
          <select {...register('language')} className="mt-1 w-full rounded-xl border border-slate-300 p-2">
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </label>
        <label className="text-sm">Moneda<Input {...register('currency')} aria-label="Moneda" /></label>
        <label className="text-sm">Cómo cobras normalmente
          <select {...register('incomeProfile')} className="mt-1 w-full rounded-xl border border-slate-300 p-2">
            <option value="fixedSalary">Nómina fija</option>
            <option value="multipleIncomes">Ingresos múltiples</option>
            <option value="variableIncome">Ingresos variables</option>
            <option value="freelancer">Autónomo / freelance</option>
          </select>
        </label>
        <label className="text-sm">Tu espacio
          <select {...register('mode')} className="mt-1 w-full rounded-xl border border-slate-300 p-2">
            <option value="personal">Solo yo</option>
            <option value="household">Hogar / compartido</option>
            <option value="selfEmployed">Negocio autónomo</option>
          </select>
        </label>
        <Button type="submit" disabled={formState.isSubmitting}>Comenzar limpio</Button>
      </form>
    </Card>
  );
}
