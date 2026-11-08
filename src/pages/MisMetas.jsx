import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PiggyBank, RefreshCw, Sparkles, Target, Trophy, WifiOff } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import ContadorAnimado from '../components/animaciones/ContadorAnimado'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import EstadoMensaje from '../components/EstadoMensaje'
import GraficoAhorro from '../components/metas/GraficoAhorro'
import TarjetaMeta from '../components/metas/TarjetaMeta'
import { useMetas, useResumenMetas } from '../hooks/useMetas'
import { useMoneda } from '../hooks/useMoneda'
import { lanzarConfeti } from '../utils/celebrar'
import { formatearMoneda } from '../utils/formato'

/** Clases del botón principal con el degradado de la marca. */
const CLASES_BOTON =
  'inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30'

/**
 * Página de metas (ruta `/metas`).
 * Muestra el resumen (metas activas, cumplidas y total ahorrado), el gráfico del ahorro mes a mes y una tarjeta por meta,
 * con su progreso y el formulario de abonos. Cuando un abono completa la meta,
 * lanza confeti y la tarjeta muestra la insignia de "cumplida".
 *
 * Las metas vienen del contexto `MetasProvider`, que las trae de la API de Laravel.
 *
 * @returns {JSX.Element}
 */
function MisMetas() {
  const { metas, cargando, error, reintentar, abonar, eliminar } = useMetas()
  const resumen = useResumenMetas(metas)
  const { moneda, convertir } = useMoneda()

  // El total ahorrado está en pesos: se pasa a la moneda elegida (si no hay tasas, se queda en pesos).
  const ahorradoVisible = convertir(resumen.ahorrado, 'COP') ?? resumen.ahorrado
  const monedaVisible = convertir(1, 'COP') === null ? 'COP' : moneda
  const formatoMoneda = useCallback((valor) => formatearMoneda(valor, monedaVisible), [monedaVisible])

  /** Registra el abono y celebra si con él la meta llegó al 100 %. */
  const alAbonar = async (id, monto) => {
    const { recienCumplida } = await abonar(id, monto)
    if (recienCumplida) lanzarConfeti()
  }

  if (error) {
    return (
      <EstadoMensaje
        Icono={WifiOff}
        titulo="No pudimos traer tus metas"
        texto="Revisa que el servidor esté encendido e inténtalo de nuevo."
        accion={
          <button type="button" onClick={reintentar} className={CLASES_BOTON}>
            <RefreshCw className="size-4" />
            Reintentar
          </button>
        }
      />
    )
  }

  const tarjetasResumen = [
    { titulo: 'Metas activas', valor: resumen.activas, Icono: Target, color: 'text-violeta dark:text-violet-300' },
    { titulo: 'Metas cumplidas', valor: resumen.cumplidas, Icono: Trophy, color: 'text-amarillo' },
    { titulo: 'Total ahorrado', valor: ahorradoVisible, formato: formatoMoneda, Icono: PiggyBank, color: 'text-menta' },
  ]

  return (
    <div className="space-y-10">
      <Aparecer>
        <h1 className="font-titulo text-3xl font-bold sm:text-4xl">
          Mis <span className="bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">metas</span>
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Cada abono te acerca a tu antojo. ¡Al llegar al 100 % lo celebramos!</p>
      </Aparecer>

      {cargando ? (
        <div className="grid animate-pulse gap-6 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : metas.length === 0 ? (
        <EstadoMensaje
          Icono={Sparkles}
          titulo="Todavía no tienes metas"
          texto="Elige un antojo del catálogo y conviértelo en tu primera meta de ahorro."
          accion={
            <Link to="/antojos" className={CLASES_BOTON}>
              <Sparkles className="size-4" />
              Ver antojos
            </Link>
          }
        />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            {tarjetasResumen.map(({ titulo, valor, formato, Icono, color }, i) => (
              <Aparecer key={titulo} orden={i}>
                <TarjetaInteractiva className="p-5" inclinacion={6}>
                  <Icono className={`size-6 ${color}`} />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{titulo}</p>
                  <ContadorAnimado valor={valor} formato={formato} className="font-titulo text-2xl font-bold" />
                </TarjetaInteractiva>
              </Aparecer>
            ))}
          </section>

          <Aparecer>
            <GraficoAhorro metas={metas} />
          </Aparecer>

          <motion.section layout className="grid gap-6 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {metas.map((meta, i) => (
                <motion.div
                  key={meta.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.05 }}
                >
                  <TarjetaMeta
                    meta={meta}
                    onAbonar={(monto) => alAbonar(meta.id, monto)}
                    onEliminar={() => eliminar(meta.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        </>
      )}
    </div>
  )
}

export default MisMetas
