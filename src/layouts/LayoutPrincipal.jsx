import { useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { TRANSICION_ENTRADA } from '../utils/animaciones'

/**
 * Estructura común de las páginas: menú arriba, contenido en el medio y pie abajo.
 *
 * El contenido cambia con una transición: la página que se va sube y se desvanece,
 * y la nueva entra desde abajo. Para lograrlo:
 * - `useOutlet()` entrega la página de la ruta actual (lo mismo que pintaría `<Outlet />`).
 * - `AnimatePresence` mantiene en pantalla la página vieja mientras termina su animación de salida.
 * - `key={location.pathname}` le avisa a React que cada ruta es un elemento distinto.
 *
 * @returns {JSX.Element}
 */
function LayoutPrincipal() {
  const location = useLocation()
  const pagina = useOutlet()

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ ...TRANSICION_ENTRADA, duration: 0.35 }}
          >
            {pagina}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default LayoutPrincipal
