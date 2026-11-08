/**
 * Aviso que se ve mientras el navegador descarga el código de una página.
 * Solo aparece la primera vez que se abre cada página.
 *
 * @returns {JSX.Element}
 */
function CargandoPagina() {
  return (
    <div role="status" className="grid min-h-[50vh] place-items-center">
      <span className="size-10 animate-spin rounded-full border-4 border-violeta/20 border-t-violeta" />
      <span className="sr-only">Cargando la página…</span>
    </div>
  )
}

export default CargandoPagina
