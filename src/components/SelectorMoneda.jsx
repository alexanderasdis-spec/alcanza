import { motion } from 'framer-motion'
import { useMoneda } from '../hooks/useMoneda'
import { RESORTE_RAPIDO } from '../utils/animaciones'

/**
 * Selector de moneda (COP / USD / EUR) con forma de interruptor de varias opciones.
 * La "píldora" de la opción activa se desliza de una a otra con `layoutId`.
 *
 * Si las tasas no cargaron, el selector se ve atenuado y los precios siguen en su moneda original.
 *
 * @returns {JSX.Element}
 */
function SelectorMoneda() {
  const { moneda, cambiarMoneda, monedas, tasas } = useMoneda()
  const ayuda = tasas
    ? `Tasas del ${tasas.actualizado.toLocaleDateString('es-CO')}`
    : 'Cargando tasas de cambio…'

  return (
    <div
      role="radiogroup"
      aria-label="Moneda de los precios"
      title={ayuda}
      className={`flex rounded-full border border-slate-200 bg-white/70 p-0.5 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900/60 ${
        tasas ? '' : 'opacity-60'
      }`}
    >
      {monedas.map((codigo) => {
        const activa = codigo === moneda
        return (
          <button
            key={codigo}
            type="button"
            role="radio"
            aria-checked={activa}
            onClick={() => cambiarMoneda(codigo)}
            className={`relative rounded-full px-2.5 py-1.5 transition ${
              activa ? 'text-white' : 'text-slate-500 hover:text-violeta dark:text-slate-400 dark:hover:text-violet-300'
            }`}
          >
            {activa && (
              <motion.span
                layoutId="moneda-activa"
                transition={RESORTE_RAPIDO}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violeta to-rosa"
              />
            )}
            <span className="relative">{codigo}</span>
          </button>
        )
      })}
    </div>
  )
}

export default SelectorMoneda
