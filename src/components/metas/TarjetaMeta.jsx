import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarHeart, Trash2, Trophy } from 'lucide-react'
import BarraProgreso from '../animaciones/BarraProgreso'
import TarjetaInteractiva from '../animaciones/TarjetaInteractiva'
import FormularioAbono from './FormularioAbono'
import { useMoneda } from '../../hooks/useMoneda'
import { usePerfil } from '../../hooks/usePerfil'
import { fechaEstimada, mesesParaAlcanzar } from '../../utils/calculos'
import { formatearMes } from '../../utils/formato'
import { RESORTE_RAPIDO } from '../../utils/animaciones'

/**
 * Tarjeta de una meta en "Mis metas": foto, progreso, cuánto falta, cuándo se alcanza,
 * formulario de abono e insignia de "meta cumplida".
 *
 * Los montos de la meta están en pesos y se muestran en la moneda elegida con `formatear`.
 *
 * @param {Object} props
 * @param {import('../../services/metasService').Meta} props.meta - Meta a mostrar.
 * @param {(monto: number) => Promise<void>} props.onAbonar - Registra un abono en esta meta.
 * @param {() => Promise<void>} props.onEliminar - Elimina la meta.
 * @returns {JSX.Element}
 */
function TarjetaMeta({ meta, onAbonar, onEliminar }) {
  const { formatear } = useMoneda()
  const { perfil } = usePerfil()
  // Pide confirmación antes de eliminar (dos clics), sin ventanas emergentes del navegador.
  const [confirmando, setConfirmando] = useState(false)
  const [eliminando, setEliminando] = useState(false)

  const cumplida = meta.estado === 'cumplida'
  const faltante = Math.max(0, meta.precioFinal - meta.ahorrado)
  const meses = mesesParaAlcanzar(faltante, perfil.ahorroMensual)

  const alEliminar = async () => {
    setEliminando(true)
    try {
      await onEliminar()
    } catch {
      setEliminando(false)
      setConfirmando(false)
    }
  }

  return (
    <TarjetaInteractiva className="flex h-full flex-col p-5" inclinacion={4}>
      <div className="flex gap-4">
        <Link
          to={`/antojos/${meta.productoId}`}
          className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-violeta/10 to-rosa/10 dark:from-violeta/25 dark:to-rosa/20"
          aria-label={`Ver ${meta.nombreProducto} en el catálogo`}
        >
          {meta.imagen ? (
            <img src={meta.imagen} alt="" className="size-full object-contain p-2" />
          ) : (
            <Trophy className="size-8 text-violeta/60" />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-titulo font-semibold">{meta.nombreProducto}</h3>
          <p className="mt-1 font-titulo text-xl font-bold text-menta">{formatear(meta.precioFinal, 'COP')}</p>
          {meta.descuento > 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">Con {meta.descuento} % de descuento</p>
          )}
          {/* Insignia de meta cumplida: entra girando con un resorte */}
          <AnimatePresence>
            {cumplida && (
              <motion.span
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="mt-2 inline-block rounded-full bg-amarillo px-3 py-1 font-titulo text-xs font-bold text-slate-900 shadow-lg shadow-amarillo/40"
              >
                ¡Cumplida! 🎉
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {formatear(meta.ahorrado, 'COP')} de {formatear(meta.precioFinal, 'COP')}
          </span>
          <span className="font-semibold">{meta.progreso} %</span>
        </div>
        {/* La key reinicia la animación de la barra cuando cambia el progreso */}
        <BarraProgreso key={meta.progreso} porcentaje={meta.progreso} etiqueta={`Progreso de ${meta.nombreProducto}`} />
      </div>

      {cumplida ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-amarillo/15 px-4 py-3 text-sm font-medium text-slate-700 dark:text-amarillo">
          <Trophy className="size-5 shrink-0 text-amarillo" />
          ¡Lo lograste! Ya tienes todo para tu antojo.
        </p>
      ) : (
        <>
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <CalendarHeart className="size-4 shrink-0 text-rosa" />
            Te faltan {formatear(faltante, 'COP')}: lo alcanzas en {meses} {meses === 1 ? 'mes' : 'meses'} (
            {formatearMes(fechaEstimada(meses))})
          </p>
          <div className="mt-4">
            <FormularioAbono metaId={meta.id} onAbonar={onAbonar} />
          </div>
        </>
      )}

      <div className="mt-auto flex justify-end pt-4">
        <AnimatePresence mode="wait" initial={false}>
          {confirmando ? (
            <motion.div
              key="confirmar"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={RESORTE_RAPIDO}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-slate-500 dark:text-slate-400">¿Eliminar la meta y sus abonos?</span>
              <button
                type="button"
                onClick={alEliminar}
                disabled={eliminando}
                className="rounded-full bg-rosa px-3 py-1 font-semibold text-white disabled:opacity-60"
              >
                {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
              </button>
              <button type="button" onClick={() => setConfirmando(false)} className="rounded-full px-3 py-1 text-slate-500">
                No
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="eliminar"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmando(true)}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm text-slate-400 transition hover:bg-rosa/10 hover:text-rosa"
            >
              <Trash2 className="size-4" />
              Eliminar
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </TarjetaInteractiva>
  )
}

export default TarjetaMeta
