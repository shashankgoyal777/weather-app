import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [cityName, setCityName] = useState("Bharatpur");
  const [searchedCity, setSearchedCity] = useState("");

  const [country,setCountry]=useState("")
  const [temp, setTemp] = useState(0);
  const [weather, setWeather] = useState(null);
  const [wind, setWind] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [currentWeatherImg, setCurrentWeatherImg] = useState("");

  const [hourData, setHourData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const api_url =
    "https://api.weatherapi.com/v1/forecast.json?key=390dba3dd01144df907140923251906&q=" +
    cityName +
    "&days=7";

  function getDataFromApi() {
    
    fetch(api_url)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
      alert(data.error.message); // ✅ This is your API's error format
    } 

        console.log(data);
        console.log("temp= ", data.current.temp_c);

        setCountry(data.location.country);
        setTemp(Math.round(data.current.temp_c));
        setWind(data.current.wind_kph);
        setWeather(data.current.condition.text);
        setCurrentWeatherImg(data.current.condition.icon);
        setHumidity(data.current.humidity);
        setHigh(Math.round(data.forecast.forecastday[0].day.maxtemp_c));
        setLow(Math.round(data.forecast.forecastday[0].day.mintemp_c));

        setHourData(data.forecast.forecastday[0].hour);
        setDayData(data.forecast.forecastday);
        console.log("DayData: ", data.forecast.forecastday);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert(error.message);
      });
      

    }

  const handleSearch=()=>{
      setCityName(searchedCity);
      console.log("CityName inside handle Search: ", cityName);
      // getDataFromApi();
  }


  useEffect(() => {
    getDataFromApi();
  }, [cityName]);

  // Function to get the day name from a date string
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const ampm = (date) => {
    const newdate = new Date(date);
    const hour = newdate.getHours();
    // console.log("Hour:",date);
    const ampm = hour >= 12 ? "PM" : "AM";
    const timeToReturn = hour % 12 || 12;
    return timeToReturn + ampm;
  };

  const now = new Date();
  console.log("now:", now.getHours());



  return (
    <>
      {/* Shree Ram */}

      <div className="container">
        <div className="main">
          <div className="left">
            <div className="top">
              <input
                onChange={(e) => setSearchedCity(e.target.value)}
                type="text"
                placeholder="Search for a city..."
                className="searchBar"
              />
              <button onClick={(e) => {handleSearch()} }>Search</button>
              <p className="city-name">{cityName}, {country}</p>
              <div className="weather-info">
                <div>
                  <img src={currentWeatherImg} alt="Weather Icon" />
                  <p className="high">High: {high}°C</p>
                  <p className="low">Low: {low}°C</p>
                </div>

                <div className="info-right">
                  <h2 className="temp">{temp}°C</h2>
                  <h2 className="weather">{weather}</h2>

                  <p className="wind">Wind: {wind} kph</p>
                  <p className="humidity">Humidity: {humidity}%</p>
                </div>
              </div>
            </div>

            <div className="days-forecast">
              <p className="forecast-title"> 7-DAY FORECAST</p>
              <div className="day-cards">
                {dayData.map((day, index) => {
                  return (
                    <div key={index} className="day-card">
                      <p>{getDayName(day.date)}</p>
                      <img src={day.day.condition.icon} alt="Weather Icon" />
                      <p className="day-temp">
                        {Math.round(day.day.maxtemp_c)}°C
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hourly Forcast Today */}
          <div className="right">
            <div className="right-top">TODAY'S FORECAST</div>
            <div className="hourly-forecast">
              {hourData.map((hour, index) => {
                const hourvalue = new Date(hour.time).getHours();
                if (hourvalue < now.getHours()) return null;
                return (
                  <div key={index} className="hour-card">
                    <p>{ampm(hour.time)}</p>

                    <img src={hour.condition.icon} alt="Weather Icon" />
                    <p>{Math.round(hour.temp_c)}°C</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
