import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [name, setName] = useState('Bharatpur');
  const [temp, setTemp] = useState(0);
  const [weather, setWeather] = useState(null);
  const [wind, setWind] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [high, setHigh] = useState(null)
  const [low, setLow] = useState(null)
  const [currentWeatherImg,setCurrentWeatherImg]=useState('');

  const api_url = "https://api.weatherapi.com/v1/forecast.json?key=390dba3dd01144df907140923251906&q=" + name + "&days=7"

  useEffect(() => {
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log("temp= ", data.current.temp_c);

        setTemp(Math.round( data.current.temp_c));
        setWind(data.current.wind_kph);
        setWeather(data.current.condition.text);
        setCurrentWeatherImg(data.current.condition.icon);
        setHumidity(data.current.humidity);
        setHigh(Math.round(data.forecast.forecastday[0].day.maxtemp_c));
        setLow(Math.round(data.forecast.forecastday[0].day.mintemp_c));



      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, []);



  return (
    <>
      {/* Shree Ram */}

      <div className="container">
        <div className="main">
          <div className="left">
            <div className="top">
              <input type="text" placeholder="Search for a city..." className='searchBar' />
              <button>Search</button>
              <p className='city-name'>Bharatpur</p>
              <div className='weather-info'>

                <div>
                  <img src={currentWeatherImg} alt="Weather Icon" />
                  <p className='high'>High: {high}°C</p>
                  <p className='low'>Low: {low}°C</p>
                </div>

                <div className='info-right'>


                  <h2 className='temp'>{temp}°C</h2>
                  <h2 className='weather'>{weather}</h2>

                  <p className='wind'>Wind: {wind} kph</p>
                  <p className='humidity'>Humidity: {humidity}%</p>
                </div>
              </div>
            </div>

            <div className='bottom'>bottom</div>
          </div>
          <div className="right">Right

          </div>

        </div>
      </div>
    </>
  )
}

export default App
