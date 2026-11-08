/**
 * Reglas de validación de los formularios.
 * Son funciones puras: reciben datos y devuelven los errores, sin tocar el estado de React.
 * Coinciden con las reglas de los Form Requests de Laravel, para que el usuario vea
 * el error antes de enviar y la API nunca reciba datos que va a rechazar.
 *
 * @module utils/validaciones
 */

/** Ahorro mensual máximo aceptado (en COP), para atrapar errores de tecleo. */
export const AHORRO_MAXIMO = 100_000_000

/** Largo mínimo de una contraseña. */
export const LARGO_MINIMO_CONTRASENA = 8

/** Forma básica de un correo: algo@algo.algo */
const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Revisa un nombre de persona.
 *
 * @param {string} nombre
 * @returns {string | undefined} El mensaje de error, o `undefined` si está bien.
 */
function errorNombre(nombre) {
  const limpio = nombre.trim()
  if (!limpio) return 'Escribe tu nombre.'
  if (limpio.length < 2) return 'El nombre debe tener al menos 2 letras.'
  if (limpio.length > 40) return 'El nombre no puede pasar de 40 caracteres.'
  return undefined
}

/**
 * Revisa un correo.
 *
 * @param {string} email
 * @returns {string | undefined} El mensaje de error, o `undefined` si está bien.
 */
function errorCorreo(email) {
  if (!email.trim()) return 'Escribe tu correo.'
  if (!PATRON_CORREO.test(email.trim())) return 'Ese correo no es válido.'
  return undefined
}

/**
 * Revisa una contraseña nueva y su confirmación (registro y restablecer).
 * Reglas: al menos 8 caracteres, con letras y números, e igual a la confirmación.
 *
 * @param {string} password
 * @param {string} confirmacion
 * @returns {{ password?: string, confirmacion?: string }}
 */
function erroresContrasenaNueva(password, confirmacion) {
  const errores = {}
  if (!password) errores.password = 'Escribe una contraseña.'
  else if (password.length < LARGO_MINIMO_CONTRASENA) errores.password = 'La contraseña debe tener al menos 8 caracteres.'
  else if (!/[a-zA-Z]/.test(password)) errores.password = 'La contraseña debe tener al menos una letra.'
  else if (!/\d/.test(password)) errores.password = 'La contraseña debe tener al menos un número.'

  if (!confirmacion) errores.confirmacion = 'Repite la contraseña.'
  else if (password !== confirmacion) errores.confirmacion = 'Las contraseñas no coinciden.'
  return errores
}

/**
 * Quita las claves sin error, para que un objeto vacío signifique "todo bien".
 *
 * @param {Record<string, string | undefined>} errores
 * @returns {Record<string, string>}
 */
function soloConError(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, mensaje]) => mensaje))
}

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
  const ahorro = Number(ahorroMensual)
  let errorAhorro
  if (ahorroMensual === '') errorAhorro = 'Escribe cuánto ahorras al mes.'
  else if (!Number.isFinite(ahorro) || ahorro <= 0) errorAhorro = 'El ahorro debe ser mayor que cero.'
  else if (ahorro > AHORRO_MAXIMO) errorAhorro = 'Ese monto parece demasiado alto, revísalo.'

  return soloConError({ nombre: errorNombre(nombre), ahorroMensual: errorAhorro })
}

/**
 * Valida el formulario de registro.
 *
 * @param {{ nombre: string, email: string, password: string, confirmacion: string }} datos
 * @returns {{ nombre?: string, email?: string, password?: string, confirmacion?: string }}
 *
 * @example
 * validarRegistro({ nombre: 'Ana', email: 'ana@correo.com', password: 'clave1234', confirmacion: 'clave1234' })
 * // {}
 */
export function validarRegistro({ nombre, email, password, confirmacion }) {
  return soloConError({
    nombre: errorNombre(nombre),
    email: errorCorreo(email),
    ...erroresContrasenaNueva(password, confirmacion),
  })
}

/**
 * Valida el formulario de inicio de sesión (solo que no falte nada).
 *
 * @param {{ email: string, password: string }} datos
 * @returns {{ email?: string, password?: string }}
 */
export function validarIngreso({ email, password }) {
  return soloConError({
    email: errorCorreo(email),
    password: password ? undefined : 'Escribe tu contraseña.',
  })
}

/**
 * Valida el formulario de "Olvidé mi contraseña".
 *
 * @param {{ email: string }} datos
 * @returns {{ email?: string }}
 */
export function validarCorreo({ email }) {
  return soloConError({ email: errorCorreo(email) })
}

/**
 * Valida el formulario para poner una contraseña nueva.
 *
 * @param {{ password: string, confirmacion: string }} datos
 * @returns {{ password?: string, confirmacion?: string }}
 */
export function validarContrasenaNueva({ password, confirmacion }) {
  return soloConError(erroresContrasenaNueva(password, confirmacion))
}

/**
 * Valida el formulario de "Cambiar contraseña" de Mi perfil.
 * Además de las reglas de la contraseña nueva, pide la actual y que la nueva sea distinta.
 *
 * @param {{ actual: string, password: string, confirmacion: string }} datos
 * @returns {{ actual?: string, password?: string, confirmacion?: string }}
 *
 * @example
 * validarCambioContrasena({ actual: 'clave1234', password: 'clave1234', confirmacion: 'clave1234' })
 * // { password: 'La contraseña nueva debe ser distinta de la actual.' }
 */
export function validarCambioContrasena({ actual, password, confirmacion }) {
  const errores = erroresContrasenaNueva(password, confirmacion)
  if (!errores.password && password === actual) errores.password = 'La contraseña nueva debe ser distinta de la actual.'
  return soloConError({ actual: actual ? undefined : 'Escribe tu contraseña actual.', ...errores })
}
