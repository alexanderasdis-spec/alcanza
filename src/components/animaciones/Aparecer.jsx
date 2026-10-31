import { motion } from 'framer-motion'
import { PASO_CASCADA, TRANSICION_ENTRADA } from '../../utils/animaciones'

/**
 * Hace aparecer su contenido (sube y se desvanece hacia adentro) cuando entra en pantalla.
 * Solo se anima la primera vez que se ve, no cada vez que se hace scroll.
 *
 * Para una entrada en cascada se le pasa el `orden` de cada elemento de una lista:
 * cada uno espera un poquito más que el anterior.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Contenido a mostrar.
 * @param {number} [props.orden=0] - Posición en la cascada (0 = primero).
 * @param {string} [props.className=''] - Clases extra de Tailwind.
 * @returns {JSX.Element}
 *
 * @example
 * {productos.map((producto, i) => (
 *   <Aparecer key={producto.id} orden={i}>
 *     <TarjetaProducto {...producto} />
 *   </Aparecer>
 * ))}
 */
function Aparecer({ children, orden = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...TRANSICION_ENTRADA, delay: orden * PASO_CASCADA }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Aparecer
