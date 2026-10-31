import { Link } from 'react-router-dom'
import Magnetico from '../components/animaciones/Magnetico'

/**
 * Página 404. Se muestra cuando la URL no coincide con ninguna ruta.
 * Usa el mensaje temático "Saldo insuficiente" y ofrece volver al inicio.
 *
 * @returns {JSX.Element}
 */
function NoEncontrada() {
  return (
    <section className="py-16 text-center">
      <p className="font-titulo text-7xl font-bold bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">
        404
      </p>
      <h1 className="mt-4 font-titulo text-2xl font-bold">Saldo insuficiente</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">Esta página no existe.</p>
      <div className="mt-8">
        <Magnetico>
          <Link
            to="/"
            className="inline-block rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30"
          >
            Volver al inicio
          </Link>
        </Magnetico>
      </div>
    </section>
  )
}

export default NoEncontrada
