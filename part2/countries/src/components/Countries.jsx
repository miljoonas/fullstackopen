import Country from "./Country"

const Countries = ({ countries, query, handleShow }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(query.toLowerCase())
  )

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length < 1) {
    return <p>No matches, specify another filter</p>
  }

  if (filteredCountries.length === 1) {
    return (
      <div>
        <Country country={filteredCountries[0]} />
      </div>
    )

  }

  return (
    <div>
      {filteredCountries.map((country) => (
        <div key={country.name.official}>
          <span>{country.name.common}</span>
          <button type="button" value={country.name.common} onClick={handleShow}>show</button>
        </div>
      ))}
    </div>
  )
}

export default Countries