import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BotonTema from '../BotonTema'
import Logo from '../Logo'
import { TRANSICION_ENTRADA } from '../../utils/animaciones'

/**
 * Marco de las páginas de cuenta (ingresar, registrarse, recuperar contraseña):
 * logo y botón de tema arriba, y una tarjeta de vidrio centrada con el contenido.
 *
 * @param {Object} props
 * @param {string} props.titulo - Título grande de la tarjeta.
 * @param {string} [props.subtitulo] - Texto corto debajo del título.
 * @param {import('react').ReactNode} props.children - Contenido (normalmente un formulario).
 * @param {import('react').ReactNode} [props.pie] - Enlaces debajo de la tarjeta (por ejemplo, "¿Ya tienes cuenta?").
 * @returns {JSX.Element}
 */
function MarcoAuth({ titulo, subtitulo, children, pie }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" aria-label="Alcanza, ir al inicio">
          <Logo />
        </Link>
        <BotonTema />
      </header>

      <main className="grid flex-1 place-items-center px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSICION_ENTRADA}
          className="w-full max-w-md"
        >
          <div className="rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-2xl shadow-violeta/10 backdrop-blur-xl sm:p-10 dark:border-slate-700/60 dark:bg-slate-900/60">
            <h1 className="font-titulo text-3xl font-bold">{titulo}</h1>
            {subtitulo && <p className="mt-2 text-slate-600 dark:text-slate-300">{subtitulo}</p>}
            <div className="mt-8">{children}</div>
          </div>
          {pie && <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">{pie}</div>}
        </motion.div>
      </main>
    </div>
  )
}

export default MarcoAuth
