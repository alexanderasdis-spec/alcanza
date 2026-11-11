import { Link, useLocation, useNavigate } from 'react-router-dom'
import AvisoFormulario from '../components/auth/AvisoFormulario'
import BotonEnviar from '../components/auth/BotonEnviar'
import MarcoAuth from '../components/auth/MarcoAuth'
import CampoTexto from '../components/formulario/CampoTexto'
import VerificacionHumana from '../components/formulario/VerificacionHumana'
import { useAuth } from '../hooks/useAuth'
import { useFormulario } from '../hooks/useFormulario'
import { useVerificacion } from '../hooks/useVerificacion'
import { validarIngreso } from '../utils/validaciones'

/**
 * Página de inicio de sesión (ruta `/ingresar`).
 *
 * Si el usuario llegó aquí porque intentó entrar a una página protegida, después de iniciar
 * sesión vuelve a esa página (la guarda `RequiereSesion` en `location.state.desde`).
 * Antes de enviar exige la verificación "no soy un robot" de Cloudflare Turnstile.
 *
 * @returns {JSX.Element}
 */
function IniciarSesion() {
  const { iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.desde ?? '/'
  // Mensaje que deja la página de restablecer contraseña al terminar.
  const aviso = location.state?.aviso

  const verificacion = useVerificacion()

  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    { email: '', password: '' },
    validarIngreso,
    async ({ email, password }) => {
      if (!verificacion.exigir()) return
      try {
        await iniciarSesion(email.trim(), password, verificacion.token)
      } catch (error) {
        // El código de Turnstile ya se gastó: se prepara uno nuevo para el siguiente intento.
        verificacion.reiniciar()
        throw error
      }
      navigate(destino, { replace: true })
    },
  )

  return (
    <MarcoAuth
      titulo="¡Hola de nuevo!"
      subtitulo="Entra para seguir con tus metas de ahorro."
      pie={
        <>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="font-semibold text-violeta hover:underline dark:text-violet-300">
            Regístrate gratis
          </Link>
        </>
      }
    >
      <form onSubmit={alEnviar} noValidate className="space-y-5">
        <AvisoFormulario mensaje={aviso} tipo="exito" />
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
        <div>
          <CampoTexto
            etiqueta="Contraseña"
            name="password"
            type="password"
            autoComplete="current-password"
            value={datos.password}
            onChange={alCambiar}
            error={errores.password}
          />
          <Link
            to="/olvide-contrasena"
            className="mt-2 inline-block text-sm font-medium text-violeta hover:underline dark:text-violet-300"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <VerificacionHumana key={verificacion.vuelta} onCambiar={verificacion.alCambiar} error={verificacion.error || errores.turnstile} />
        <AvisoFormulario mensaje={errorGeneral} />
        <BotonEnviar enviando={enviando} texto="Iniciar sesión" textoEnviando="Entrando…" />
      </form>
    </MarcoAuth>
  )
}

export default IniciarSesion
