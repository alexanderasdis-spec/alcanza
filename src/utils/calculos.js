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
