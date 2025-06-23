import { useEffect, useState } from "react";

import dotenv from "dotenv";
// dotenv.config();

import "./App.css";

function App() {
  const apikey = import.meta.env.VITE_API_KEY;
  const [loader, setLoader] = useState(false);

  const [cityName, setCityName] = useState("");
  const [cityToSearch, setCityToSearch] = useState("");

  const [cityNameToDisplay, setCityNameToDisplay] = useState("Your Location");

  const [country, setCountry] = useState("");
  const [temp, setTemp] = useState(0);
  const [weather, setWeather] = useState(null);
  const [wind, setWind] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [high, setHigh] = useState(null);
  const [low, setLow] = useState(null);
  const [currentWeatherImg, setCurrentWeatherImg] = useState("");

  const [hourData, setHourData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const api_url = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q= ${cityName}&days=7`; //Currently Not in use

  async function getDataFromApi(cityNameForApi) {
    console.log("city name for api:", cityNameForApi);
    fetch(
      "https://api.weatherapi.com/v1/forecast.json?key=" +
        apikey +
        "&q=" +
        cityNameForApi +
        "&days=7"
    )
      .then((response) => response.json())
      .then((data) => {
        // if (data.error) {
        //   alert(data.error.message); // ✅ This is your API's error format
        // }

        console.log(data);
        console.log("temp= ", data.current.temp_c);

        setCityNameToDisplay(data.location.name);
        setCountry(data.location.country);
        setTemp(Math.floor(data.current.temp_c));
        setWind(data.current.wind_kph);
        setWeather(data.current.condition.text);
        setCurrentWeatherImg(data.current.condition.icon);
        setHumidity(data.current.humidity);
        setHigh(Math.floor(data.forecast.forecastday[0].day.maxtemp_c));
        setLow(Math.floor(data.forecast.forecastday[0].day.mintemp_c));

        setHourData(data.forecast.forecastday[0].hour);
        setDayData(data.forecast.forecastday);
        console.log("DayData: ", data.forecast.forecastday);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        // alert(error.message);
      });
  }

  const getLocation = async () => {
    console.log("GEOLOCATION IS CALLED");

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("Your location:", latitude, longitude);
          const coord = latitude + "," + longitude;
          setCityName(coord);
          resolve(coord);
          console.log("City Name inside Getlocation:", cityName);
        },
        (err) => {
          reject(err);
          console.error("Location error:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  useEffect(() => {
    const getLocationAndCallApi = async () => {
      // Get user's current location
      const latlong = await getLocation();
      console.log("LatLong:", latlong);

      await getDataFromApi(latlong);
    };
    getLocationAndCallApi();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!cityToSearch.trim()) {
      alert("Please enter a city name : )");
      return;
    } else {
      getDataFromApi(cityToSearch);
      setCityToSearch("");
    }
  };
  // Function to get the day name from a date string
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const ampm = (date) => {
    const newdate = new Date(date);
    const hour = newdate.getHours();
    // console.log("Hour:",date);
    const ampm = hour >= 12 ? ":00 PM" : ":00 AM";
    const timeToReturn = hour % 12 || 12;
    return timeToReturn + ampm;
  };

  const currentDate = new Date();

  return loader ? (
    
<div id="container">
  <div id="square" class="shimmer"></div>
  <div id="content">
    <div id="content-title" class="shimmer"></div>
    <div id="content-desc">
      <div class="line shimmer"></div>
      <div class="line shimmer"></div>
      <div class="line shimmer"></div>
      <div class="line shimmer"></div>
    </div>
  </div>
</div>
  ) : (
    <>
      <div className="container">
        <div className="main">
          <div className="left">
            <div className="top">
              <form
                onSubmit={(e) => {
                  handleSearch(e);
                }}
              >
                <input
                  type="text"
                  onChange={(e) => {
                    setCityToSearch(e.target.value);
                  }}
                  value={cityToSearch}
                  placeholder="Search for a city..."
                  className="searchBar"
                />

                <input type="submit" className="searchBtn" Search />
              </form>

              <p className="city-name">
                {cityNameToDisplay}, {country}
              </p>
              <div className="weather-info">
                <div>
                  <img
                    src={currentWeatherImg.replace("64x64", "128x128")}
                    alt="Weather Icon"
                  />
                  <p className="high">
                    High: {high} <span>°C </span>
                  </p>
                  <p className="low">
                    Low: {low} <span>°C</span>
                  </p>
                </div>

                <div className="info-right">
                  <h2 className="temp">
                    {temp}
                    <span className="mainTemp">°C </span>
                  </h2>
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
                      <img
                        src={day.day.condition.icon.replace("64x64", "128x128")}
                        alt="Weather Icon"
                      />
                      <p className="day-temp">
                        {Math.floor(day.day.maxtemp_c)}°C
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
                if (hourvalue < currentDate.getHours()) return null;
                return (
                  <div key={index} className="hour-card">
                    <p>{ampm(hour.time)}</p>

                    <img src={hour.condition.icon} alt="Weather Icon" />
                    <p>{Math.floor(hour.temp_c)}°C</p>
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
