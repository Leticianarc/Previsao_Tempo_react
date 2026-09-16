/** Cidade retornada pela API de geocodificação do Open-Meteo. */
export interface City {
  id: number
  name: string
  country: string
  countryCode: string
  state?: string
  latitude: number
  longitude: number
}

/** Condições atuais de uma cidade. */
export interface CurrentConditions {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: boolean
}

/** Previsão consolidada de um dia. */
export interface DailyForecast {
  date: string
  weatherCode: number
  maxTemperature: number
  minTemperature: number
}

export interface Weather {
  current: CurrentConditions
  daily: DailyForecast[]
}

/** Estados possíveis da busca, usados para renderizar a tela. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
