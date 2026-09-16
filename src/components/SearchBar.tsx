import { useState, type FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  isLoading: boolean
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSearch(query)
  }

  return (
    <form className="search" onSubmit={handleSubmit} role="search">
      <label className="search__label" htmlFor="city">
        Cidade
      </label>
      <div className="search__field">
        <input
          id="city"
          className="search__input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar cidade — ex.: Jundiaí"
          autoComplete="off"
        />
        <button className="search__button" type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? 'Buscando…' : 'Buscar'}
        </button>
      </div>
    </form>
  )
}
