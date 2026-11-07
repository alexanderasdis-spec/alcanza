import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AvisoFormulario from '../components/auth/AvisoFormulario'
import BotonEnviar from '../components/auth/BotonEnviar'
import MarcoAuth from '../components/auth/MarcoAuth'
import CampoTexto from '../components/formulario/CampoTexto'
import { useFormulario } from '../hooks/useFormulario'
import { restablecerContrasena } from '../services/authService'
import { validarContrasenaNueva } from '../utils/validaciones'

/**
 * Página para poner una contraseña nueva (ruta `/restablecer`).
 * Se abre desde el enlace del correo, que trae en la URL el `token` y el `email`:
 * `/restablecer?token=...&email=...`
 *
 * Al terminar manda a iniciar sesión con un aviso de confirmación.
 *
 * @returns {JSX.Element}
 */
function RestablecerContrasena() {
  const [parametros] = useSearchParams()
  const token = parametros.get('token') ?? ''
  const email = parametros.get('email') ?? ''
  const navigate = useNavigate()

  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    { password: '', confirmacion: '' },
    validarContrasenaNueva,
    async ({ password, confirmacion }) => {
      const mensaje = await restablecerContrasena({ token, email, password, confirmacion })
      navigate('/ingresar', { replace: true, state: { aviso: mensaje } })
    },
    { password_confirmation: 'confirmacion' },
  )

  const pie = (
    <Link to="/olvide-contrasena" className="font-semibold text-violeta hover:underline dark:text-violet-300">
      Pedir un enlace nuevo
    </Link>
  )

  // Sin token o sin correo en la URL, el enlace está incompleto.
  if (!token || !email) {
    return (
      <MarcoAuth titulo="Enlace incompleto" subtitulo="Abre de nuevo el enlace que te llegó al correo." pie={pie}>
        <AvisoFormulario mensaje="A este enlace le faltan datos para cambiar la contraseña." />
      </MarcoAuth>
    )
  }

  // El error del token vencido llega en el campo "email", que no está en el formulario: se muestra arriba.
  const errorEnlace = errores.email || errores.token

  return (
    <MarcoAuth titulo="Crea una contraseña nueva" subtitulo={`Para la cuenta ${email}`} pie={pie}>
      <form onSubmit={alEnviar} noValidate className="space-y-5">
        <AvisoFormulario mensaje={errorEnlace} />
        <CampoTexto
          etiqueta="Contraseña nueva"
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
        <AvisoFormulario mensaje={errorGeneral} />
        <BotonEnviar enviando={enviando} texto="Guardar contraseña" textoEnviando="Guardando…" />
      </form>
    </MarcoAuth>
  )
}

export default RestablecerContrasena
