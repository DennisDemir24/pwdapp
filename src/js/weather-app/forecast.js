class Forecast {
  constructor () {
    this.key = 'k7Wwn4S1lCezbzGMrwEPTHAM5DUbTF8y'
    this.weatherURI = 'http://dataservice.accuweather.com/currentconditions/v1/'
    this.cityURI = 'http://dataservice.accuweather.com/locations/v1/cities/search'
  }

  /**
   *
   *
   * @param {city} city
   * @returns the city details and updates it in the UI / Component
   * @memberof Forecast
   */
  async updateCity (city) {
    const cityDets = await this.getCity(city)
    const weather = await this.getWeather(cityDets.Key)
    return { cityDets, weather }
  }

  /**
   *
   *
   * @param {city} city
   * @returns Returns the city location from the API call.
   * @memberof Forecast
   */
  async getCity (city) {
    const query = `?apikey=${this.key}&q=${city}`

    const response = await window.fetch(this.cityURI + query)
    const data = await response.json()

    return data[0]
  }

  /**
   *
   *
   * @param {id} id
   * @returns Returns the weather information from the API call.
   * @memberof Forecast
   */
  async getWeather (id) {
    const query = `${id}?apikey=${this.key}`

    const response = await window.fetch(this.weatherURI + query)
    const data = await response.json()

    return data[0]
  }
}

export { Forecast }
