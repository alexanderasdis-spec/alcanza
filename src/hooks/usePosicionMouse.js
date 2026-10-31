import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'

/**
 * Hook que sigue la posición del mouse en toda la ventana.
 *
 * Devuelve la posición "normalizada": `x` e `y` van de -1 a 1, donde 0 es el centro
 * de la pantalla. Así el mismo valor sirve sin importar el tamaño de la ventana.
 *
 * Usa `MotionValue` en lugar de `useState` a propósito: el mouse se mueve decenas
 * de veces por segundo y un estado haría que React volviera a pintar el componente
 * cada vez. Un `MotionValue` actualiza la animación directamente, sin re-renderizar.
 *
 * @param {boolean} [activo=true] - Si es `false`, no escucha el mouse (por ejemplo, en celular).
 * @returns {{ x: import('framer-motion').MotionValue<number>, y: import('framer-motion').MotionValue<number> }}
 *
 * @example
 * const { x, y } = usePosicionMouse()
 * const desplazamiento = useTransform(x, [-1, 1], [-40, 40])
 */
export function usePosicionMouse(activo = true) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    if (!activo) return

    const alMover = (evento) => {
      x.set((evento.clientX / window.innerWidth) * 2 - 1)
      y.set((evento.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('pointermove', alMover)
    // Se quita el listener al desmontar para no dejar procesos sueltos.
    return () => window.removeEventListener('pointermove', alMover)
  }, [activo, x, y])

  return { x, y }
}
