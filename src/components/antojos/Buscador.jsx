import { Search, X } from 'lucide-react'

/**
 * Campo de búsqueda controlado: el texto vive en el estado del componente padre.
 *
 * @param {Object} props
 * @param {string} props.valor - Texto actual de la búsqueda.
 * @param {(texto: string) => void} props.onCambiar - Se llama con el nuevo texto en cada tecla.
 * @returns {JSX.Element}
 */
function Buscador({ valor, onCambiar }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder="Busca por nombre, marca o categoría…"
        aria-label="Buscar antojos"
        className="w-full rounded-full border border-slate-200 bg-white/80 py-3 pr-12 pl-12 outline-none backdrop-blur transition focus:border-violeta focus:ring-4 focus:ring-violeta/20 dark:border-slate-700 dark:bg-slate-900/70 [&::-webkit-search-cancel-button]:hidden"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onCambiar('')}
          aria-label="Borrar búsqueda"
          className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-violeta/10 hover:text-violeta"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

export default Buscador
