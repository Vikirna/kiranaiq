const axios = require('axios')

const getWeatherData = async (city = 'Delhi') => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: city,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    )
    const data = response.data
    return {
      temperature: data.main.temp,
      condition: data.weather[0].main,
      humidity: data.main.humidity,
      demandFactor: getDemandFactor(data.main.temp, data.weather[0].main)
    }
  } catch (err) {
    console.error('Weather API error:', err.message)
    return { temperature: 25, condition: 'Clear', demandFactor: 1.0 }
  }
}

const getDemandFactor = (temp, condition) => {
  if (condition === 'Rain') return 1.3      // Rain → noodles, snacks up
  if (temp < 15) return 1.2                // Cold → chai, ginger up
  if (temp > 40) return 1.15               // Hot → cold drinks up
  return 1.0
}

module.exports = { getWeatherData }