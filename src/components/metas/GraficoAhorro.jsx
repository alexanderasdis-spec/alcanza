import { useMemo } from 'react'
import { Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useMoneda } from '../../hooks/useMoneda'
import { ahorroPorMes } from '../../utils/calculos'

/** Colores de la paleta (los mismos de `@theme` en index.css). */
const COLOR_ACUMULADO = '#7c3aed'
const COLOR_MES = '#10b981'

/**
 * Nombre corto del mes para el eje: "2026-11" → "nov 26".
 *
 * @param {string} mes - Mes en formato `AAAA-MM`.
 * @returns {string}
 */
function mesCorto(mes) {
  const [anio, numero] = mes.split('-').map(Number)
  return new Date(anio, numero - 1, 1)
    .toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    .replace('.', '')
    .replace(' de ', ' ')
}

/**
 * Cuadro que aparece al pasar el mouse por un mes del gráfico.
 *
 * @param {Object} props - Las envía Recharts.
 * @param {boolean} [props.active]
 * @param {{ payload: { mes: string, ahorradoMes: number, acumulado: number } }[]} [props.payload]
 * @param {(valor: number, moneda: 'COP') => string} props.formatear
 * @returns {JSX.Element | null}
 */
function CuadroMes({ active, payload, formatear }) {
  if (!active || !payload?.length) return null
  const { mes, ahorradoMes, acumulado } = payload[0].payload
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-sm shadow-xl dark:border-slate-700 dark:bg-slate-900/95">
      <p className="font-titulo font-semibold first-letter:uppercase">{mesCorto(mes)}</p>
      <p className="mt-1 text-menta">Abonaste {formatear(ahorradoMes, 'COP')}</p>
      <p className="text-violeta dark:text-violet-300">Llevas {formatear(acumulado, 'COP')}</p>
    </div>
  )
}

/**
 * Gráfico "Tu ahorro mes a mes" de Mis metas, hecho con Recharts.
 * Las barras verdes son lo abonado cada mes y el área violeta el total acumulado.
 * Junta los abonos de todas las metas (vienen en la lista de metas de la API).
 *
 * @param {Object} props
 * @param {import('../../services/metasService').Meta[]} props.metas
 * @returns {JSX.Element}
 */
function GraficoAhorro({ metas }) {
  const { formatear } = useMoneda()
  const datos = useMemo(() => ahorroPorMes(metas.flatMap((meta) => meta.abonos ?? [])), [metas])

  return (
    <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-xl shadow-violeta/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/60">
      <h2 className="flex items-center gap-2 font-titulo text-xl font-bold">
        <TrendingUp className="size-5 text-menta" />
        Tu ahorro mes a mes
      </h2>

      {datos.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
          Cuando registres tu primer abono, aquí verás cómo crece tu ahorro.
        </p>
      ) : (
        <>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-menta">Barras:</span> lo que abonaste cada mes ·{' '}
            <span className="font-semibold text-violeta dark:text-violet-300">Área:</span> el total que llevas.
          </p>
          <div className="mt-4 h-64" role="img" aria-label="Gráfico del ahorro acumulado por mes">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={datos} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="degradado-acumulado" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLOR_ACUMULADO} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={COLOR_ACUMULADO} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="currentColor" strokeOpacity={0.12} vertical={false} />
                <XAxis dataKey="mes" tickFormatter={mesCorto} tick={{ fontSize: 12, fill: 'currentColor' }} tickLine={false} axisLine={false} />
                <YAxis
                  width={70}
                  tick={{ fontSize: 11, fill: 'currentColor' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(valor) => formatear(valor, 'COP')}
                />
                <Tooltip content={<CuadroMes formatear={formatear} />} cursor={{ fill: COLOR_ACUMULADO, fillOpacity: 0.06 }} />
                <Area type="monotone" dataKey="acumulado" stroke={COLOR_ACUMULADO} strokeWidth={3} fill="url(#degradado-acumulado)" />
                <Bar dataKey="ahorradoMes" fill={COLOR_MES} radius={[8, 8, 0, 0]} maxBarSize={36} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default GraficoAhorro
