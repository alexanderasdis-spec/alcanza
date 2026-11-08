import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, ArrowUpRight, Heart, Lightbulb } from 'lucide-react'
import IconoRed from './footer/IconoRed'
import Logo from './Logo'
import { REDES_SOCIALES } from '../data/redesSociales'
import { RESORTE_RAPIDO } from '../utils/animaciones'

/** Enlaces internos de la columna "Explora". */
const ENLACES = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/antojos', texto: 'Antojos' },
  { ruta: '/comparador', texto: 'Comparador' },
  { ruta: '/metas', texto: 'Mis metas' },
  { ruta: '/perfil', texto: 'Mi perfil' },
]

/** Fuentes de datos externas. ExchangeRate-API exige mostrar este texto con su enlace. */
const CREDITOS = [
  { url: 'https://dummyjson.com', texto: 'Productos de DummyJSON' },
  { url: 'https://www.exchangerate-api.com', texto: 'Rates By Exchange Rate API' },
]

/** Consejos que van rotando: se muestra uno distinto cada día. */
const CONSEJOS = [
  'Aparta tu ahorro apenas recibas el pago, no con lo que sobre.',
  'Antes de comprar un antojo, espera 24 horas y míralo otra vez.',
  'Un abono pequeño cada semana pesa más que uno grande que nunca llega.',
  'Compara dos opciones antes de decidir: a veces la otra llega meses antes.',
  'Ponle fecha a tu meta: lo que tiene fecha se cumple más fácil.',
]

/** Fecha con la que se eligen el consejo y el año; se calcula una vez al cargar la app. */
const HOY = new Date()

/** Consejo que corresponde al día de hoy. */
const CONSEJO_DEL_DIA = CONSEJOS[HOY.getDate() % CONSEJOS.length]

/** Clases compartidas por los títulos de cada columna. */
const CLASES_TITULO = 'font-titulo text-sm font-semibold text-slate-900 dark:text-white'

/** Clases compartidas por los enlaces de las columnas. */
const CLASES_ENLACE = 'transition hover:text-violeta dark:hover:text-violet-300'

/**
 * Pie de página que comparten todas las páginas: marca y redes sociales, enlaces,
 * consejo de ahorro del día, créditos de las APIs y botón para volver arriba.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  const reducirMovimiento = useReducedMotion()

  /** Sube al inicio de la página; sin animación si el usuario prefiere menos movimiento. */
  const volverArriba = () => window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' })

  return (
    <footer className="relative mt-10 overflow-hidden bg-white/60 backdrop-blur dark:bg-slate-950/60">
      {/* Línea superior con el degradado de la marca */}
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-violeta via-rosa to-amarillo" />
      <div aria-hidden="true" className="absolute -top-24 right-0 size-72 rounded-full bg-violeta/10 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-24 left-1/4 size-64 rounded-full bg-rosa/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-12 text-sm text-slate-500 dark:text-slate-400">
        {/* En celular, "Explora" y "Datos" quedan lado a lado para que el pie no sea tan largo */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.5fr_0.8fr_1fr_1.3fr]">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Alcanza, ir al inicio">
              <Logo />
            </Link>
            <p className="mt-3 max-w-xs leading-relaxed">¿Cuándo me lo compro? Convierte tu antojo en una meta con fecha.</p>
            <ul className="mt-5 flex gap-3">
              {REDES_SOCIALES.map(({ id, nombre, url, color }) => (
                <li key={id}>
                  <motion.a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={nombre}
                    title={nombre}
                    whileHover={{ y: -4, rotate: -6 }}
                    whileTap={{ scale: 0.92 }}
                    transition={RESORTE_RAPIDO}
                    className={`grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:text-white hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 ${color}`}
                  >
                    <IconoRed red={id} className="size-5" />
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h2 className={CLASES_TITULO}>Explora</h2>
            <ul className="mt-4 space-y-2.5">
              {ENLACES.map(({ ruta, texto }) => (
                <li key={ruta}>
                  <Link to={ruta} className={CLASES_ENLACE}>
                    {texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={CLASES_TITULO}>Datos</h2>
            <ul className="mt-4 space-y-2.5">
              {CREDITOS.map(({ url, texto }) => (
                <li key={url}>
                  <a href={url} target="_blank" rel="noreferrer" className={`inline-flex items-start gap-1 ${CLASES_ENLACE}`}>
                    {texto}
                    <ArrowUpRight className="mt-0.5 size-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 rounded-3xl lg:col-span-1 bg-gradient-to-br from-violeta/10 to-rosa/10 p-5 dark:from-violeta/25 dark:to-rosa/20">
            <h2 className={`flex items-center gap-2 ${CLASES_TITULO}`}>
              <Lightbulb className="size-4 text-amarillo" />
              Consejo del día
            </h2>
            <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">{CONSEJO_DEL_DIA}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p>
            © {HOY.getFullYear()} Alcanza · Harold Alexander Ceballos Henao · Creación de páginas web 2
          </p>
          <div className="flex items-center justify-between gap-5">
            <p className="inline-flex items-center gap-1.5">
              Hecho con <Heart className="size-4 fill-rosa text-rosa" /> y React
            </p>
            <button
              type="button"
              onClick={volverArriba}
              className="inline-flex items-center gap-1.5 rounded-full bg-violeta/10 px-3 py-1.5 font-semibold text-violeta transition hover:bg-violeta hover:text-white dark:text-violet-300"
            >
              <ArrowUp className="size-4" />
              Arriba
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
