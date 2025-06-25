import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const apikey = import.meta.env.VITE_API_KEY;
  const [loader, setLoader] = useState(true);

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
        if (data.error) {
         toast(data.error.message) // ✅ This is your API's error format
        }

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
      })
      .finally(() => {
        setLoader(false);
        console.log("Loader is set to false");
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
      // alert("Please enter a city name : )");
      toast.error("Please enter a city name : )", {
      });

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
    <div className="loader">
      <div class="earth">
        <div class="earth-loader">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path
              transform="translate(100 100)"
              d="M29.4,-17.4C33.1,1.8,27.6,16.1,11.5,31.6C-4.7,47,-31.5,63.6,-43,56C-54.5,48.4,-50.7,16.6,-41,-10.9C-31.3,-38.4,-15.6,-61.5,-1.4,-61C12.8,-60.5,25.7,-36.5,29.4,-17.4Z"
              fill="#7CC133"
            ></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path
              transform="translate(100 100)"
              d="M31.7,-55.8C40.3,-50,45.9,-39.9,49.7,-29.8C53.5,-19.8,55.5,-9.9,53.1,-1.4C50.6,7.1,43.6,14.1,41.8,27.6C40.1,41.1,43.4,61.1,37.3,67C31.2,72.9,15.6,64.8,1.5,62.2C-12.5,59.5,-25,62.3,-31.8,56.7C-38.5,51.1,-39.4,37.2,-49.3,26.3C-59.1,15.5,-78,7.7,-77.6,0.2C-77.2,-7.2,-57.4,-14.5,-49.3,-28.4C-41.2,-42.4,-44.7,-63,-38.5,-70.1C-32.2,-77.2,-16.1,-70.8,-2.3,-66.9C11.6,-63,23.1,-61.5,31.7,-55.8Z"
              fill="#7CC133"
            ></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path
              transform="translate(100 100)"
              d="M30.6,-49.2C42.5,-46.1,57.1,-43.7,67.6,-35.7C78.1,-27.6,84.6,-13.8,80.3,-2.4C76.1,8.9,61.2,17.8,52.5,29.1C43.8,40.3,41.4,53.9,33.7,64C26,74.1,13,80.6,2.2,76.9C-8.6,73.1,-17.3,59,-30.6,52.1C-43.9,45.3,-61.9,45.7,-74.1,38.2C-86.4,30.7,-92.9,15.4,-88.6,2.5C-84.4,-10.5,-69.4,-20.9,-60.7,-34.6C-52.1,-48.3,-49.8,-65.3,-40.7,-70C-31.6,-74.8,-15.8,-67.4,-3.2,-61.8C9.3,-56.1,18.6,-52.3,30.6,-49.2Z"
              fill="#7CC133"
            ></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path
              transform="translate(100 100)"
              d="M39.4,-66C48.6,-62.9,51.9,-47.4,52.9,-34.3C53.8,-21.3,52.4,-10.6,54.4,1.1C56.3,12.9,61.7,25.8,57.5,33.2C53.2,40.5,39.3,42.3,28.2,46C17,49.6,8.5,55.1,1.3,52.8C-5.9,50.5,-11.7,40.5,-23.6,37.2C-35.4,34,-53.3,37.5,-62,32.4C-70.7,27.4,-70.4,13.7,-72.4,-1.1C-74.3,-15.9,-78.6,-31.9,-73.3,-43C-68.1,-54.2,-53.3,-60.5,-39.5,-60.9C-25.7,-61.4,-12.9,-56,1.1,-58C15.1,-59.9,30.2,-69.2,39.4,-66Z"
              fill="#7CC133"
            ></path>
          </svg>
        </div>
        {/* <p>Connecting...</p> */}
        <p>Dialing up the weather gods...</p>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;
