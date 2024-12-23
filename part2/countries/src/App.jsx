import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'

const App = () => {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch((err) => console.log(err))
  }, [])

  const handleChange = (event) => {
    setQuery(event.target.value)
  }

  const handleShow = (event) => {
    event.preventDefault()
    setQuery(event.target.value)
  }

  return (
    <div>
      <span>find countries </span>
      <input value={query} onChange={handleChange} />
      <Countries
        countries={countries}
        query={query}
        handleShow={handleShow}
      />
    </div>
  )
}

export default App