import type { DailyForecast } from '../types'
import { describeWeather, formatTemperature, formatWeekday } from '../utils/weatherCodes'

interface ForecastListProps {
  forecast: DailyForecast[]
}

export function ForecastList({ forecast }: ForecastListProps) {
  return (
    <section className="forecast" aria-label="Previsão para os próximos dias">
      <h2 className="forecast__title">Próximos dias</h2>
      <ul className="forecast__list">
        {forecast.map((day, index) => {
          const { label, icon } = describeWeather(day.weatherCode)

          return (
            <li className="day" key={day.date}>
              <span className="day__name">{formatWeekday(day.date, index)}</span>
              <span className="day__icon" role="img" aria-label={label}>
                {icon}
              </span>
              <span className="day__range">
                <span className="day__max">{formatTemperature(day.maxTemperature)}</span>
                <span className="day__min">{formatTemperature(day.minTemperature)}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
