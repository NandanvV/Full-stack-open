const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
  });

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

app.use((request, response, next) => {
    if (request.method === 'POST') {
      morgan(':method :url :status :res[content-length] - :response-time ms :body')(request, response, next)
    } else {
      morgan('tiny')(request, response, next)
    }
  });


let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

let now = new Date

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
            <div>Phonebook has info for ${persons.length} people</div> 
            <br>
            <div>${now} </div>
        `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    const samePerson = persons.find(person => person.name === body.name)

    if (!body.name) {
        return response.status(400).json({ 
          error: 'name missing' 
        })
      } else if (!body.number) {
        return response.status(400).json({ 
            error: 'number missing' 
          })
      } else if (samePerson) {
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
    
    const person = {
        id: String(Math.floor(Math.random() * 1000)),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})