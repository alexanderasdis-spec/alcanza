import { useMoneda } from './useMoneda'
import { usePerfil } from './usePerfil'
import { convertirMoneda, fechaEstimada, mesesParaAlcanzar } from '../utils/calculos'

/**
 * Hook personalizado que responde la pregunta de Alcanza: "¿cuándo me lo compro?".
 *
 * Toma el precio de un antojo (en dólares, como viene de la API), lo pasa a pesos
 * —la moneda en que el usuario registró su ahorro— y calcula cuántos meses de ahorro necesita.
 *
 * @param {number} precioUSD - Precio final del antojo en dólares (ya con descuento).
 * @returns {{ meses: number, fecha: Date } | null} `null` si todavía no hay tasas de cambio o perfil.
 *
 * @example
 * const alcance = useAlcance(precioFinal)
 * if (alcance) console.log(`Lo alcanzas en ${alcance.meses} meses`)
 */
export function useAlcance(precioUSD) {
  const { perfil } = usePerfil()
  const { tasas } = useMoneda()

  if (!perfil || !tasas) return null

  const precioCOP = convertirMoneda(precioUSD, 'USD', 'COP', tasas)
  const meses = mesesParaAlcanzar(precioCOP, perfil.ahorroMensual)
  return { meses, fecha: fechaEstimada(meses) }
}
