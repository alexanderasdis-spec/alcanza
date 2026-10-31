import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'
import { CURVA_SALIDA } from '../../utils/animaciones'

/**
 * Formato por defecto: el número redondeado.
 * Está fuera del componente para que no se cree una función nueva en cada render
 * (si cambiara, el efecto reiniciaría el conteo).
 *
 * @param {number} v
 * @returns {string}
 */
const redondear = (v) => Math.round(v).toString()

/**
 * Número que sube desde 0 hasta su valor cuando aparece en pantalla,
 * como el marcador de un tablero de festival.
 *
 * Escribe el número directo en el elemento (`textContent`) en lugar de usar estado,
 * para no re-renderizar el componente en cada cuadro de la animación.
 *
 * @param {Object} props
 * @param {number} props.valor - Número final.
 * @param {(valor: number) => string} [props.formato] - Función que convierte el número en texto
 *   (por ejemplo `formatearMoneda`). Por defecto lo redondea.
 * @param {number} [props.duracion=1.6] - Segundos que dura el conteo.
 * @param {string} [props.className=''] - Clases extra de Tailwind.
 * @returns {JSX.Element}
 *
 * @example
 * <ContadorAnimado valor={350000} formato={formatearMoneda} />
 */
function ContadorAnimado({ valor, formato = redondear, duracion = 1.6, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref, { once: true })
  const reducirMovimiento = useReducedMotion()

  useEffect(() => {
    if (!visible) return

    // Con "reducir movimiento" se muestra el valor final de una vez.
    if (reducirMovimiento) {
      ref.current.textContent = formato(valor)
      return
    }

    const controles = animate(0, valor, {
      duration: duracion,
      ease: CURVA_SALIDA,
      onUpdate: (actual) => {
        ref.current.textContent = formato(actual)
      },
    })
    return () => controles.stop()
  }, [visible, valor, formato, duracion, reducirMovimiento])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {formato(0)}
    </span>
  )
}

export default ContadorAnimado
