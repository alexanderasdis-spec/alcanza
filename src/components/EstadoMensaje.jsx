import { motion } from 'framer-motion'

/**
 * Mensaje centrado para los estados especiales de una página:
 * lista vacía, sin resultados o error al consultar una API.
 *
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.Icono - Ícono grande del mensaje.
 * @param {string} props.titulo - Título corto.
 * @param {string} props.texto - Explicación para el usuario.
 * @param {import('react').ReactNode} [props.accion] - Botón o enlace opcional (por ejemplo, "Reintentar").
 * @returns {JSX.Element}
 */
function EstadoMensaje({ Icono, titulo, texto, accion }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-md py-16 text-center"
    >
      <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-violeta/15 to-rosa/15 text-violeta dark:text-violet-300">
        <Icono className="size-10" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 font-titulo text-xl font-bold">{titulo}</h2>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{texto}</p>
      {accion && <div className="mt-6">{accion}</div>}
    </motion.div>
  )
}

export default EstadoMensaje
