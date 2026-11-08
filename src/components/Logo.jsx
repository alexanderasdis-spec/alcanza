import { useId } from 'react'

/**
 * Logo de Alcanza: una "A" que es una cima por alcanzar, con la barra amarilla como
 * barra de progreso del ahorro y un destello en lo alto, que es la meta.
 *
 * @param {Object} props
 * @param {boolean} [props.conTexto=true] - Si muestra la palabra "Alcanza" junto al ícono.
 * @param {boolean} [props.claro=false] - Texto blanco, para fondos con color.
 * @param {boolean} [props.soloIconoEnCelular=false] - Oculta la palabra en pantallas angostas (menú superior).
 * @param {string} [props.className=''] - Clases extra de Tailwind.
 * @returns {JSX.Element}
 *
 * @example
 * <Logo />
 */
function Logo({ conTexto = true, claro = false, soloIconoEnCelular = false, className = '' }) {
  // Id único: si dos logos compartieran el degradado, ocultar uno podría borrar el color del otro.
  const degradado = useId()

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-9 shrink-0">
        <defs>
          <linearGradient id={degradado} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="18" fill={`url(#${degradado})`} />
        <path d="M21 39H43" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <path d="M15 49 32 19 49 49" fill="none" stroke="#fff" strokeWidth="7.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M49 8q1.5 7.5 9 9-7.5 1.500-9 9-1.500-7.500-9-9 7.500-1.500 9-9z" fill="#facc15" />
      </svg>
      {conTexto && (
        <span
          className={`font-titulo text-2xl font-bold ${soloIconoEnCelular ? 'hidden sm:inline' : ''} ${
            claro ? 'text-white' : 'bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent'
          }`}
        >
          Alcanza
        </span>
      )}
    </span>
  )
}

export default Logo
