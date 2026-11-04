import axios from 'axios'

/**
 * Servicio de tasas de cambio con ExchangeRate-API, versión abierta (https://open.er-api.com).
 * Gratis y sin clave. Sus condiciones exigen mostrar un enlace de crédito,
 * que está en el pie de página (`components/Footer.jsx`).
 *
 * @module services/monedaService
 */

/** Monedas que se pueden elegir en Alcanza. */
export const MONEDAS = ['COP', 'USD', 'EUR']

/**
 * Tasas de cambio con base en dólares: cuántas unidades de cada moneda vale 1 USD.
 *
 * @typedef {Object} Tasas
 * @property {number} USD - Siempre 1.
 * @property {number} COP - Pesos colombianos por dólar.
 * @property {number} EUR - Euros por dólar.
 * @property {Date} actualizado - Fecha de la última actualización de la API.
 */

/**
 * Promesa guardada de las tasas. La API se actualiza una vez al día,
 * así que basta con consultarla una vez por visita.
 *
 * @type {Promise<Tasas> | null}
 */
let tasasEnCache = null

/**
 * Trae las tasas de cambio del día, con base en dólares (los precios de DummyJSON vienen en USD).
 *
 * @returns {Promise<Tasas>}
 * @throws {Error} Si la API no responde o responde con un error.
 */
export function obtenerTasas() {
  if (!tasasEnCache) {
    tasasEnCache = axios
      .get('https://open.er-api.com/v6/latest/USD', { timeout: 10000 })
      .then(({ data }) => {
        if (data.result !== 'success') throw new Error('La API de monedas respondió con un error')
        return {
          USD: 1,
          COP: data.rates.COP,
          EUR: data.rates.EUR,
          actualizado: new Date(data.time_last_update_unix * 1000),
        }
      })
      .catch((error) => {
        // Si falla, se borra la caché para poder reintentar más tarde.
        tasasEnCache = null
        throw error
      })
  }
  return tasasEnCache
}
