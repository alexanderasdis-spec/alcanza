import { Bike, Gamepad2, Laptop, Shirt, Sofa, Sparkles } from 'lucide-react'

/**
 * Categorías de "antojos" de Alcanza, en el orden en que se muestran en el filtro.
 *
 * Son categorías propias de la app, no las de la API: así, si mañana se cambia DummyJSON
 * por otra fuente, el filtro sigue igual y solo cambia cómo se traducen las categorías
 * de la nueva fuente (ver `services/fuentes/dummyjson.js`).
 *
 * @type {{ id: string, nombre: string, Icono: import('lucide-react').LucideIcon }[]}
 */
export const CATEGORIAS = [
  { id: 'tecnologia', nombre: 'Tecnología', Icono: Laptop },
  { id: 'moda', nombre: 'Moda', Icono: Shirt },
  { id: 'hogar', nombre: 'Hogar', Icono: Sofa },
  { id: 'belleza', nombre: 'Belleza', Icono: Sparkles },
  { id: 'deporte', nombre: 'Deporte y movilidad', Icono: Bike },
  { id: 'entretenimiento', nombre: 'Entretenimiento', Icono: Gamepad2 },
]

/**
 * Busca una categoría por su id.
 *
 * @param {string} id - Id de la categoría, por ejemplo `'tecnologia'`.
 * @returns {{ id: string, nombre: string, Icono: import('lucide-react').LucideIcon } | undefined}
 */
export function buscarCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id)
}
