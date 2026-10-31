/**
 * Pie de página que comparten todas las páginas.
 * Incluye los créditos de las APIs; ExchangeRate-API exige mostrar este enlace.
 *
 * @returns {JSX.Element}
 */
function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>
          <span className="font-titulo font-semibold text-slate-700 dark:text-slate-200">Alcanza</span> ·
          Harold Alexander Ceballos Henao
        </p>
        <p>
          Productos de{' '}
          <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className="text-violeta hover:underline dark:text-violet-300">
            DummyJSON
          </a>{' '}
          ·{' '}
          <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="text-violeta hover:underline dark:text-violet-300">
            Rates By Exchange Rate API
          </a>
        </p>
      </div>
    </footer>
  )
}

export default Footer
