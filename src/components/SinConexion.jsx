import { RefreshCw, ServerOff } from 'lucide-react'
import EstadoMensaje from './EstadoMensaje'

/**
 * Pantalla que se muestra cuando la API de Laravel no responde al abrir la app
 * (normalmente porque los contenedores de Sail están apagados).
 *
 * @param {Object} props
 * @param {() => void} props.onReintentar - Vuelve a consultar la API.
 * @returns {JSX.Element}
 */
function SinConexion({ onReintentar }) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <EstadoMensaje
        Icono={ServerOff}
        titulo="No pudimos conectar con el servidor"
        texto="Revisa que el backend esté encendido (./vendor/bin/sail up -d en ~/alcanza-api) y vuelve a intentarlo."
        accion={
          <button
            type="button"
            onClick={onReintentar}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-6 py-3 font-semibold text-white shadow-lg shadow-violeta/30"
          >
            <RefreshCw className="size-4" />
            Reintentar
          </button>
        }
      />
    </div>
  )
}

export default SinConexion
