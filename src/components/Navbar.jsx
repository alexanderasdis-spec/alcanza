import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import BotonTema from './BotonTema'

/**
 * Enlaces del menú principal.
 * Se recorren con `map` para no repetir el mismo JSX cuatro veces.
 *
 * @type {{ ruta: string, texto: string }[]}
 */
const ENLACES = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/antojos', texto: 'Antojos' },
  { ruta: '/comparador', texto: 'Comparador' },
  { ruta: '/metas', texto: 'Mis metas' },
]

/**
 * Devuelve las clases de un enlace según si es la página actual.
 * `NavLink` le pasa `isActive` a esta función automáticamente.
 * Solo "Inicio" usa `end`, para que `/antojos/5` siga marcando "Antojos" como activo.
 *
 * @param {{ isActive: boolean }} estado
 * @returns {string} Clases de Tailwind para el enlace.
 */
function clasesEnlace({ isActive }) {
  const base = 'block rounded-full px-4 py-2 font-medium transition'
  return isActive
    ? `${base} bg-violeta/10 text-violeta dark:bg-violeta/20 dark:text-violet-300`
    : `${base} text-slate-600 hover:text-violeta dark:text-slate-300 dark:hover:text-violet-300`
}

/**
 * Menú superior que comparten todas las páginas: logo, navegación y botón de modo oscuro.
 * En celular los enlaces se esconden detrás de un botón de menú (hamburguesa).
 *
 * @returns {JSX.Element}
 */
function Navbar() {
  // Controla si el menú desplegable del celular está abierto.
  const [menuAbierto, setMenuAbierto] = useState(false)

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-fondo/80 backdrop-blur dark:border-slate-800 dark:bg-fondo-oscuro/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          to="/"
          onClick={cerrarMenu}
          className="font-titulo text-2xl font-bold bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent"
        >
          Alcanza
        </Link>

        {/* Enlaces en computador */}
        <ul className="hidden items-center gap-1 md:flex">
          {ENLACES.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink to={enlace.ruta} end={enlace.ruta === '/'} className={clasesEnlace}>
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <BotonTema />
          <button
            type="button"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuAbierto}
            className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-violeta/10 md:hidden dark:text-slate-300"
          >
            {menuAbierto ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Enlaces en celular: solo se muestran si el menú está abierto */}
      {menuAbierto && (
        <ul className="space-y-1 border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          {ENLACES.map((enlace) => (
            <li key={enlace.ruta}>
              <NavLink to={enlace.ruta} end={enlace.ruta === '/'} onClick={cerrarMenu} className={clasesEnlace}>
                {enlace.texto}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

export default Navbar
