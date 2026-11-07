import { Navigate, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import BotonTema from '../components/BotonTema'
import SinConexion from '../components/SinConexion'
import FormularioPerfil from '../components/bienvenida/FormularioPerfil'
import RecorridoBienvenida from '../components/bienvenida/RecorridoBienvenida'
import { useAuth } from '../hooks/useAuth'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePerfil } from '../hooks/usePerfil'
import { TRANSICION_ENTRADA } from '../utils/animaciones'

/**
 * Página de bienvenida (ruta `/bienvenida`). Es lo primero que ve un usuario recién registrado:
 * 1. El recorrido de tres pantallas (solo la primera vez; se recuerda en localStorage).
 * 2. El perfil rápido con su ahorro mensual (el nombre ya viene del registro).
 *
 * Si el usuario ya tiene perfil, lo manda directo a Inicio.
 *
 * @returns {JSX.Element | null}
 */
function Bienvenida() {
  const { usuario } = useAuth()
  const { perfil, cargando, error, reintentar, guardarPerfil } = usePerfil()
  const [recorridoVisto, setRecorridoVisto] = useLocalStorage('alcanza-recorrido-visto', false)
  const navigate = useNavigate()

  if (cargando) return null
  if (error) return <SinConexion onReintentar={reintentar} />
  if (perfil) return <Navigate to="/" replace />

  /** Guarda el perfil y entra a la app. */
  const alGuardar = async (nuevoPerfil) => {
    await guardarPerfil(nuevoPerfil)
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <span className="font-titulo text-2xl font-bold bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">
          Alcanza
        </span>
        <BotonTema />
      </header>

      <main className="grid flex-1 place-items-center px-4 pb-12">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200/80 bg-white/70 p-6 shadow-2xl shadow-violeta/10 backdrop-blur-xl sm:p-10 dark:border-slate-700/60 dark:bg-slate-900/60">
          {/* Cambia entre el recorrido y el formulario con una transición */}
          <AnimatePresence mode="wait">
            <motion.div
              key={recorridoVisto ? 'formulario' : 'recorrido'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ ...TRANSICION_ENTRADA, duration: 0.4 }}
            >
              {recorridoVisto ? (
                <>
                  <FormularioPerfil onGuardar={alGuardar} nombreInicial={usuario?.nombre} />
                  <button
                    type="button"
                    onClick={() => setRecorridoVisto(false)}
                    className="mt-6 text-sm text-slate-500 underline-offset-4 hover:text-violeta hover:underline dark:text-slate-400"
                  >
                    Ver otra vez cómo funciona
                  </button>
                </>
              ) : (
                <RecorridoBienvenida onTerminar={() => setRecorridoVisto(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default Bienvenida
