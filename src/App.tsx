import { useEffect } from 'react'
import { SearchBar } from './components/SearchBar'
import { CurrentWeather } from './components/CurrentWeather'
import { ForecastList } from './components/ForecastList'
import { useWeather } from './hooks/useWeather'

/** Cidade carregada ao abrir, para a tela nunca começar vazia. */
const INITIAL_CITY = 'Jundiaí'

export default function App() {
  const { city, weather, status, error, search } = useWeather()

  useEffect(() => {
    search(INITIAL_CITY)
  }, [search])

  const hasResult = city !== null && weather !== null

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Previsão do Tempo</h1>
        <p className="app__subtitle">Condições atuais e previsão de 5 dias para qualquer cidade do mundo.</p>
      </header>

      <SearchBar onSearch={search} isLoading={status === 'loading'} />

      {status === 'error' && error !== null && (
        <p className="alert" role="alert">
          {error}
        </p>
      )}

      {hasResult ? (
        <main className="app__result" aria-busy={status === 'loading'}>
          <CurrentWeather city={city} current={weather.current} />
          <ForecastList forecast={weather.daily} />
        </main>
      ) : (
        status === 'loading' && <p className="alert alert--muted">Carregando previsão…</p>
      )}

      <footer className="app__footer">
        Dados meteorológicos por{' '}
        <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
          Open-Meteo
        </a>
        .
      </footer>
    </div>
  )
}
