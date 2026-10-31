/**
 * Reglas de validación de los formularios.
 * Son funciones puras: reciben datos y devuelven los errores, sin tocar el estado de React.
 *
 * @module utils/validaciones
 */

/** Ahorro mensual máximo aceptado (en COP), para atrapar errores de tecleo. */
export const AHORRO_MAXIMO = 100_000_000

/**
 * Valida los datos del perfil rápido.
 *
 * @param {{ nombre: string, ahorroMensual: string }} datos - Valores tal como vienen del formulario.
 * @returns {{ nombre?: string, ahorroMensual?: string }} Un mensaje por cada campo con error.
 *   Si el objeto está vacío, los datos son válidos.
 *
 * @example
 * validarPerfil({ nombre: '', ahorroMensual: '0' })
 * // { nombre: 'Escribe tu nombre.', ahorroMensual: 'El ahorro debe ser mayor que cero.' }
 */
export function validarPerfil({ nombre, ahorroMensual }) {
  const errores = {}
  const nombreLimpio = nombre.trim()
  const ahorro = Number(ahorroMensual)

  if (!nombreLimpio) {
    errores.nombre = 'Escribe tu nombre.'
  } else if (nombreLimpio.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 letras.'
  } else if (nombreLimpio.length > 40) {
    errores.nombre = 'El nombre no puede pasar de 40 caracteres.'
  }

  if (ahorroMensual === '') {
    errores.ahorroMensual = 'Escribe cuánto ahorras al mes.'
  } else if (!Number.isFinite(ahorro) || ahorro <= 0) {
    errores.ahorroMensual = 'El ahorro debe ser mayor que cero.'
  } else if (ahorro > AHORRO_MAXIMO) {
    errores.ahorroMensual = 'Ese monto parece demasiado alto, revísalo.'
  }

  return errores
}
