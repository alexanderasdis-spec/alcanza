import * as fuente from './fuentes/dummyjson'
import { PRODUCTOS_ENTRETENIMIENTO } from '../data/productosEntretenimiento'

/**
 * Servicio de ofertas: de aquí sacan los productos todas las páginas (catálogo, detalle,
 * comparador, ofertas destacadas). Ninguna página habla directamente con DummyJSON.
 *
 * Para cambiar la fuente de productos solo se cambia la línea `import * as fuente ...`
 * por otro adaptador que tenga las funciones `listarProductos` y `obtenerProducto`.
 *
 * @module services/ofertasService
 */

/**
 * Un producto en el formato propio de Alcanza (sin importar de qué API venga).
 *
 * @typedef {Object} Antojo
 * @property {string} id - Identificador único.
 * @property {string} nombre - Nombre del producto.
 * @property {string} descripcion - Descripción corta.
 * @property {string} marca - Marca del producto.
 * @property {string} categoria - Id de la categoría de Alcanza (ver `data/categorias.js`).
 * @property {number} precio - Precio en dólares, antes del descuento.
 * @property {number} descuento - Porcentaje de descuento, redondeado (ej. 15).
 * @property {string | null} imagen - Foto principal, o `null` si no tiene.
 * @property {string[]} imagenes - Todas las fotos del producto.
 * @property {number} calificacion - Calificación de 0 a 5.
 */

/** Prefijo de los ids de los productos propios de Entretenimiento. */
const PREFIJO_PROPIOS = 'ent-'

/**
 * Promesa guardada del catálogo. Así la API se consulta una sola vez por visita,
 * aunque el usuario entre y salga varias veces del catálogo.
 *
 * @type {Promise<Antojo[]> | null}
 */
let catalogoEnCache = null

/**
 * Trae todos los antojos: los de la API más los propios de Entretenimiento.
 *
 * @returns {Promise<Antojo[]>}
 */
export function obtenerAntojos() {
  if (!catalogoEnCache) {
    catalogoEnCache = fuente
      .listarProductos()
      .then((productos) => [...productos, ...PRODUCTOS_ENTRETENIMIENTO])
      .catch((error) => {
        // Si falla, se borra la caché para que "Reintentar" vuelva a consultar.
        catalogoEnCache = null
        throw error
      })
  }
  return catalogoEnCache
}

/**
 * Trae un antojo por su id.
 *
 * @param {string} id - Id del antojo (el que va en la URL `/antojos/:id`).
 * @returns {Promise<Antojo | null>} `null` si no existe.
 */
export async function obtenerAntojo(id) {
  if (id.startsWith(PREFIJO_PROPIOS)) {
    return PRODUCTOS_ENTRETENIMIENTO.find((producto) => producto.id === id) ?? null
  }
  return fuente.obtenerProducto(id)
}
