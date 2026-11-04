import { useState } from 'react'
import { Plus } from 'lucide-react'
import { erroresDeValidacion } from '../../services/api'
import { formatearMoneda } from '../../utils/formato'

/**
 * Formulario controlado para registrar un abono en una meta.
 * El monto se escribe en pesos colombianos, la moneda en que se guardan las metas.
 *
 * @param {Object} props
 * @param {number} props.metaId - Id de la meta (para conectar la etiqueta con el input).
 * @param {(monto: number) => Promise<void>} props.onAbonar - Registra el abono; si falla, lanza el error.
 * @returns {JSX.Element}
 */
function FormularioAbono({ metaId, onAbonar }) {
  const [monto, setMonto] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const idInput = `abono-${metaId}`

  const alEnviar = async (evento) => {
    evento.preventDefault()
    const valor = Number(monto)
    if (!monto || !Number.isFinite(valor) || valor <= 0) {
      setError('Escribe un monto mayor que cero.')
      return
    }

    setEnviando(true)
    setError('')
    try {
      await onAbonar(valor)
      setMonto('')
    } catch (problema) {
      // Si la API rechazó el monto (422) se muestra su mensaje; si no, un aviso general.
      const delServidor = erroresDeValidacion(problema)
      setError(delServidor?.monto ?? 'No pudimos registrar el abono. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={alEnviar} noValidate>
      <label htmlFor={idInput} className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Registrar un abono (en pesos)
      </label>
      <div className="mt-1.5 flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">$</span>
          <input
            id={idInput}
            type="number"
            inputMode="numeric"
            min="1"
            step="1000"
            placeholder="50000"
            value={monto}
            onChange={(evento) => setMonto(evento.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={`${idInput}-ayuda`}
            className={`w-full rounded-xl border bg-white/90 py-2.5 pr-3 pl-7 outline-none transition focus:ring-4 dark:bg-slate-900/80 ${
              error
                ? 'border-rosa focus:ring-rosa/20'
                : 'border-slate-200 focus:border-menta focus:ring-menta/20 dark:border-slate-700'
            }`}
          />
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-menta px-4 font-semibold text-white shadow-lg shadow-menta/30 transition hover:brightness-110 disabled:opacity-60"
        >
          <Plus className="size-4" />
          {enviando ? 'Abonando…' : 'Abonar'}
        </button>
      </div>
      <p id={`${idInput}-ayuda`} className={`mt-1.5 text-xs ${error ? 'font-medium text-rosa' : 'text-slate-500 dark:text-slate-400'}`}>
        {error || (Number(monto) > 0 ? `${formatearMoneda(Number(monto))} a tu meta` : 'Cada abono te acerca a tu antojo.')}
      </p>
    </form>
  )
}

export default FormularioAbono
