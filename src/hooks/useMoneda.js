import { useContext } from 'react'
import { MonedaContext } from '../context/monedaContext'

/**
 * Hook personalizado para leer la moneda elegida, cambiarla y mostrar precios convertidos.
 *
 * @returns {import('../context/MonedaProvider').ValorMoneda}
 * @throws {Error} Si se usa fuera de `MonedaProvider`.
 *
 * @example
 * const { formatear } = useMoneda()
 * return <p>{formatear(19.99)}</p> // "$ 63.916" si la moneda elegida es COP
 */
export function useMoneda() {
  const contexto = useContext(MonedaContext)
  if (!contexto) {
    throw new Error('useMoneda debe usarse dentro de <MonedaProvider>')
  }
  return contexto
}
