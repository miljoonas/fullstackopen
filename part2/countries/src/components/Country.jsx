import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country.capital && country.capital.length > 0) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${import.meta.env.VITE_API_KEY}`)
        .then(response => { setWeather(response.data) })
        .catch((err) => console.log(err))
    }
  }, [country])

  // Fix for antarctica
  if (!country.capital) {
    return (
      <div>
        <h2>Antarctica</h2>
        <p>Capital: No capital <br /> Area 14200000 km²</p>
      </div>
    )
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital}<br /> Area: {country.area} km²</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}<br /></li>
        )}
      </ul>
      <img
        src={country.flags.png}
        height="20%"
        width="20%"
      />
      <h2>Weather in {country.capital}</h2>
      {weather ? (
        <div>
          <p><b>Temperature: </b>{(weather.main.temp - 273.15).toFixed(2)}°C</p>
          <img
            alt={weather.weather[0].main}
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            width="100"
            height="100"
          />
          <p>Wind: {weather.wind.speed} m/s </p>
        </div>
      ) : (
        <p>Loading weather data...</p>
      )}

    </div>
  )
}

export default Country