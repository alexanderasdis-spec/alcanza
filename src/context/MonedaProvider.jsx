import { useCallback, useMemo } from 'react'
import { MonedaContext } from './monedaContext'
import { useFetch } from '../hooks/useFetch'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { MONEDAS, obtenerTasas } from '../services/monedaService'
import { convertirMoneda } from '../utils/calculos'
import { formatearMoneda } from '../utils/formato'

/**
 * Lo que comparte el contexto de moneda.
 *
 * @typedef {Object} ValorMoneda
 * @property {'COP' | 'USD' | 'EUR'} moneda - Moneda elegida por el usuario.
 * @property {(moneda: 'COP' | 'USD' | 'EUR') => void} cambiarMoneda - Cambia la moneda elegida.
 * @property {string[]} monedas - Monedas disponibles.
 * @property {import('../services/monedaService').Tasas | null} tasas - Tasas del día (`null` mientras cargan o si fallaron).
 * @property {(valor: number, desde?: string) => number | null} convertir - Pasa un valor a la moneda elegida.
 *   Devuelve `null` si todavía no hay tasas y hace falta convertir.
 * @property {(valor: number, desde?: string) => string} formatear - Convierte y formatea un valor.
 *   Si no hay tasas, lo muestra en su moneda original.
 */

/**
 * Proveedor de la moneda. Guarda la moneda elegida como preferencia en localStorage
 * y consulta las tasas de cambio una vez al abrir la app.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @returns {JSX.Element}
 */
export function MonedaProvider({ children }) {
  const [moneda, cambiarMoneda] = useLocalStorage('alcanza-moneda', 'COP')
  const { datos: tasas } = useFetch(obtenerTasas)

  // useCallback mantiene la misma función mientras no cambien la moneda ni las tasas.
  // Así los contadores animados que la reciben no reinician su conteo en cada render.
  const convertir = useCallback(
    (valor, desde = 'USD') => {
      if (desde === moneda) return valor
      return tasas ? convertirMoneda(valor, desde, moneda, tasas) : null
    },
    [moneda, tasas],
  )

  const formatear = useCallback(
    (valor, desde = 'USD') => {
      const convertido = convertir(valor, desde)
      return convertido === null ? formatearMoneda(valor, desde) : formatearMoneda(convertido, moneda)
    },
    [convertir, moneda],
  )

  const valor = useMemo(
    () => ({ moneda, cambiarMoneda, monedas: MONEDAS, tasas, convertir, formatear }),
    [moneda, cambiarMoneda, tasas, convertir, formatear],
  )

  return <MonedaContext.Provider value={valor}>{children}</MonedaContext.Provider>
}
