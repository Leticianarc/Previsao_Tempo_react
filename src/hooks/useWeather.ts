import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchWeather, searchCities, WeatherApiError } from '../services/weatherApi'
import type { City, RequestStatus, Weather } from '../types'

interface UseWeatherResult {
  city: City | null
  weather: Weather | null
  status: RequestStatus
  error: string | null
  search: (query: string) => void
}

/**
 * Concentra o fluxo de busca: geocodifica a cidade, busca a previsão e
 * expõe um único `status` para a UI renderizar.
 *
 * Cada nova busca aborta a anterior, evitando que uma resposta lenta
 * sobrescreva o resultado de uma busca mais recente (race condition).
 */
export function useWeather(): UseWeatherResult {
  const [city, setCity] = useState<City | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const inFlight = useRef<AbortController | null>(null)

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return

    inFlight.current?.abort()
    const controller = new AbortController()
    inFlight.current = controller

    setStatus('loading')
    setError(null)

    try {
      const [match] = await searchCities(trimmed, controller.signal)

      if (!match) {
        setStatus('error')
        setError(`Não encontramos nenhuma cidade chamada "${trimmed}".`)
        return
      }

      const result = await fetchWeather(match, controller.signal)

      setCity(match)
      setWeather(result)
      setStatus('success')
    } catch (caught) {
      // Busca cancelada por outra mais recente: o estado pertence à nova busca.
      if (controller.signal.aborted) return

      setStatus('error')
      setError(
        caught instanceof WeatherApiError
          ? caught.message
          : 'Algo deu errado ao buscar a previsão. Verifique sua conexão.',
      )
    }
  }, [])

  // Aborta a requisição pendente caso o componente seja desmontado.
  useEffect(() => () => inFlight.current?.abort(), [])

  return { city, weather, status, error, search }
}
