import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const Filter = ({ nameFilter, handleFilterChange }) => {
  return (
    <div>
      <input value={nameFilter} onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = ({ addNewPerson, newName, handleNameChange, newNumber, handleNumChange }) => {
  return (
    <form onSubmit={addNewPerson}>
      <div>name: <input
        value={newName}
        onChange={handleNameChange}
      />
      </div>
      <div>number: <input
        value={newNumber}
        onChange={handleNumChange}
      />
      </div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({ personsToShow, deletePerson }) => {
  return (
    <div>
      {
        personsToShow.map(person =>
          <li className='person' key={person.name}>
            {person.name} {person.number}
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </li>
        )
      }
    </div>
  )
}

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  if (type === 'error') {
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
  else {
    return (
      <div className='info'>
        {message}
      </div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [nameFilter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumChange = (event) => setNumber(event.target.value)
  const handleFilterChange = (event) => setFilter(event.target.value)

  const addNewPerson = (event) => {
    event.preventDefault()
    const personExists = persons.some(person => person.name === newName) //remove
    const duplicate = persons.find(person => person.name === newName)
    if (duplicate !== undefined) {
      if (duplicate.number === newNumber) {
        return alert(`${newName} already exists with same number`)
      } else {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one`)) {
          const changedPerson = { ...duplicate, number: newNumber }
          personService
            .update(duplicate.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== duplicate.id ? person : returnedPerson))
              setErrorMessage(
                `Updated ${duplicate.name}`
              )
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
              setNewName('')
              setNumber('')
            })
        }
      }
    }
    else {
      const personsObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personsObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setErrorMessage(
            `Added ${newName}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setNewName('')
          setNumber('')
        })
    }
  }

  const deletePerson = id => {
    if (window.confirm(`Delete ${persons.find(n => n.id === id).name} ?`)) {
      personService
        .remove(id)
        .then(() =>
          setPersons(persons.filter(persons => persons.id !== id))
        ).catch(error => {
          setMessageType('error')
          setErrorMessage(
            `Information of ${persons.find(n => n.id === id).name} has already been removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
            setMessageType(null)
          }, 5000)
          setPersons(persons.filter(persons => persons.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person => {
    return person.name.toLocaleLowerCase().includes(nameFilter.toLocaleLowerCase())
  })


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={messageType} />
      <Filter nameFilter={nameFilter} handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>

      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App