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
      <button onClick={() => onSelect(country.name.common)}>show</button>
    </div>
  )
}

const Country = ({country, weather}) => {
  const url = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`

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

      <div>temperature {weather.main.temp} Celsius</div>

      <img src={url} alt="Weather icon" 
        style={{ width: '8%', height: 'auto' }}
      />

      <div>wind {weather.wind.speed} m/s</div>
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
  else if (selectedCountry !== null && weather !== null) {
    return(
      <div>
        <Country key={selectedCountry.name.common} country={selectedCountry} weather={weather}/>
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
  const [weather, setWeather] = useState(null)

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

    useEffect(() => {
      if (countriesToShow.length === 1) {
        setSelectedCountry(countriesToShow[0])
        apiService
          .getWeather(countriesToShow[0].capital[0])
          .then(weather => {
            setWeather(weather)
          })
          .catch(err => {
            console.error('Error fetching weather:', err);
          })
      }
    }, [filter])


  const handleCountryChange = (input) => {
    let value;
    if (typeof input === 'string') {
      value = input.toLowerCase();
    } else if (input && input.target) {
      value = input.target.value.toLowerCase();
    } else {
      return;
    }
    setFilter(value)
    setSelectedCountry(null)
    setShowAll(false)
  }

  return (
    <div>
      find countries 
      <Search filter={filter} handle={handleCountryChange}/>
      <Countries countriesToShow={countriesToShow} onSelect={handleCountryChange} 
      selectedCountry={selectedCountry} weather={weather}/>
    </div>
  )
}

export default App
