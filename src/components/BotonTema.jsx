import { Moon, Sun } from 'lucide-react'
import { useTema } from '../hooks/useTema'

/**
 * Botón para cambiar entre modo claro y oscuro.
 * Muestra una luna en modo claro y un sol en modo oscuro.
 *
 * @returns {JSX.Element}
 */
function BotonTema() {
  const { oscuro, alternarTema } = useTema()
  const etiqueta = oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      type="button"
      onClick={alternarTema}
      aria-label={etiqueta}
      title={etiqueta}
      className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-violeta/10 hover:text-violeta dark:text-slate-300 dark:hover:text-amarillo"
    >
      {oscuro ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}

export default BotonTema
