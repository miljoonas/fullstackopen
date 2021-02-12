import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = (params) => {
  return (
    <div>
      filter shown with <input
        value={params.newFilter}
        onChange={params.handleFilterChange}
      />
    </div>
  )
}

const PersonForm = (params) => {
  return (
    <form onSubmit={params.handleSubmit}>
      <div>
        name: <input
          value={params.newName}
          onChange={params.handleNameChange}
        />
      </div>
      <div>
        number: <input
          value={params.newNumber}
          onChange={params.handleNumChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (params) => {
  return (
    <div>
      {params.namesToShow.map(person =>
        <p key={person.name}>{person.name} {person.number}</p>)}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    // { name: 'Arto Hellas', number: '040-1231244' },
    // { name: 'Ada Lovelace', number: '39-44-5323523' },
    // { name: 'Dan Abramov', number: '12-43-234345' },
    // { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')

  useEffect(()=>{
    axios.get('http://localhost:3001/persons')
    .then(response => {
      setPersons(response.data)
    })
  },[])
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const personExists = persons.some(person => person.name === newName)
    if (personExists) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNumber('')

    }
  }

  const namesToShow = persons.filter(person => {
    return person.name.toLocaleLowerCase().includes(newFilter.toLocaleLowerCase());
  })

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={(event) => handleFilterChange(event)} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={event => handleNameChange(event)}
        handleNumChange={event => handleNumChange(event)}
        handleSubmit={event => handleSubmit(event)}
      />
      <h3>Numbers</h3>
      <Persons namesToShow={namesToShow} />
    </div>
  )

}

export default App