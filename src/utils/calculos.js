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

/**
 * Calcula el escenario del simulador "¿y si...?": cuánto cuesta el antojo en pesos
 * y en cuántos meses se alcanza con un ahorro mensual y un ingreso extra dados.
 *
 * @param {Object} escenario
 * @param {number} escenario.precioUSD - Precio del antojo en dólares, antes del descuento.
 * @param {number} escenario.descuento - Porcentaje de descuento del producto.
 * @param {boolean} escenario.aplicarDescuento - Si se compra con el descuento o a precio completo.
 * @param {number} escenario.ahorroMensual - Ahorro mensual en pesos.
 * @param {number} [escenario.ingresoExtra=0] - Dinero extra que se suma cada mes, en pesos.
 * @param {import('../services/monedaService').Tasas} escenario.tasas - Tasas del día.
 * @returns {{ precioCOP: number, aporteMensual: number, meses: number, fecha: Date | null }}
 *   `meses` es `Infinity` y `fecha` es `null` si no se aporta nada al mes.
 *
 * @example
 * simularAlcance({ precioUSD: 100, descuento: 10, aplicarDescuento: true,
 *   ahorroMensual: 100000, ingresoExtra: 50000, tasas: { USD: 1, COP: 4000, EUR: 0.9 } })
 * // { precioCOP: 360000, aporteMensual: 150000, meses: 3, fecha: … }
 */
export function simularAlcance({ precioUSD, descuento, aplicarDescuento, ahorroMensual, ingresoExtra = 0, tasas }) {
  const precioFinal = aplicarDescuento ? precioConDescuento(precioUSD, descuento) : precioUSD
  const precioCOP = convertirMoneda(precioFinal, 'USD', 'COP', tasas)
  const aporteMensual = ahorroMensual + ingresoExtra
  const meses = mesesParaAlcanzar(precioCOP, aporteMensual)
  return { precioCOP, aporteMensual, meses, fecha: Number.isFinite(meses) ? fechaEstimada(meses) : null }
}

/**
 * Agrupa abonos por mes y devuelve el total ahorrado acumulado al final de cada mes,
 * desde el mes del primer abono hasta el mes actual. Sirve para el gráfico de ahorro.
 *
 * @param {{ monto: number, fecha: string }[]} abonos - Abonos con fecha `AAAA-MM-DD`.
 * @param {Date} [hasta=new Date()] - Último mes que se muestra.
 * @returns {{ mes: string, ahorradoMes: number, acumulado: number }[]} `mes` en formato `AAAA-MM`.
 *
 * @example
 * ahorroPorMes([{ monto: 100, fecha: '2026-10-05' }, { monto: 50, fecha: '2026-11-02' }], new Date(2026, 10, 7))
 * // [{ mes: '2026-10', ahorradoMes: 100, acumulado: 100 }, { mes: '2026-11', ahorradoMes: 50, acumulado: 150 }]
 */
export function ahorroPorMes(abonos, hasta = new Date()) {
  if (abonos.length === 0) return []

  const porMes = {}
  abonos.forEach(({ monto, fecha }) => {
    const mes = fecha.slice(0, 7)
    porMes[mes] = (porMes[mes] ?? 0) + monto
  })

  // Recorre todos los meses entre el primer abono y "hasta", aunque en alguno no haya abonos.
  const primero = Object.keys(porMes).sort()[0]
  const [anio, mes] = primero.split('-').map(Number)
  const cursor = new Date(anio, mes - 1, 1)
  const fin = new Date(hasta.getFullYear(), hasta.getMonth(), 1)
  const resultado = []
  let acumulado = 0

  while (cursor <= fin) {
    const clave = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}`
    const ahorradoMes = porMes[clave] ?? 0
    acumulado += ahorradoMes
    resultado.push({ mes: clave, ahorradoMes, acumulado })
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return resultado
}
