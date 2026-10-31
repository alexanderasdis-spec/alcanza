import { useState } from 'react'
import { buscarCategoria } from '../../data/categorias'

/**
 * Foto de un antojo sobre un fondo degradado suave.
 * Si el producto no tiene foto (los propios de Entretenimiento) o la foto no carga,
 * muestra el ícono de su categoría en su lugar.
 *
 * @param {Object} props
 * @param {import('../../services/ofertasService').Antojo} props.antojo - Producto dueño de la foto.
 * @param {string} [props.src] - Foto a mostrar; por defecto, la principal del antojo.
 * @param {string} [props.className=''] - Clases de Tailwind para el contenedor (tamaño, bordes).
 * @returns {JSX.Element}
 */
function ImagenAntojo({ antojo, src = antojo.imagen, className = '' }) {
  const [fallo, setFallo] = useState(false)
  const Icono = buscarCategoria(antojo.categoria)?.Icono

  return (
    <div
      className={`grid place-items-center overflow-hidden bg-gradient-to-br from-violeta/10 via-white to-rosa/10 dark:from-violeta/25 dark:via-slate-900 dark:to-rosa/20 ${className}`}
    >
      {src && !fallo ? (
        <img
          src={src}
          alt={antojo.nombre}
          loading="lazy"
          onError={() => setFallo(true)}
          className="size-full object-contain p-4 transition duration-500 group-hover:scale-110"
        />
      ) : (
        Icono && <Icono aria-label={antojo.nombre} className="size-1/3 text-violeta/60 dark:text-violet-300/70" strokeWidth={1.4} />
      )}
    </div>
  )
}

export default ImagenAntojo
