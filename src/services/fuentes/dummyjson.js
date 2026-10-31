import axios from 'axios'

/**
 * Fuente de productos: DummyJSON (https://dummyjson.com).
 * API gratuita de productos de prueba, sin registro ni clave. Los precios vienen en dólares.
 *
 * Este archivo es un "adaptador": es el ÚNICO lugar de la app que conoce cómo responde DummyJSON.
 * Convierte sus productos al formato `Antojo` de Alcanza. Para cambiar de fuente
 * (por ejemplo, a Mercado Libre) se crea otro archivo con estas mismas dos funciones.
 *
 * @module services/fuentes/dummyjson
 */

/** Cliente de Axios con la dirección base de la API. */
const api = axios.create({ baseURL: 'https://dummyjson.com', timeout: 10000 })

/**
 * Traducción de las categorías de DummyJSON a las categorías de Alcanza.
 * Las que no aparecen aquí (por ejemplo, `groceries`) no se muestran en el catálogo.
 *
 * @type {Record<string, string>}
 */
const CATEGORIA_ALCANZA = {
  laptops: 'tecnologia',
  smartphones: 'tecnologia',
  tablets: 'tecnologia',
  'mobile-accessories': 'tecnologia',
  'mens-shirts': 'moda',
  'mens-shoes': 'moda',
  'mens-watches': 'moda',
  sunglasses: 'moda',
  tops: 'moda',
  'womens-bags': 'moda',
  'womens-dresses': 'moda',
  'womens-jewellery': 'moda',
  'womens-shoes': 'moda',
  'womens-watches': 'moda',
  furniture: 'hogar',
  'home-decoration': 'hogar',
  'kitchen-accessories': 'hogar',
  beauty: 'belleza',
  fragrances: 'belleza',
  'skin-care': 'belleza',
  'sports-accessories': 'deporte',
  motorcycle: 'deporte',
  vehicle: 'deporte',
}

/** Campos que se piden en el listado, para no descargar datos que no se usan. */
const CAMPOS_LISTADO = 'title,description,category,price,discountPercentage,rating,brand,thumbnail'

/**
 * Convierte un producto de DummyJSON al formato `Antojo` de la app.
 *
 * @param {Object} producto - Producto tal como lo devuelve DummyJSON.
 * @returns {import('../ofertasService').Antojo | null} El antojo, o `null` si su categoría no se usa.
 */
function adaptarProducto(producto) {
  const categoria = CATEGORIA_ALCANZA[producto.category]
  if (!categoria) return null

  return {
    id: String(producto.id),
    nombre: producto.title,
    descripcion: producto.description,
    marca: producto.brand ?? 'Sin marca',
    categoria,
    precio: producto.price,
    descuento: Math.round(producto.discountPercentage),
    imagen: producto.thumbnail,
    imagenes: producto.images ?? [producto.thumbnail],
    calificacion: producto.rating,
  }
}

/**
 * Trae todos los productos de las categorías que usa Alcanza.
 * `limit=0` le pide a DummyJSON la lista completa (son menos de 200).
 *
 * @returns {Promise<import('../ofertasService').Antojo[]>}
 */
export async function listarProductos() {
  const { data } = await api.get('/products', { params: { limit: 0, select: CAMPOS_LISTADO } })
  return data.products.map(adaptarProducto).filter(Boolean)
}

/**
 * Trae un producto con todos sus datos (incluidas todas sus fotos).
 *
 * @param {string} id - Id del producto en DummyJSON.
 * @returns {Promise<import('../ofertasService').Antojo | null>} `null` si no existe o su categoría no se usa.
 */
export async function obtenerProducto(id) {
  try {
    const { data } = await api.get(`/products/${id}`)
    return adaptarProducto(data)
  } catch (error) {
    // Un 404 significa "no existe": no es un fallo de conexión.
    if (error.response?.status === 404) return null
    throw error
  }
}
