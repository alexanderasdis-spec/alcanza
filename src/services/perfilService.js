/**
 * Servicio del perfil del usuario (nombre y ahorro mensual).
 *
 * TEMPORAL: mientras no exista el backend de Laravel, el perfil se guarda en localStorage.
 * Las funciones ya son asíncronas (devuelven promesas) a propósito: cuando llegue la API,
 * solo se cambia el interior de este archivo por llamadas con Axios a `/api/perfil`
 * y el resto de la app no se entera del cambio.
 *
 * @module services/perfilService
 */

/** Clave con la que se guarda el perfil en localStorage. */
const CLAVE = 'alcanza-perfil'

/**
 * @typedef {Object} Perfil
 * @property {string} nombre - Nombre con el que la app saluda al usuario.
 * @property {number} ahorroMensual - Cuánto ahorra al mes, en pesos colombianos.
 */

/**
 * Consulta el perfil guardado.
 *
 * @returns {Promise<Perfil | null>} El perfil, o `null` si el usuario todavía no lo ha creado.
 */
export async function obtenerPerfil() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

/**
 * Guarda (crea o reemplaza) el perfil.
 *
 * @param {Perfil} perfil - Datos ya validados.
 * @returns {Promise<Perfil>} El perfil tal como quedó guardado.
 */
export async function guardarPerfil(perfil) {
  localStorage.setItem(CLAVE, JSON.stringify(perfil))
  return perfil
}
