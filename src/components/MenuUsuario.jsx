import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { RESORTE_RAPIDO } from '../utils/animaciones'

/**
 * Botón con la inicial del usuario que abre un menú con su nombre, su correo
 * y el botón "Cerrar sesión". Se cierra al hacer clic fuera o con la tecla Escape.
 *
 * @returns {JSX.Element | null}
 */
function MenuUsuario() {
  const { usuario, cerrarSesion } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const contenedor = useRef(null)
  const navigate = useNavigate()

  // Cierra el menú al hacer clic fuera de él o al presionar Escape.
  useEffect(() => {
    if (!abierto) return
    const alClic = (evento) => {
      if (!contenedor.current?.contains(evento.target)) setAbierto(false)
    }
    const alTecla = (evento) => evento.key === 'Escape' && setAbierto(false)
    document.addEventListener('pointerdown', alClic)
    document.addEventListener('keydown', alTecla)
    return () => {
      document.removeEventListener('pointerdown', alClic)
      document.removeEventListener('keydown', alTecla)
    }
  }, [abierto])

  if (!usuario) return null

  const alSalir = async () => {
    setAbierto(false)
    await cerrarSesion()
    navigate('/ingresar', { replace: true })
  }

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => setAbierto((valor) => !valor)}
        aria-label={`Menú de ${usuario.nombre}`}
        aria-expanded={abierto}
        className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violeta to-rosa font-titulo font-bold text-white shadow-md shadow-violeta/30 transition hover:scale-105"
      >
        {usuario.nombre.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={RESORTE_RAPIDO}
            className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="px-3 py-2">
              <p className="font-titulo font-semibold">{usuario.nombre}</p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-400">{usuario.email}</p>
            </div>
            <button
              type="button"
              onClick={alSalir}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-medium text-rosa transition hover:bg-rosa/10"
            >
              <LogOut className="size-4" />
              Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MenuUsuario
