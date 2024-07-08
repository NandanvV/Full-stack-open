import { useState, useEffect } from 'react'
import apiService from './services/api'

const Search = (props) => {
  return (       
    <input
      value={props.filter} 
      onChange={props.handle} 
    />
  )
}

const CountryName = ({country, onSelect}) => {
  return(
    <div>
      {country.name.common}
      <button onClick={() => onSelect(country)}>show</button>
    </div>
  )
}

const Country = ({country, weather}) => {
  console.log(weather)

  return(
    <div>
      <h2>{country.name.common}</h2>

      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>

      <h3>languages</h3>

      <ul>
        {country.languages && Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} 
           style={{ maxWidth: '15%', height: 'auto' }}
           border='1px solid black'
      />

      <h3>Weather in {country.capital[0]}</h3>

      <div>temperature Celsius</div>
    </div>
  )
}

const Countries = ({countriesToShow, onSelect, selectedCountry, weather}) => {
  if (countriesToShow.length > 10) {
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  else if (selectedCountry !== null) {
    return(
      <div>
        <Country key={selectedCountry.name.common} country={selectedCountry} weather={weather}/>
      </div>
    )
  }
  else if (countriesToShow.length === 1) {
    return(
      <div>
        <Country key={countriesToShow[0].name.common} country={countriesToShow[0]} weather={weather}/>
      </div>
    )
  }
  else {
  return(
      <div>
      {countriesToShow.map((country, index) =>
          <CountryName key={index} country={country} onSelect={onSelect} />
      )}
      </div>
  )
  }
}

function App() {
  const [countries, setCountries] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState()

  useEffect(() => {
    apiService
      .getCountries()
      .then(initialCountries => {
        setCountries(initialCountries)     
      })
      .catch(err => {
        console.error('Error fetching countries:', err);
      })
  }, [])

  const countriesToShow = showAll
    ? countries
    : countries.filter(country => country.name.common.toLowerCase().includes(filter))

  const fetchWeather = capital => {
    apiService
      .getWeather(capital)
      .then(weather => {
        setWeather(weather)
      })
      .catch(err => {
        console.error('Error fetching weather:', err);
      })
  }

  const handleCountryChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null)
    setShowAll(false)
    if (countriesToShow.length === 1) {
      fetchWeather(countriesToShow[0].capital[0])
    }
  }

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    fetchWeather(country.capital[0])
  }

  return (
    <div>
      find countries 
      <Search filter={filter} handle={handleCountryChange}/>
      <Countries countriesToShow={countriesToShow} onSelect={handleCountrySelect} 
      selectedCountry={selectedCountry} weather={weather}/>
    </div>
  )
}

export default App
