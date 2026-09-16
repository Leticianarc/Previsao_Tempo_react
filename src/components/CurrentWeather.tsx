import type { City, CurrentConditions } from '../types'
import { describeWeather, formatTemperature } from '../utils/weatherCodes'

interface CurrentWeatherProps {
  city: City
  current: CurrentConditions
}

export function CurrentWeather({ city, current }: CurrentWeatherProps) {
  const { label, icon } = describeWeather(current.weatherCode)
  const place = [city.name, city.state, city.country].filter(Boolean).join(', ')

  return (
    <section className="current" aria-label={`Condições atuais em ${city.name}`}>
      <header className="current__header">
        <h2 className="current__city">{city.name}</h2>
        <p className="current__place">{place}</p>
      </header>

      <div className="current__reading">
        <span className="current__icon" role="img" aria-label={label}>
          {icon}
        </span>
        <span className="current__temp">{formatTemperature(current.temperature)}</span>
      </div>

      <p className="current__label">{label}</p>

      <dl className="metrics">
        <div className="metric">
          <dt>Sensação</dt>
          <dd>{formatTemperature(current.feelsLike)}</dd>
        </div>
        <div className="metric">
          <dt>Umidade</dt>
          <dd>{Math.round(current.humidity)}%</dd>
        </div>
        <div className="metric">
          <dt>Vento</dt>
          <dd>{Math.round(current.windSpeed)} km/h</dd>
        </div>
      </dl>
    </section>
  )
}
