import { Forecast } from './forecast.js'

class Weather extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.cityForm = undefined
    this.card = undefined
    this.details = undefined
    this.time = undefined
    this.icon = undefined
    this.wrapper = undefined
    this.forecast = new Forecast()
    this.shadowRoot.innerHTML = `
            <style>
                body{
                    background: #eeedec;
                    letter-spacing: 0.2em;
                    font-size: 0.8em;
                    height 20%;
                    width: auto;
                }
                
                .container{
                    max-width: 400px;
                    height: 100%;
                }
                
                .icon {
                    position: relative;
                    top: -50px;
                    border-radius: 50%;
                    width: 100px;
                    margin-bottom: -50px;
                }
                #input-field {
                  width: 95%;
                }
            </style>
            <div id="wrapper"></div>
            <div class="container my-5 mx-auto">
            <h1 class="text-muted text-center my-4">WeatherMe</h1>
    
            <form class="change-location my-4 text-center text-muted">
                <label for="city">Enter a city for the weather information</label>
                <input id="input-field" type="text" name="city" class="form-control p-4">
            </form>
    
            <div class="card shadow-lg rounded d-none">
                <img src="" class="time card-img-top">
                <div class="icon bg-light mx-auto text-center">
                <img src="" alt="">
                </div>
                <div class="text-muted text-uppercase text-center details">
                    <h5 class="my-3">City Name</h5>
                    <div class="my-3">Weather COndition</div>
                    <div class="display-4 my-4">
                        <span>Temp</span>
                        <span>&deg;C</span>
                    </div>
                </div>
            </div>
        </div>
    `
  }

  connectedCallback () {
    this.cityForm = this.shadowRoot.querySelector('form')
    this.cityForm.addEventListener('submit', this.submitWeatherForm.bind(this))
    this.wrapper = this.shadowRoot.querySelector('#wrapper')
    const styleSheet = document.createElement('link')
    styleSheet.rel = 'stylesheet'
    styleSheet.href = 'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css'
    this.wrapper.append(styleSheet)
  }

  updateUI (data) {
    // destructure properties
    const { cityDets, weather } = data

    this.details = this.shadowRoot.querySelector('.details')

    // update details template
    this.details.innerHTML = `
    <h5 class="my-3">${cityDets.EnglishName}</h5>
    <div class="my-3">${weather.WeatherText}</div>
    <div class="display-4 my-4">
      <span>${weather.Temperature.Metric.Value}</span>
      <span>&deg;C</span>
    </div>
  `

    // update the night/day & icon images
    const iconSrc = `../../weather-img/icons/${weather.WeatherIcon}.svg`
    this.icon = this.shadowRoot.querySelector('.icon img')
    this.icon.setAttribute('src', iconSrc)

    const timeSrc = weather.IsDayTime ? '../../weather-img/day.svg' : '../../weather-img/night.svg'

    this.time = this.shadowRoot.querySelector('img.time')
    this.time.setAttribute('src', timeSrc)

    this.card = this.shadowRoot.querySelector('.card')
    // remove the d-none class if present
    if (this.card.classList.contains('d-none')) {
      this.card.classList.remove('d-none')
    }
  }

  submitWeatherForm (e) {
    // prevent default action
    e.preventDefault()

    // get city value
    const city = this.cityForm.city.value.trim()
    this.cityForm.reset()

    // update the ui with new city
    this.forecast.updateCity(city)
      .then(data => this.updateUI(data))
      .catch(err => console.log(err))
  }
}

window.customElements.define('weather-app', Weather)
