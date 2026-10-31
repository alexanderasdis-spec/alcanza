/**
 * Funciones para mostrar números de forma amigable.
 *
 * @module utils/formato
 */

/**
 * Formatea un valor como dinero según la moneda.
 * Los pesos colombianos se muestran sin decimales; dólares y euros con dos.
 *
 * @param {number} valor - Cantidad a mostrar.
 * @param {'COP' | 'USD' | 'EUR'} [moneda='COP'] - Código de la moneda.
 * @returns {string} El valor formateado, por ejemplo "$ 1.250.000".
 *
 * @example
 * formatearMoneda(1250000) // "$ 1.250.000"
 * formatearMoneda(19.99, 'USD') // "US$ 19,99"
 */
export function formatearMoneda(valor, moneda = 'COP') {
  const decimales = moneda === 'COP' ? 0 : 2
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}
