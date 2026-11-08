import { useRef, useState } from 'react'
import { Camera, Trash2 } from 'lucide-react'
import Avatar from './Avatar'
import AvisoFormulario from '../auth/AvisoFormulario'
import { usePerfil } from '../../hooks/usePerfil'
import { erroresDeValidacion, esDemasiadosIntentos } from '../../services/api'
import { TIPOS_FOTO, errorFoto, recortarCuadrada } from '../../utils/imagen'

/**
 * Convierte un error de la API en un mensaje para la persona.
 *
 * @param {unknown} error
 * @returns {string}
 */
function mensajeDeError(error) {
  const campos = erroresDeValidacion(error, {})
  if (campos?.foto) return campos.foto
  if (esDemasiadosIntentos(error)) return 'Demasiados intentos. Espera un minuto y vuelve a probar.'
  return 'No pudimos guardar la foto. Revisa que el servidor esté encendido e inténtalo de nuevo.'
}

/**
 * Permite subir, cambiar o quitar la foto de perfil.
 * Recorta la imagen en el navegador y la foto nueva aparece de una vez en el menú.
 *
 * @returns {JSX.Element}
 */
function SelectorFoto() {
  const { perfil, cambiarFoto, quitarFoto } = usePerfil()
  const entrada = useRef(null)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')

  /**
   * Ejecuta una acción mostrando el estado "ocupado" y su posible error.
   *
   * @param {() => Promise<void>} accion
   */
  const ejecutar = async (accion) => {
    setOcupado(true)
    setError('')
    try {
      await accion()
    } catch (motivo) {
      setError(mensajeDeError(motivo))
    } finally {
      setOcupado(false)
    }
  }

  /** Revisa el archivo elegido, lo recorta y lo sube. */
  const alElegir = (evento) => {
    const archivo = evento.target.files?.[0]
    // Se limpia para que elegir otra vez el mismo archivo también funcione.
    evento.target.value = ''
    if (!archivo) return

    const problema = errorFoto(archivo)
    if (problema) {
      setError(problema)
      return
    }
    ejecutar(async () => {
      let recortada
      try {
        recortada = await recortarCuadrada(archivo)
      } catch {
        setError('No pudimos leer esa imagen. Prueba con otra.')
        return
      }
      await cambiarFoto(recortada)
    })
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row">
      <Avatar foto={perfil.foto} nombre={perfil.nombre} className="size-24 text-4xl" />
      <div className="w-full text-center sm:text-left">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            onClick={() => entrada.current?.click()}
            disabled={ocupado}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violeta to-rosa px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violeta/30 disabled:opacity-60"
          >
            <Camera className="size-4" />
            {ocupado ? 'Guardando…' : perfil.foto ? 'Cambiar foto' : 'Subir foto'}
          </button>
          {perfil.foto && (
            <button
              type="button"
              onClick={() => ejecutar(quitarFoto)}
              disabled={ocupado}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-rosa/10 hover:text-rosa disabled:opacity-60 dark:text-slate-400"
            >
              <Trash2 className="size-4" />
              Quitar
            </button>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">JPG, PNG o WebP, hasta 8 MB. La recortamos en cuadrado.</p>
        <input ref={entrada} type="file" accept={TIPOS_FOTO.join(',')} onChange={alElegir} aria-label="Elegir foto de perfil" className="hidden" />
        {error && (
          <div className="mt-3">
            <AvisoFormulario mensaje={error} />
          </div>
        )}
      </div>
    </div>
  )
}

export default SelectorFoto
