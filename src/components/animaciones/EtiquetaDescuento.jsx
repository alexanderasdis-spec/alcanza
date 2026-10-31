import { motion } from 'framer-motion'

/** Colores disponibles para la etiqueta, según la paleta. */
const COLORES = {
  rosa: 'bg-rosa text-white shadow-rosa/40',
  amarillo: 'bg-amarillo text-slate-900 shadow-amarillo/40',
}

/**
 * Etiqueta de descuento con forma de "manilla de festival": inclinada, con un borde
 * punteado por dentro y un agujero a la izquierda, como las pulseras de entrada.
 * Al pasar el mouse se balancea como si estuviera colgando.
 *
 * @param {Object} props
 * @param {number} props.porcentaje - Porcentaje de descuento, por ejemplo 15.
 * @param {'rosa' | 'amarillo'} [props.color='rosa'] - Color de la manilla.
 * @param {string} [props.className=''] - Clases extra de Tailwind (por ejemplo, para posicionarla).
 * @returns {JSX.Element}
 *
 * @example
 * <EtiquetaDescuento porcentaje={20} color="amarillo" />
 */
function EtiquetaDescuento({ porcentaje, color = 'rosa', className = '' }) {
  return (
    <motion.span
      initial={{ rotate: -8 }}
      whileHover={{ rotate: [-8, 10, -6, 4, -8], transition: { duration: 0.7 } }}
      className={`inline-flex origin-left items-center gap-1.5 rounded-md py-1 pr-3 pl-2 font-titulo text-sm font-bold shadow-lg ${COLORES[color]} ${className}`}
    >
      {/* Agujero de la manilla */}
      <span aria-hidden="true" className="size-2 rounded-full bg-white/70 dark:bg-slate-900/70" />
      <span className="rounded-sm border border-dashed border-current/40 px-1.5">-{porcentaje}%</span>
    </motion.span>
  )
}

export default EtiquetaDescuento
