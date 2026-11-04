/**
 * Funciones para mostrar números y fechas de forma amigable.
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
 * formatearMoneda(19.99, 'EUR') // "€ 19,99"
 */
export function formatearMoneda(valor, moneda = 'COP') {
  const decimales = moneda === 'COP' ? 0 : 2
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    // En español de Colombia el euro sale como "EUR"; así se muestra "€". El dólar se deja
    // como "US$" para no confundirlo con el peso, que usa "$".
    currencyDisplay: moneda === 'EUR' ? 'narrowSymbol' : 'symbol',
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valor)
}

/**
 * Muestra el mes y el año de una fecha, por ejemplo "marzo de 2027".
 *
 * @param {Date} fecha
 * @returns {string}
 */
export function formatearMes(fecha) {
  return new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(fecha)
}

/**
 * Convierte una fecha al formato `AAAA-MM-DD` que espera la API, usando la fecha local
 * (no `toISOString`, que pasa a hora UTC y en Colombia puede devolver el día anterior).
 *
 * @param {Date} fecha
 * @returns {string} Por ejemplo "2027-03-01".
 */
export function aFechaApi(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

/**
 * Muestra una fecha `AAAA-MM-DD` de la API como mes y año, por ejemplo "marzo de 2027".
 *
 * @param {string} texto - Fecha en formato `AAAA-MM-DD`.
 * @returns {string}
 */
export function formatearMesApi(texto) {
  const [anio, mes, dia] = texto.split('-').map(Number)
  return formatearMes(new Date(anio, mes - 1, dia))
}
