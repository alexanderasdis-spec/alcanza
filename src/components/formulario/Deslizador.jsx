import { useId } from 'react'

/**
 * Deslizador (input de tipo rango) con etiqueta y el valor actual a la derecha.
 * Es controlado: el valor y el cambio los maneja el componente que lo usa.
 *
 * La parte recorrida se pinta con un degradado violeta → rosa usando una variable CSS
 * (`--avance`), que se calcula con el porcentaje del valor dentro del rango.
 *
 * @param {Object} props
 * @param {string} props.etiqueta - Texto de la etiqueta.
 * @param {number} props.valor - Valor actual.
 * @param {(valor: number) => void} props.onCambiar - Recibe el nuevo valor ya convertido a número.
 * @param {number} props.min
 * @param {number} props.max
 * @param {number} [props.paso=1] - Cuánto cambia el valor en cada movimiento.
 * @param {string} props.texto - Valor formateado que se muestra (por ejemplo, "$ 350.000").
 * @returns {JSX.Element}
 *
 * @example
 * <Deslizador etiqueta="Ahorro mensual" valor={ahorro} onCambiar={setAhorro} min={0} max={2000000} paso={10000} texto={formatear(ahorro, 'COP')} />
 */
function Deslizador({ etiqueta, valor, onCambiar, min, max, paso = 1, texto }) {
  const id = useId()
  const avance = max > min ? ((valor - min) / (max - min)) * 100 : 0

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-slate-600 dark:text-slate-300">
          {etiqueta}
        </label>
        <span className="font-titulo font-semibold tabular-nums">{texto}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={paso}
        value={valor}
        onChange={(evento) => onCambiar(Number(evento.target.value))}
        aria-valuetext={texto}
        style={{ '--avance': `${avance}%` }}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,var(--color-violeta),var(--color-rosa)_var(--avance),#e2e8f0_var(--avance))] accent-violeta dark:bg-[linear-gradient(to_right,var(--color-violeta),var(--color-rosa)_var(--avance),#1e293b_var(--avance))] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-violeta [&::-webkit-slider-thumb]:shadow-lg [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-violeta"
      />
    </div>
  )
}

export default Deslizador
