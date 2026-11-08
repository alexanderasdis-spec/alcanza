/**
 * Redes sociales que se muestran en el pie de página.
 * Para poner un perfil propio, basta con cambiar la `url` de cada red.
 *
 * @module data/redesSociales
 */

/**
 * @typedef {Object} RedSocial
 * @property {'instagram' | 'facebook' | 'linkedin' | 'github'} id - Identifica el ícono en `IconoRed`.
 * @property {string} nombre - Nombre que leen los lectores de pantalla.
 * @property {string} url - Dirección a la que lleva el ícono.
 * @property {string} color - Clases de Tailwind para el color al pasar el mouse.
 */

/** @type {RedSocial[]} */
export const REDES_SOCIALES = [
  { id: 'instagram', nombre: 'Instagram', url: 'https://www.instagram.com', color: 'hover:border-rosa hover:bg-rosa hover:shadow-rosa/40' },
  { id: 'facebook', nombre: 'Facebook', url: 'https://www.facebook.com', color: 'hover:border-violeta hover:bg-violeta hover:shadow-violeta/40' },
  { id: 'linkedin', nombre: 'LinkedIn', url: 'https://www.linkedin.com', color: 'hover:border-menta hover:bg-menta hover:shadow-menta/40' },
  { id: 'github', nombre: 'GitHub', url: 'https://github.com', color: 'hover:border-slate-900 hover:bg-slate-900 hover:shadow-slate-900/40 dark:hover:bg-slate-700' },
]
