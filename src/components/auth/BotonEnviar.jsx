import { motion } from 'framer-motion'

/**
 * Botón principal de los formularios de cuenta: ancho completo, degradado de la marca,
 * un pequeño rebote al pasar el mouse y texto de "cargando" mientras se envía.
 *
 * @param {Object} props
 * @param {boolean} props.enviando - `true` mientras se espera la respuesta de la API.
 * @param {string} props.texto - Texto normal del botón.
 * @param {string} props.textoEnviando - Texto mientras se envía (por ejemplo, "Entrando…").
 * @returns {JSX.Element}
 */
function BotonEnviar({ enviando, texto, textoEnviando }) {
  return (
    <motion.button
      type="submit"
      disabled={enviando}
      whileHover={enviando ? undefined : { scale: 1.02 }}
      whileTap={enviando ? undefined : { scale: 0.98 }}
      className="w-full rounded-full bg-gradient-to-r from-violeta to-rosa px-7 py-3 font-semibold text-white shadow-lg shadow-violeta/30 disabled:opacity-60"
    >
      {enviando ? textoEnviando : texto}
    </motion.button>
  )
}

export default BotonEnviar
