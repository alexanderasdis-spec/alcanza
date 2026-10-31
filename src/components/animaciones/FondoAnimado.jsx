import { motion, useSpring, useTransform } from 'framer-motion'
import { usePosicionMouse } from '../../hooks/usePosicionMouse'
import { usePuedeAnimarMouse } from '../../hooks/usePuedeAnimarMouse'
import { RESORTE_RAPIDO, RESORTE_SUAVE } from '../../utils/animaciones'

/**
 * Luces de colores del fondo, inspiradas en la portada del documento de la idea.
 * `profundidad` dice cuántos píxeles se desplaza cada luz con el mouse: las que se mueven
 * más parecen estar más cerca y las que se mueven menos, más lejos (efecto parallax).
 *
 * @type {{ color: string, clases: string, profundidad: number, flotar: number }[]}
 */
const LUCES = [
  { color: 'var(--color-violeta)', clases: '-top-40 -right-32 size-[42rem]', profundidad: 60, flotar: 16 },
  { color: 'var(--color-rosa)', clases: 'top-1/3 -left-48 size-[36rem]', profundidad: -45, flotar: 20 },
  { color: 'var(--color-amarillo)', clases: 'bottom-0 right-1/4 size-[24rem]', profundidad: 90, flotar: 13 },
  { color: 'var(--color-menta)', clases: '-bottom-40 -left-20 size-[28rem]', profundidad: -25, flotar: 24 },
]

/**
 * Una luz difuminada del fondo.
 * La capa de afuera se desplaza con el mouse; la de adentro flota sola todo el tiempo,
 * así la luz se mueve aunque el usuario esté en celular o no toque el mouse.
 *
 * @param {Object} props
 * @param {string} props.color - Color CSS del centro de la luz.
 * @param {string} props.clases - Clases de Tailwind con posición y tamaño.
 * @param {number} props.profundidad - Píxeles que se desplaza con el mouse (negativo = dirección contraria).
 * @param {number} props.flotar - Segundos que tarda en completar su vuelta de flotación.
 * @param {import('framer-motion').MotionValue<number>} props.mouseX - Posición X del mouse, de -1 a 1.
 * @param {import('framer-motion').MotionValue<number>} props.mouseY - Posición Y del mouse, de -1 a 1.
 * @returns {JSX.Element}
 */
function Luz({ color, clases, profundidad, flotar, mouseX, mouseY }) {
  const x = useTransform(mouseX, [-1, 1], [-profundidad, profundidad])
  const y = useTransform(mouseY, [-1, 1], [-profundidad, profundidad])

  return (
    <motion.div style={{ x, y }} className={`absolute ${clases}`}>
      <motion.div
        className="size-full rounded-full opacity-25 dark:opacity-35"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 65%)` }}
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 25, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={{ duration: flotar, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/**
 * Halo de luz que sigue al cursor de cerca, como un reflector sobre el escenario.
 *
 * @param {Object} props
 * @param {import('framer-motion').MotionValue<number>} props.mouseX - Posición X del mouse, de -1 a 1.
 * @param {import('framer-motion').MotionValue<number>} props.mouseY - Posición Y del mouse, de -1 a 1.
 * @returns {JSX.Element}
 */
function HaloCursor({ mouseX, mouseY }) {
  // Pasa de -1..1 a una posición en la pantalla (vw/vh).
  const left = useTransform(useSpring(mouseX, RESORTE_RAPIDO), (v) => `${(v + 1) * 50}vw`)
  const top = useTransform(useSpring(mouseY, RESORTE_RAPIDO), (v) => `${(v + 1) * 50}vh`)

  return (
    <motion.div
      style={{ left, top, background: 'radial-gradient(circle, var(--color-violeta) 0%, transparent 60%)' }}
      className="absolute size-[30rem] -translate-1/2 rounded-full opacity-15 dark:opacity-25"
    />
  )
}

/**
 * Fondo animado de toda la aplicación.
 * Cuatro luces de la paleta flotan detrás del contenido y se desplazan con el mouse
 * a distintas profundidades, y un halo sigue al cursor.
 *
 * En celular o con "reducir movimiento" activo no sigue al mouse: solo quedan las luces flotando
 * (y `MotionConfig` también las detiene si el usuario pidió reducir movimiento).
 *
 * @returns {JSX.Element}
 */
function FondoAnimado() {
  const puedeAnimar = usePuedeAnimarMouse()
  const { x, y } = usePosicionMouse(puedeAnimar)

  // El resorte suave hace que las luces "persigan" al mouse con un retraso elegante.
  const mouseX = useSpring(x, RESORTE_SUAVE)
  const mouseY = useSpring(y, RESORTE_SUAVE)

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {LUCES.map((luz) => (
        <Luz key={luz.color} {...luz} mouseX={mouseX} mouseY={mouseY} />
      ))}
      {puedeAnimar && <HaloCursor mouseX={x} mouseY={y} />}
    </div>
  )
}

export default FondoAnimado
