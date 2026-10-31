import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { usePuedeAnimarMouse } from '../../hooks/usePuedeAnimarMouse'
import { RESORTE_RAPIDO } from '../../utils/animaciones'

/**
 * Tarjeta que reacciona al mouse con dos efectos combinados:
 * - **Inclinación 3D:** se inclina hacia donde está el cursor, como si fuera un objeto físico.
 * - **Foco de luz:** un brillo sigue al cursor por dentro de la tarjeta, como un reflector.
 *
 * En celular o con "reducir movimiento" activo se comporta como una tarjeta normal.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Contenido de la tarjeta.
 * @param {string} [props.className=''] - Clases extra de Tailwind.
 * @param {number} [props.inclinacion=10] - Grados máximos de inclinación.
 * @returns {JSX.Element}
 *
 * @example
 * <TarjetaInteractiva className="p-6">
 *   <h3>Audífonos</h3>
 * </TarjetaInteractiva>
 */
function TarjetaInteractiva({ children, className = '', inclinacion = 10 }) {
  const puedeAnimar = usePuedeAnimarMouse()

  // Posición del cursor dentro de la tarjeta: de 0 (izquierda/arriba) a 1 (derecha/abajo).
  const posX = useMotionValue(0.5)
  const posY = useMotionValue(0.5)
  // Opacidad del foco: 0 cuando el mouse está afuera, 1 cuando está encima.
  const brillo = useSpring(0, RESORTE_RAPIDO)

  const rotateX = useSpring(useTransform(posY, [0, 1], [inclinacion, -inclinacion]), RESORTE_RAPIDO)
  const rotateY = useSpring(useTransform(posX, [0, 1], [-inclinacion, inclinacion]), RESORTE_RAPIDO)

  // El foco se dibuja con un degradado circular centrado donde está el cursor.
  const focoX = useTransform(posX, (v) => `${v * 100}%`)
  const focoY = useTransform(posY, (v) => `${v * 100}%`)
  const fondoFoco = useMotionTemplate`radial-gradient(22rem circle at ${focoX} ${focoY}, var(--foco-color), transparent 70%)`

  /** Calcula dónde está el cursor dentro de la tarjeta. */
  const alMover = (evento) => {
    const caja = evento.currentTarget.getBoundingClientRect()
    posX.set((evento.clientX - caja.left) / caja.width)
    posY.set((evento.clientY - caja.top) / caja.height)
  }

  /** Al salir el mouse, la tarjeta vuelve a quedar derecha y el foco se apaga. */
  const alSalir = () => {
    posX.set(0.5)
    posY.set(0.5)
    brillo.set(0)
  }

  const clases = `relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 shadow-lg shadow-violeta/5 backdrop-blur dark:border-slate-700/60 dark:bg-slate-900/70 dark:shadow-violeta/10 ${className}`

  if (!puedeAnimar) {
    return <div className={clases}>{children}</div>
  }

  return (
    <motion.div
      onPointerMove={alMover}
      onPointerEnter={() => brillo.set(1)}
      onPointerLeave={alSalir}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      whileHover={{ scale: 1.02 }}
      transition={RESORTE_RAPIDO}
      className={`[--foco-color:color-mix(in_oklab,var(--color-violeta)_18%,transparent)] dark:[--foco-color:color-mix(in_oklab,var(--color-violeta)_40%,transparent)] ${clases}`}
    >
      <motion.div
        aria-hidden="true"
        style={{ background: fondoFoco, opacity: brillo }}
        className="pointer-events-none absolute inset-0"
      />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

export default TarjetaInteractiva
