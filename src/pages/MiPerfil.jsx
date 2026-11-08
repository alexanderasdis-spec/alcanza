import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, KeyRound, Mail, UserRound } from 'lucide-react'
import Aparecer from '../components/animaciones/Aparecer'
import TarjetaInteractiva from '../components/animaciones/TarjetaInteractiva'
import AvisoFormulario from '../components/auth/AvisoFormulario'
import BotonEnviar from '../components/auth/BotonEnviar'
import CampoTexto from '../components/formulario/CampoTexto'
import { useAuth } from '../hooks/useAuth'
import { useFormulario } from '../hooks/useFormulario'
import { usePerfil } from '../hooks/usePerfil'
import { cambiarContrasena } from '../services/authService'
import { formatearMoneda } from '../utils/formato'
import { validarCambioContrasena, validarPerfil } from '../utils/validaciones'

/**
 * Aviso verde de "guardado" que aparece y desaparece con animación.
 *
 * @param {Object} props
 * @param {string} props.mensaje - Texto del aviso; vacío para ocultarlo.
 * @returns {JSX.Element}
 */
function AvisoExito({ mensaje }) {
  return (
    <AnimatePresence>
      {mensaje && (
        <motion.p
          role="status"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-2xl bg-menta/10 px-4 py-3 text-sm font-medium text-menta"
        >
          <CheckCircle2 className="size-4 shrink-0" />
          {mensaje}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/**
 * Formulario para editar el nombre y el ahorro mensual del perfil.
 * Al guardar, todas las páginas recalculan las fechas con el ahorro nuevo.
 *
 * @returns {JSX.Element}
 */
function FormularioDatos() {
  const { perfil, guardarPerfil } = usePerfil()
  const [exito, setExito] = useState('')

  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    // Los inputs guardan texto, por eso el ahorro se pasa a String.
    { nombre: perfil.nombre, ahorroMensual: String(perfil.ahorroMensual) },
    validarPerfil,
    async ({ nombre, ahorroMensual }) => {
      setExito('')
      await guardarPerfil({ nombre: nombre.trim(), ahorroMensual: Number(ahorroMensual) })
      setExito('¡Listo! Tus fechas ya se calculan con estos datos.')
    },
    { ahorro_mensual: 'ahorroMensual' },
  )

  const ahorro = Number(datos.ahorroMensual)

  return (
    <form onSubmit={alEnviar} noValidate className="space-y-5">
      <CampoTexto etiqueta="Nombre" name="nombre" autoComplete="given-name" value={datos.nombre} onChange={alCambiar} error={errores.nombre} />
      <CampoTexto
        etiqueta="Ahorro mensual (en pesos)"
        name="ahorroMensual"
        type="number"
        value={datos.ahorroMensual}
        onChange={alCambiar}
        error={errores.ahorroMensual}
        ayuda={ahorro > 0 ? `${formatearMoneda(ahorro)} al mes` : undefined}
      />
      <AvisoFormulario mensaje={errorGeneral} />
      <AvisoExito mensaje={exito} />
      <BotonEnviar enviando={enviando} texto="Guardar cambios" textoEnviando="Guardando…" />
    </form>
  )
}

/**
 * Formulario para cambiar la contraseña sabiendo la actual.
 *
 * @param {Object} props
 * @param {(mensaje: string) => void} props.onCambiada - Se llama al terminar, con el mensaje de la API.
 * @returns {JSX.Element}
 */
function FormularioContrasena({ onCambiada }) {
  const { datos, errores, errorGeneral, enviando, alCambiar, alEnviar } = useFormulario(
    { actual: '', password: '', confirmacion: '' },
    validarCambioContrasena,
    async (valores) => onCambiada(await cambiarContrasena(valores)),
    { password_actual: 'actual', password_confirmation: 'confirmacion' },
  )

  return (
    <form onSubmit={alEnviar} noValidate className="space-y-5">
      <CampoTexto
        etiqueta="Contraseña actual"
        name="actual"
        type="password"
        autoComplete="current-password"
        value={datos.actual}
        onChange={alCambiar}
        error={errores.actual}
      />
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
        etiqueta="Repite la contraseña nueva"
        name="confirmacion"
        type="password"
        autoComplete="new-password"
        value={datos.confirmacion}
        onChange={alCambiar}
        error={errores.confirmacion}
      />
      <AvisoFormulario mensaje={errorGeneral} />
      <BotonEnviar enviando={enviando} texto="Cambiar contraseña" textoEnviando="Cambiando…" />
    </form>
  )
}

/**
 * Página "Mi perfil" (ruta `/perfil`).
 * Muestra la cuenta (nombre y correo), permite editar el nombre y el ahorro mensual del perfil
 * y cambiar la contraseña. Al cambiarla, la API cierra la sesión en los otros dispositivos.
 *
 * @returns {JSX.Element}
 */
function MiPerfil() {
  const { usuario } = useAuth()
  // Cambiar la key vacía el formulario de contraseña después de un cambio exitoso.
  const [vueltaContrasena, setVueltaContrasena] = useState(0)
  const [exitoContrasena, setExitoContrasena] = useState('')

  /** @param {string} mensaje */
  const alCambiarContrasena = (mensaje) => {
    setExitoContrasena(mensaje)
    setVueltaContrasena((n) => n + 1)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Aparecer>
        <h1 className="font-titulo text-3xl font-bold sm:text-4xl">
          Mi <span className="bg-gradient-to-r from-violeta to-rosa bg-clip-text text-transparent">perfil</span>
        </h1>
        <p className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
          <Mail className="size-4" />
          {usuario?.email}
        </p>
      </Aparecer>

      <div className="grid gap-6 md:grid-cols-2">
        <Aparecer orden={1}>
          <TarjetaInteractiva className="h-full p-6" inclinacion={3}>
            <h2 className="flex items-center gap-2 font-titulo text-xl font-bold">
              <UserRound className="size-5 text-violeta dark:text-violet-300" />
              Tus datos
            </h2>
            <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
              Con tu ahorro mensual calculamos cuándo alcanzas cada antojo.
            </p>
            <FormularioDatos />
          </TarjetaInteractiva>
        </Aparecer>

        <Aparecer orden={2}>
          <TarjetaInteractiva className="h-full p-6" inclinacion={3}>
            <h2 className="flex items-center gap-2 font-titulo text-xl font-bold">
              <KeyRound className="size-5 text-rosa" />
              Cambiar contraseña
            </h2>
            <p className="mt-1 mb-6 text-sm text-slate-500 dark:text-slate-400">
              Se cerrará tu sesión en los otros dispositivos.
            </p>
            <div className="space-y-5">
              <AvisoExito mensaje={exitoContrasena} />
              <FormularioContrasena key={vueltaContrasena} onCambiada={alCambiarContrasena} />
            </div>
          </TarjetaInteractiva>
        </Aparecer>
      </div>
    </div>
  )
}

export default MiPerfil
