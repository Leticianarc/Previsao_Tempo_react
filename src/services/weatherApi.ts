import type { City, Weather, DailyForecast } from '../types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

/** Erro de domínio, com mensagem já pronta para exibição ao usuário. */
export class WeatherApiError extends Error {}

/** Formato cru devolvido pelo endpoint de geocodificação. */
interface GeocodingResponse {
  results?: Array<{
    id: number
    name: string
    country?: string
    country_code?: string
    admin1?: string
    latitude: number
    longitude: number
  }>
}

/** Formato cru devolvido pelo endpoint de previsão. */
interface ForecastResponse {
  current: {
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new WeatherApiError('Não foi possível falar com o serviço de clima. Tente novamente.')
  }

  return (await response.json()) as T
}

/**
 * Busca cidades pelo nome. Retorna lista vazia quando nada é encontrado —
 * "nenhum resultado" é um estado válido, não um erro.
 */
export async function searchCities(query: string, signal?: AbortSignal): Promise<City[]> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'pt',
    format: 'json',
  })

  const data = await fetchJson<GeocodingResponse>(`${GEOCODING_URL}?${params}`, signal)

  return (data.results ?? []).map((result) => ({
    id: result.id,
    name: result.name,
    country: result.country ?? '',
    countryCode: result.country_code ?? '',
    state: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }))
}

/** Busca condições atuais e previsão de 5 dias para uma coordenada. */
export async function fetchWeather(city: City, signal?: AbortSignal): Promise<Weather> {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '5',
  })

  const data = await fetchJson<ForecastResponse>(`${FORECAST_URL}?${params}`, signal)

  return {
    current: {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day === 1,
    },
    daily: toDailyForecast(data.daily),
  }
}

/**
 * Converte os arrays paralelos da API em uma lista de objetos.
 * Dias com qualquer campo ausente são descartados em vez de virarem `NaN` na tela.
 */
function toDailyForecast(daily: ForecastResponse['daily']): DailyForecast[] {
  const forecast: DailyForecast[] = []

  for (const [index, date] of daily.time.entries()) {
    const weatherCode = daily.weather_code[index]
    const maxTemperature = daily.temperature_2m_max[index]
    const minTemperature = daily.temperature_2m_min[index]

    if (weatherCode === undefined || maxTemperature === undefined || minTemperature === undefined) {
      continue
    }

    forecast.push({ date, weatherCode, maxTemperature, minTemperature })
  }

  return forecast
}
