import { useCallback, useState } from 'react'
import { Share2 } from 'lucide-react'
import ModalCompartir from './ModalCompartir'

/**
 * Botón "Compartir" que abre la ventana para descargar la tarjeta del antojo como imagen.
 * Recibe los mismos datos que `ModalCompartir` (menos `abierto` y `onCerrar`).
 *
 * @param {Object} props
 * @param {string} props.nombre
 * @param {string | null} [props.imagen]
 * @param {Date | null} props.fecha
 * @param {number} [props.progreso]
 * @param {boolean} [props.cumplida]
 * @param {'claro' | 'suave'} [props.estilo='claro'] - `claro` para fondos de color; `suave` para tarjetas blancas.
 * @returns {JSX.Element}
 */
function BotonCompartir({ estilo = 'claro', ...datos }) {
  const [abierto, setAbierto] = useState(false)
  // useCallback: la función de cerrar no cambia en cada render (el modal la usa en un efecto).
  const cerrar = useCallback(() => setAbierto(false), [])

  const clases =
    estilo === 'suave'
      ? 'text-slate-500 hover:bg-violeta/10 hover:text-violeta dark:text-slate-400'
      : 'border border-slate-200 bg-white/80 text-violeta hover:border-violeta/40 dark:border-slate-700 dark:bg-slate-900/60 dark:text-violet-300'

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition ${clases}`}
      >
        <Share2 className="size-4" />
        Compartir
      </button>
      <ModalCompartir abierto={abierto} onCerrar={cerrar} {...datos} />
    </>
  )
}

export default BotonCompartir
