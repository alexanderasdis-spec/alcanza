import { Link, useNavigate } from 'react-router-dom'
import AvisoFormulario from '../components/auth/AvisoFormulario'
import BotonEnviar from '../components/auth/BotonEnviar'
import MarcoAuth from '../components/auth/MarcoAuth'
import CampoTexto from '../components/formulario/CampoTexto'
import VerificacionHumana from '../components/formulario/VerificacionHumana'
import { useAuth } from '../hooks/useAuth'
import { useFormulario } from '../hooks/useFormulario'
import { useVerificacion } from '../hooks/useVerificacion'
import { validarRegistro } from '../utils/validaciones'

/**
 * Página de registro (ruta `/registro`): nombre, correo, contraseña y verificación "no soy un robot".
 * Al crear la cuenta la sesión queda iniciada y el usuario pasa a la bienvenida,
 * donde ve el recorrido y escribe su ahorro mensual.
 *
 * @returns {JSX.Element}
 */
function Registro() {
  const { registrarse } = useAuth()
  const navigate = useNavigate()

  const verificacion = useVerificacion()

  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    { nombre: '', email: '', password: '', confirmacion: '' },
    validarRegistro,
    async ({ nombre, email, password, confirmacion }) => {
      if (!verificacion.exigir()) return
      try {
        await registrarse({ nombre: nombre.trim(), email: email.trim(), password, confirmacion, turnstile: verificacion.token })
      } catch (error) {
        // El código de Turnstile ya se gastó: se prepara uno nuevo para el siguiente intento.
        verificacion.reiniciar()
        throw error
      }
      navigate('/bienvenida', { replace: true })
    },
    // La API llama "password_confirmation" a la confirmación; el formulario, "confirmacion".
    { password_confirmation: 'confirmacion' },
  )

  return (
    <MarcoAuth
      titulo="Crea tu cuenta"
      subtitulo="Guarda tus metas y abonos para verlos desde cualquier lugar."
      pie={
        <>
          ¿Ya tienes cuenta?{' '}
          <Link to="/ingresar" className="font-semibold text-violeta hover:underline dark:text-violet-300">
            Inicia sesión
          </Link>
        </>
      }
    >
      <form onSubmit={alEnviar} noValidate className="space-y-5">
        <CampoTexto
          etiqueta="¿Cómo te llamas?"
          name="nombre"
          autoComplete="given-name"
          placeholder="Tu nombre"
          value={datos.nombre}
          onChange={alCambiar}
          error={errores.nombre}
        />
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
        <CampoTexto
          etiqueta="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          value={datos.password}
          onChange={alCambiar}
          error={errores.password}
          ayuda="Mínimo 8 caracteres, con letras y números."
        />
        <CampoTexto
          etiqueta="Repite la contraseña"
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          value={datos.confirmacion}
          onChange={alCambiar}
          error={errores.confirmacion}
        />
        <VerificacionHumana key={verificacion.vuelta} onCambiar={verificacion.alCambiar} error={verificacion.error || errores.turnstile} />
        <AvisoFormulario mensaje={errorGeneral} />
        <BotonEnviar enviando={enviando} texto="Crear mi cuenta" textoEnviando="Creando tu cuenta…" />
      </form>
    </MarcoAuth>
  )
}

export default Registro
