import { useId } from 'react'

/**
 * Logo de Alcanza: un signo de pesos cuya barra es una rama de olivo, porque el ahorro
 * crece y da libertad. El fruto de la rama es una moneda dorada.
 *
 * @param {Object} props
 * @param {boolean} [props.conTexto=true] - Si muestra la palabra "Alcanza" junto al símbolo.
 * @param {boolean} [props.claro=false] - Versión blanca, para fondos con color.
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
  const hojaOscura = claro ? '#6ee7b7' : '#10b981'
  const hojaClara = claro ? '#a7f3d0' : '#34d399'

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="size-10 shrink-0">
        <defs>
          <linearGradient id={degradado} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <path d="M31 62C33 47 31 30 33 13" fill="none" stroke={hojaOscura} strokeWidth="4.5" strokeLinecap="round" />
        <path d="M32 20C27 10 20 8 13 9c2 8 10 13 19 11z" fill={hojaOscura} />
        <path d="M33 16C37 8 44 4 52 5c-1 8-9 13-19 11z" fill={hojaClara} />
        <path d="M33 13c-3-5-3-9 0-13 4 4 4 9 0 13z" fill={hojaOscura} />
        <circle cx="50" cy="19" r="4.5" fill="#facc15" />
        <path
          d="M46 30C41 22 23 22 21 31 19 41 44 39 44 49 44 59 24 60 18 52"
          fill="none"
          stroke={claro ? '#fff' : `url(#${degradado})`}
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
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
