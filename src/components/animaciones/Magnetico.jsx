import { motion, useSpring } from 'framer-motion'
import { usePuedeAnimarMouse } from '../../hooks/usePuedeAnimarMouse'
import { RESORTE_RAPIDO } from '../../utils/animaciones'

/**
 * Envoltura "magnética": el elemento de adentro se deja atraer por el cursor
 * y vuelve a su sitio con un rebote cuando el mouse se aleja.
 *
 * Envuelve a otro elemento en lugar de ser un botón, para servir igual con
 * un `<button>`, un `<Link>` de React Router o cualquier otra cosa.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Elemento que se vuelve magnético.
 * @param {number} [props.fuerza=0.35] - Qué tanto sigue al cursor (0 = nada, 1 = lo sigue completo).
 * @param {string} [props.className=''] - Clases extra de Tailwind.
 * @returns {JSX.Element}
 *
 * @example
 * <Magnetico>
 *   <Link to="/antojos" className="...">Crear antojo</Link>
 * </Magnetico>
 */
function Magnetico({ children, fuerza = 0.35, className = '' }) {
  const puedeAnimar = usePuedeAnimarMouse()
  const x = useSpring(0, RESORTE_RAPIDO)
  const y = useSpring(0, RESORTE_RAPIDO)

  /** Mueve el elemento una fracción de la distancia entre el cursor y su centro. */
  const alMover = (evento) => {
    const caja = evento.currentTarget.getBoundingClientRect()
    x.set((evento.clientX - (caja.left + caja.width / 2)) * fuerza)
    y.set((evento.clientY - (caja.top + caja.height / 2)) * fuerza)
  }

  const alSalir = () => {
    x.set(0)
    y.set(0)
  }

  if (!puedeAnimar) {
    return <div className={`inline-block ${className}`}>{children}</div>
  }

  return (
    // El padding agranda la zona de atracción: el efecto empieza antes de tocar el botón.
    <motion.div
      onPointerMove={alMover}
      onPointerLeave={alSalir}
      style={{ x, y }}
      className={`-m-4 inline-block p-4 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Magnetico
