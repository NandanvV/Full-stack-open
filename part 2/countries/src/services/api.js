import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
const apiCode = '30127a7306a80e1e73e9d3b6e0ab6e2d'

const getCountries = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getWeather = async (id) => {
    const request1 = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=
        ${id}&limit=1&appid=${apiCode}`)
    const { lat, lon } = request1.data[0]
    const request2 = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiCode}`)
    return request2.data
}

export default {getCountries, getWeather}