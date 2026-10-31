import { motion } from 'framer-motion'
import { LayoutGrid } from 'lucide-react'
import { CATEGORIAS } from '../../data/categorias'
import { RESORTE_RAPIDO } from '../../utils/animaciones'

/** Opción extra para ver todas las categorías a la vez. */
const TODAS = { id: 'todas', nombre: 'Todas', Icono: LayoutGrid }

/**
 * Fila de chips para filtrar el catálogo por categoría.
 * El fondo del chip activo "viaja" de un chip a otro gracias a `layoutId` de Framer Motion.
 *
 * @param {Object} props
 * @param {string} props.seleccionada - Id de la categoría activa (`'todas'` para ninguna en particular).
 * @param {(id: string) => void} props.onCambiar - Se llama con el id de la categoría elegida.
 * @param {Record<string, number>} [props.conteos={}] - Cuántos productos hay por categoría, para mostrarlo en cada chip.
 * @returns {JSX.Element}
 */
function FiltroCategorias({ seleccionada, onCambiar, conteos = {} }) {
  return (
    <div role="group" aria-label="Filtrar por categoría" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:flex-wrap">
      {[TODAS, ...CATEGORIAS].map(({ id, nombre, Icono }) => {
        const activa = id === seleccionada
        return (
          <button
            key={id}
            type="button"
            onClick={() => onCambiar(id)}
            aria-pressed={activa}
            className={`relative flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
              activa
                ? 'border-transparent text-white'
                : 'border-slate-200 bg-white/70 text-slate-600 hover:border-violeta/40 hover:text-violeta dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300'
            }`}
          >
            {activa && (
              <motion.span
                layoutId="chip-activo"
                transition={RESORTE_RAPIDO}
                className="absolute inset-0 rounded-full bg-gradient-to-r from-violeta to-rosa shadow-lg shadow-violeta/30"
              />
            )}
            <Icono className="relative size-4" />
            <span className="relative">{nombre}</span>
            {conteos[id] !== undefined && (
              <span className={`relative text-xs ${activa ? 'text-white/80' : 'text-slate-400'}`}>{conteos[id]}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default FiltroCategorias
