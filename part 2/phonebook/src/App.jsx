import { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = (props) => {
  return (
    <div>
        filter shown with
        <input
          value={props.filter} 
          onChange={props.handle}        
        />
      </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
        <div>
          name: 
          <input 
            value={props.newName}
            onChange={props.handleName}
          />
        </div>
        <div>
          number: 
          <input 
            value={props.newNumber}
            onChange={props.handleNumber}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ personsToShow, deletePerson }) => {
  return(
    <div>
        {personsToShow.map(person => 
          <Person key={person.id} person={person} deletePerson={deletePerson}/>
        )}
      </div>
  )
}

const Person = ({ person, deletePerson }) => {
  return(
    <div>
      {person.name} {person.number} 
      <button onClick={() => deletePerson(person.id)}>delete</button>
    </div>
  )
}

const Notification = ({ message, errorValue}) => {
  if (message === null) {
    return null
  }

  if (errorValue) {
    return(
      <div className="error">
        {message}
      </div>
      )
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorValue, setError] = useState(false)
  
  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (!persons.some(persons => persons.name === newName)){
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
        })
        if (errorValue) {
          setError(false)
        }
        setMessage(`Added ${personObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
    }
    else {
      const confirmAdd = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)

      if (confirmAdd) {
        const person = persons.find(person => person.name === personObject.name)
        const id = person.id
        personService
          .change(id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        })
        .catch(error => {
          setError(true)
          setMessage(`Information of ${person.name} has already been removed from server`)
          setPersons(persons.filter(person => person.id !== id))
          setTimeout(() => {
          setMessage(null)
        }, 5000)
        })
        if (errorValue) {
          setError(false)
        }
        setMessage(`Changed the number of ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
    setNewName('')
    setNewNumber('')
  }

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    
    if (confirmDelete) {
      personService
        .erase(id)
        .then(returnedPerson => {
          persons.map(person => person.id !== id ? person : returnedPerson)
        })
        setPersons(persons.filter(person => person.id !== id))
        if (errorValue) {
          setError(false)
        }
        setMessage(`Deleted ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShowAll(false)
  }

  const personsToShow = showAll
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} errorValue={errorValue}/>

      <Filter filter={filter} handle={handleFilterChange}/>

      <h3>add a new</h3>

      <PersonForm addPerson={addPerson} newName={newName} handleName={handleNameChange}
                  newNumber={newNumber} handleNumber={handleNumberChange}/>

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} deletePerson={deletePerson}/>

    </div>
  )

}

export default App