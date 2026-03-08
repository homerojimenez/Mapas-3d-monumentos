# Finanzas Clara (MVP refinado)

Aplicación de finanzas personales **offline-first** pensada para sustituir la hoja Excel mensual con una experiencia clara, calmada y útil para personas no técnicas, familias y autónomos en España.

## Qué mejora esta versión
- Dashboard con lenguaje simple: **entra / sale / reservas / te queda**.
- Planeación anual y trimestral destacada como funcionalidad central.
- Panel específico para autónomos: ingresos, caja disponible, reserva fiscal y dinero gastable real.
- Flujos demo realistas desde onboarding (empleado, hogar, freelance, autónomo español).
- Navegación optimizada mobile (bottom nav) y escritorio (sidebar).
- Base PWA estática con manifest + service worker.

## Stack
- React + TypeScript + Vite
- Tailwind CSS (componentes tipo shadcn/ui)
- Zustand (estado local persistente)
- Dexie + IndexedDB (estructura de persistencia)
- Recharts
- date-fns
- zod + React Hook Form

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Estructura
```txt
src/
  components/
    ads/            # placeholders de monetización no intrusiva
    dashboard/      # visualizaciones y bloques de resumen
    forms/          # onboarding y formularios
    layout/         # sidebar + navegación móvil
    ui/             # primitives (Card, Button, Input)
  data/             # seeds realistas + plantilla CSV
  lib/              # utilidades financieras, db, formateo
  pages/            # pantallas principales
  store/            # estado global + selectores/acciones
  types/            # modelos de dominio
```

## Datos demo incluidos
Desde onboarding puedes cargar:
- Empleado con nómina fija.
- Pareja/hogar con gastos compartidos.
- Freelancer con ingresos variables.
- Autónomo en España con reservas IVA + IRPF trimestrales.

## Privacidad
- Datos guardados localmente.
- Sin conexión bancaria.
- Herramienta organizativa (no asesoría fiscal/legal).

## Roadmap
### Phase 2
- Supabase auth opcional y sincronización cloud.
- Backup en nube + multi-dispositivo.
- Notificaciones y recordatorios.
- Importación bancaria CSV guiada.
- OCR de tickets/recibos.
- Mejor previsión fiscal autónomos.
- Colaboración avanzada hogar.

### Phase 3
- Automatizaciones por reglas.
- Informes pro y exportaciones avanzadas.
- Premium sin anuncios.
- Resolución de conflictos de sincronización.

## Deploy estático
- Compatible con Vercel/Netlify/Cloudflare Pages.
- Build: `npm run build`
- Output: `dist`
