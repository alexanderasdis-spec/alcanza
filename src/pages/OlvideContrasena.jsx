import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import AvisoFormulario from '../components/auth/AvisoFormulario'
import BotonEnviar from '../components/auth/BotonEnviar'
import MarcoAuth from '../components/auth/MarcoAuth'
import CampoTexto from '../components/formulario/CampoTexto'
import { useFormulario } from '../hooks/useFormulario'
import { olvideContrasena } from '../services/authService'
import { validarCorreo } from '../utils/validaciones'

/** Buzón de prueba donde llegan los correos mientras se desarrolla (Mailpit, en Docker). */
const BUZON_DESARROLLO = 'http://localhost:8025'

/**
 * Página "Olvidé mi contraseña" (ruta `/olvide-contrasena`).
 * Pide el correo y la API envía un enlace para cambiar la contraseña.
 * Por seguridad, la respuesta es la misma exista o no la cuenta.
 *
 * @returns {JSX.Element}
 */
function OlvideContrasena() {
  const [mensaje, setMensaje] = useState('')

  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    { email: '' },
    validarCorreo,
    async ({ email }) => setMensaje(await olvideContrasena(email.trim())),
  )

  const volver = (
    <Link to="/ingresar" className="font-semibold text-violeta hover:underline dark:text-violet-300">
      Volver a iniciar sesión
    </Link>
  )

  if (mensaje) {
    return (
      <MarcoAuth titulo="Revisa tu correo" pie={volver}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-menta to-teal-400 text-white shadow-xl shadow-menta/30">
            <MailCheck className="size-10" />
          </div>
          <p className="mt-6 text-slate-600 dark:text-slate-300">{mensaje}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">El enlace vence en 60 minutos.</p>
          {/* Solo en desarrollo: los correos no salen a internet, se ven en Mailpit. */}
          {import.meta.env.DEV && (
            <a
              href={BUZON_DESARROLLO}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-block rounded-full bg-amarillo/20 px-4 py-2 text-sm font-medium text-slate-700 dark:text-amarillo"
            >
              Modo desarrollo: abrir el buzón de prueba (Mailpit)
            </a>
          )}
        </motion.div>
      </MarcoAuth>
    )
  }

  return (
    <MarcoAuth
      titulo="¿Olvidaste tu contraseña?"
      subtitulo="Escribe tu correo y te enviamos un enlace para crear una nueva."
      pie={volver}
    >
      <form onSubmit={alEnviar} noValidate className="space-y-5">
        <CampoTexto
          etiqueta="Correo"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={datos.email}
          onChange={alCambiar}
          error={errores.email}
        />
        <AvisoFormulario mensaje={errorGeneral} />
        <BotonEnviar enviando={enviando} texto="Enviar enlace" textoEnviando="Enviando…" />
      </form>
    </MarcoAuth>
  )
}

export default OlvideContrasena
