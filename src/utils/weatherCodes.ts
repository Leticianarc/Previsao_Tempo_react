/**
 * Tradução dos códigos WMO usados pelo Open-Meteo.
 * Referência: https://open-meteo.com/en/docs
 */
interface WeatherDescription {
  label: string
  icon: string
}

const WEATHER_CODES: Record<number, WeatherDescription> = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Predominantemente limpo', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Névoa', icon: '🌫️' },
  48: { label: 'Névoa com geada', icon: '🌫️' },
  51: { label: 'Garoa fraca', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa intensa', icon: '🌧️' },
  61: { label: 'Chuva fraca', icon: '🌦️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva forte', icon: '🌧️' },
  71: { label: 'Neve fraca', icon: '🌨️' },
  73: { label: 'Neve moderada', icon: '🌨️' },
  75: { label: 'Neve intensa', icon: '❄️' },
  80: { label: 'Pancadas de chuva', icon: '🌦️' },
  81: { label: 'Pancadas fortes', icon: '🌧️' },
  82: { label: 'Temporal', icon: '⛈️' },
  95: { label: 'Tempestade', icon: '⛈️' },
  96: { label: 'Tempestade com granizo', icon: '⛈️' },
  99: { label: 'Tempestade severa', icon: '⛈️' },
}

const UNKNOWN: WeatherDescription = { label: 'Condição indisponível', icon: '🌡️' }

export function describeWeather(code: number): WeatherDescription {
  return WEATHER_CODES[code] ?? UNKNOWN
}

/** "Hoje" para o primeiro dia, senão o dia da semana abreviado ("seg", "ter"...). */
export function formatWeekday(isoDate: string, index: number): string {
  if (index === 0) return 'Hoje'

  const date = new Date(`${isoDate}T12:00:00`)
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

export function formatTemperature(value: number): string {
  return `${Math.round(value)}°`
}
