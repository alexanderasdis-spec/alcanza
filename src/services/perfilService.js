import axios from 'axios'
import { api } from './api'

/**
 * Servicio del perfil del usuario (nombre y ahorro mensual).
 *
 * Habla con la API de Laravel: `GET /api/perfil` y `POST /api/perfil`.
 * La API usa nombres en "snake_case" (`ahorro_mensual`) y el frontend en "camelCase"
 * (`ahorroMensual`); este servicio hace la traducción en los dos sentidos,
 * así el resto de la app no se entera de cómo responde el backend.
 *
 * @module services/perfilService
 */

/**
 * @typedef {Object} Perfil
 * @property {number} [id] - Id del perfil en la base de datos.
 * @property {string} nombre - Nombre con el que la app saluda al usuario.
 * @property {number} ahorroMensual - Cuánto ahorra al mes, en pesos colombianos.
 */

/**
 * Convierte el perfil que responde la API al formato del frontend.
 *
 * @param {{ id: number, nombre: string, ahorro_mensual: number }} datos
 * @returns {Perfil}
 */
function desdeApi(datos) {
  return { id: datos.id, nombre: datos.nombre, ahorroMensual: Number(datos.ahorro_mensual) }
}

/**
 * Consulta el perfil guardado.
 *
 * @returns {Promise<Perfil | null>} El perfil, o `null` si el usuario todavía no lo ha creado (404).
 * @throws {Error} Si el servidor no responde (por ejemplo, si el backend está apagado).
 */
export async function obtenerPerfil() {
  try {
    const { data } = await api.get('/perfil')
    return desdeApi(data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null
    throw error
  }
}

/**
 * Guarda (crea o reemplaza) el perfil.
 *
 * @param {Perfil} perfil - Datos ya validados en el formulario.
 * @returns {Promise<Perfil>} El perfil tal como quedó guardado en la base de datos.
 * @throws {Error} Si la API rechaza los datos (422) o no responde.
 */
export async function guardarPerfil(perfil) {
  const { data } = await api.post('/perfil', { nombre: perfil.nombre, ahorro_mensual: perfil.ahorroMensual })
  return desdeApi(data)
}
