/**
 * Cálculos de dinero de Alcanza.
 * Son funciones puras: mismo dato de entrada, mismo resultado, sin efectos secundarios.
 *
 * @module utils/calculos
 */

/**
 * Calcula el precio después de aplicar un descuento.
 *
 * @param {number} precio - Precio original.
 * @param {number} descuento - Porcentaje de descuento (15 = 15 %).
 * @returns {number} Precio final, redondeado a dos decimales.
 *
 * @example
 * precioConDescuento(100, 15) // 85
 */
export function precioConDescuento(precio, descuento) {
  return Math.round(precio * (1 - descuento / 100) * 100) / 100
}

/**
 * Convierte un valor de una moneda a otra usando las tasas con base en dólares.
 * Primero lo pasa a dólares y luego a la moneda destino.
 *
 * @param {number} valor - Cantidad a convertir.
 * @param {'COP' | 'USD' | 'EUR'} desde - Moneda en la que está el valor.
 * @param {'COP' | 'USD' | 'EUR'} hacia - Moneda a la que se quiere convertir.
 * @param {import('../services/monedaService').Tasas} tasas - Tasas del día.
 * @returns {number} El valor en la moneda destino.
 *
 * @example
 * convertirMoneda(10, 'USD', 'COP', { USD: 1, COP: 4000, EUR: 0.9 }) // 40000
 */
export function convertirMoneda(valor, desde, hacia, tasas) {
  if (desde === hacia) return valor
  return (valor / tasas[desde]) * tasas[hacia]
}

/**
 * Calcula cuántos meses de ahorro hacen falta para reunir un precio.
 * Siempre es al menos 1: aunque alcance de una vez, hay que esperar a ahorrar ese mes.
 * Ambos valores deben estar en la misma moneda.
 *
 * @param {number} precio - Lo que cuesta el antojo.
 * @param {number} ahorroMensual - Lo que el usuario ahorra cada mes.
 * @returns {number} Meses enteros necesarios.
 *
 * @example
 * mesesParaAlcanzar(1000000, 350000) // 3
 */
export function mesesParaAlcanzar(precio, ahorroMensual) {
  if (ahorroMensual <= 0) return Infinity
  return Math.max(1, Math.ceil(precio / ahorroMensual))
}

/**
 * Suma meses a una fecha para saber en qué mes se alcanza el antojo.
 *
 * @param {number} meses - Meses de ahorro necesarios.
 * @param {Date} [desde=new Date()] - Fecha de inicio (por defecto, hoy).
 * @returns {Date} Fecha estimada.
 */
export function fechaEstimada(meses, desde = new Date()) {
  const fecha = new Date(desde)
  // Se fija el día 1 para evitar saltos raros (por ejemplo, 31 de enero + 1 mes).
  fecha.setDate(1)
  fecha.setMonth(fecha.getMonth() + meses)
  return fecha
}
