/**
 * Productos de ejemplo propios para la categoría Entretenimiento.
 * DummyJSON no tiene esta categoría, así que se completan aquí (tal como dice el documento de la idea).
 *
 * Ya vienen en el formato `Antojo` de la app. Sus ids empiezan por `ent-`
 * para no chocar con los ids numéricos de la API.
 * No tienen foto: las tarjetas muestran un ícono en su lugar.
 *
 * @type {import('../services/ofertasService').Antojo[]}
 */
export const PRODUCTOS_ENTRETENIMIENTO = [
  {
    id: 'ent-1',
    nombre: 'Consola de videojuegos portátil',
    descripcion: 'Consola para jugar en casa o de viaje, con pantalla de 7 pulgadas y batería para toda la tarde.',
    marca: 'Alcanza Play',
    categoria: 'entretenimiento',
    precio: 299.99,
    descuento: 12,
    imagen: null,
    imagenes: [],
    calificacion: 4.7,
  },
  {
    id: 'ent-2',
    nombre: 'Control inalámbrico',
    descripcion: 'Control con vibración y batería recargable, compatible con PC y consolas.',
    marca: 'Alcanza Play',
    categoria: 'entretenimiento',
    precio: 59.99,
    descuento: 15,
    imagen: null,
    imagenes: [],
    calificacion: 4.5,
  },
  {
    id: 'ent-3',
    nombre: 'Parlante bluetooth para fiestas',
    descripcion: 'Sonido potente con luces de colores y resistencia al agua para llevar a cualquier plan.',
    marca: 'Festival Sound',
    categoria: 'entretenimiento',
    precio: 79.99,
    descuento: 18,
    imagen: null,
    imagenes: [],
    calificacion: 4.4,
  },
  {
    id: 'ent-4',
    nombre: 'Proyector portátil de películas',
    descripcion: 'Proyecta hasta 100 pulgadas en cualquier pared; ideal para noches de cine en casa.',
    marca: 'CineCasa',
    categoria: 'entretenimiento',
    precio: 149.99,
    descuento: 22,
    imagen: null,
    imagenes: [],
    calificacion: 4.2,
  },
  {
    id: 'ent-5',
    nombre: 'Juego de mesa familiar',
    descripcion: 'Juego de estrategia para 2 a 6 jugadores, partidas de 30 minutos llenas de risas.',
    marca: 'Mesa Redonda',
    categoria: 'entretenimiento',
    precio: 39.99,
    descuento: 10,
    imagen: null,
    imagenes: [],
    calificacion: 4.8,
  },
]
