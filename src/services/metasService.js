import { api } from './api'

/**
 * Servicio de metas y abonos. Habla con la API de Laravel:
 * `/api/metas`, `/api/metas/{id}` y `/api/metas/{id}/abonos`.
 *
 * Traduce los nombres de la API ("snake_case") a los del frontend ("camelCase").
 *
 * @module services/metasService
 */

/**
 * Un abono a una meta.
 *
 * @typedef {Object} Abono
 * @property {number} id
 * @property {number} monto - En la misma moneda de la meta.
 * @property {string} fecha - Fecha en formato `AAAA-MM-DD`.
 */

/**
 * Una meta de ahorro tal como la usa el frontend.
 *
 * @typedef {Object} Meta
 * @property {number} id
 * @property {number} perfilId
 * @property {string} productoId - Id del antojo en el catálogo (para enlazar a `/antojos/:id`).
 * @property {string} nombreProducto
 * @property {string | null} imagen
 * @property {number} precio - Precio antes del descuento.
 * @property {'COP' | 'USD' | 'EUR'} moneda
 * @property {number} descuento - Porcentaje (0 a 100).
 * @property {string | null} fechaEstimada - `AAAA-MM-DD`.
 * @property {'en_progreso' | 'cumplida'} estado
 * @property {number} precioFinal - Calculado por la API: precio con descuento.
 * @property {number} ahorrado - Calculado por la API: suma de los abonos.
 * @property {number} progreso - Calculado por la API: avance de 0 a 100.
 * @property {Abono[]} [abonos] - Solo viene al consultar una meta o al registrar un abono.
 */

/**
 * Convierte una meta de la API al formato del frontend.
 *
 * @param {Object} datos - Meta tal como la responde Laravel.
 * @returns {Meta}
 */
function desdeApi(datos) {
  return {
    id: datos.id,
    perfilId: datos.perfil_id,
    productoId: datos.producto_id,
    nombreProducto: datos.nombre_producto,
    imagen: datos.imagen,
    precio: Number(datos.precio),
    moneda: datos.moneda,
    descuento: datos.descuento,
    fechaEstimada: datos.fecha_estimada,
    estado: datos.estado,
    precioFinal: Number(datos.precio_final),
    ahorrado: Number(datos.ahorrado),
    progreso: Number(datos.progreso),
    abonos: datos.abonos?.map((abono) => ({ id: abono.id, monto: Number(abono.monto), fecha: abono.fecha })),
  }
}

/**
 * Lista todas las metas, de la más reciente a la más antigua.
 *
 * @returns {Promise<Meta[]>}
 */
export async function listarMetas() {
  const { data } = await api.get('/metas')
  return data.map(desdeApi)
}

/**
 * Trae una meta con sus abonos.
 *
 * @param {number} id
 * @returns {Promise<Meta>}
 */
export async function obtenerMeta(id) {
  const { data } = await api.get(`/metas/${id}`)
  return desdeApi(data)
}

/**
 * Convierte un antojo en meta.
 *
 * @param {{ perfilId: number, productoId: string, nombreProducto: string, imagen?: string | null,
 *   precio: number, moneda: 'COP' | 'USD' | 'EUR', descuento?: number, fechaEstimada?: string | null }} meta
 * @returns {Promise<Meta>} La meta creada.
 */
export async function crearMeta(meta) {
  const { data } = await api.post('/metas', {
    perfil_id: meta.perfilId,
    producto_id: meta.productoId,
    nombre_producto: meta.nombreProducto,
    imagen: meta.imagen ?? null,
    precio: meta.precio,
    moneda: meta.moneda,
    descuento: meta.descuento ?? 0,
    fecha_estimada: meta.fechaEstimada ?? null,
  })
  return desdeApi(data)
}

/**
 * Elimina una meta y todos sus abonos.
 *
 * @param {number} id
 * @returns {Promise<void>}
 */
export async function eliminarMeta(id) {
  await api.delete(`/metas/${id}`)
}

/**
 * Registra un abono en una meta. Si con este abono la meta llega al 100 %,
 * la API la devuelve con `estado: 'cumplida'` (momento de lanzar el confeti).
 *
 * @param {number} metaId
 * @param {{ monto: number, fecha?: string }} abono
 * @returns {Promise<{ abono: Abono, meta: Meta }>}
 */
export async function registrarAbono(metaId, abono) {
  const { data } = await api.post(`/metas/${metaId}/abonos`, abono)
  return {
    abono: { id: data.abono.id, monto: Number(data.abono.monto), fecha: data.abono.fecha },
    meta: desdeApi(data.meta),
  }
}
