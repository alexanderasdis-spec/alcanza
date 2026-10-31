import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Consulta de medios que solo se cumple con un mouse o trackpad (no con pantallas táctiles). */
const CONSULTA_MOUSE = '(hover: hover) and (pointer: fine)'

/**
 * Hook que indica si se deben activar los efectos que siguen al mouse.
 *
 * Devuelve `false` en dos casos:
 * - En celulares y tablets, porque no hay mouse que seguir.
 * - Si el usuario activó "reducir movimiento" en su sistema (accesibilidad).
 *
 * @returns {boolean} `true` si hay mouse y el usuario acepta animaciones.
 *
 * @example
 * const puedeAnimar = usePuedeAnimarMouse()
 * if (!puedeAnimar) return <div>{children}</div>
 */
export function usePuedeAnimarMouse() {
  const reducirMovimiento = useReducedMotion()
  const [tieneMouse, setTieneMouse] = useState(() => window.matchMedia(CONSULTA_MOUSE).matches)

  // Escucha cambios, por ejemplo al conectar un mouse a una tablet.
  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA_MOUSE)
    const alCambiar = (evento) => setTieneMouse(evento.matches)
    consulta.addEventListener('change', alCambiar)
    return () => consulta.removeEventListener('change', alCambiar)
  }, [])

  return tieneMouse && !reducirMovimiento
}
