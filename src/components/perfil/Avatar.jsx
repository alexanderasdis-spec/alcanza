import { useState } from 'react'

/**
 * Foto de perfil redonda. Si no hay foto, o no carga, muestra la inicial del nombre.
 *
 * @param {Object} props
 * @param {string | null} [props.foto] - Dirección de la foto.
 * @param {string} props.nombre - Nombre de la persona (para la inicial).
 * @param {string} [props.className='size-10 text-base'] - Tamaño y tamaño de letra.
 * @returns {JSX.Element}
 */
function Avatar({ foto, nombre, className = 'size-10 text-base' }) {
  // Guarda la dirección que falló, así una foto nueva sí se vuelve a intentar.
  const [fallida, setFallida] = useState(null)
  const clases = `shrink-0 rounded-full shadow-md shadow-violeta/30 ${className}`

  if (foto && foto !== fallida) {
    return <img src={foto} alt="" onError={() => setFallida(foto)} className={`object-cover ${clases}`} />
  }

  return (
    <span className={`grid place-items-center bg-gradient-to-br from-violeta to-rosa font-titulo font-bold text-white ${clases}`}>
      {nombre.charAt(0).toUpperCase()}
    </span>
  )
}

export default Avatar
