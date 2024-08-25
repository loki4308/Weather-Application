import { useState, useEffect} from 'react'
import './App.css'
/* Images */
import searchIcon from './assets/search.png'
import clearIcon from './assets/sun.png'
import cloudIcon from './assets/cloudy.png'
import drizzleIcon from './assets/cloudy2.png'
import rainIcon from './assets/storm.png'
import windIcon from './assets/wind.png'
import snowIcon from './assets/snow.png'
import humidityIcom from './assets/humidity.png'


{/* Third Props */}
const WeatherDetails = ({icon, temp, city, 
  country, lat, log, humidity, wind}) => {
  return (
  <>
    <div className='image'>
      <img src={icon} alt="Image" />
    </div>

    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>

    <div className="cord">
      <div>
        <span className='lat'>Latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='log'>Longitude</span>
        <span>{log}</span>
      </div>
    </div>

    {/* humidity */}
    <div className="data_container"> 
      <div className="element">
        <img src={humidityIcom} alt="humidity" className='icon'/>
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>
      {/* wind */}
      <div className="element">
        <img src={windIcon} alt="wind" className='icon'/>
        <div className="data">
          <div className="wind-percent">{wind} Km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
    </div>
    
  </>
  );
};



function App() {
  {/* First State Variable */}

  let api_key = "a16d01b64f136f91e82b1d4d7584c825"; /*API key from OpenWeather website */
  const [text, setText] = useState("London");

  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const search = async ()=>{
    setLoading(true);
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
      let res = await fetch(url);
      let data = await res.json();
      // console.log(data);
      if(data.cod === "404"){
        console.log("city not found");
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      
      // API calls in JSON formate
      setHumidity(data.main.humidity);
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name);
      setCountry(data.sys.country)
      setLat(data.coord.lat);
      setLog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon; // Icon code fetching for 01d, 01n, 02d....
      setIcon(weatherIconMap[weatherIconCode] || clearIcon) // if the number icon not found then it will be default clearIcon.
      setCityNotFound(false);
      
    } 
    catch (error) {
      console.error("An error occurred: ", error.message);
      setError("An error occurred while fetching weather data.")
    } 
    finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setText(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function (){
    search();
  }, []);

  return (
    <>
      <div className="container">
        {/* Input Box */}
        <div className="input-container">
          <input type="text" className='cityInput' 
          placeholder='Search City' onChange={handleCity} 
          value={text} onKeyDown={handleKeyDown} />
          <div className='search-icon' onClick={() => search()}> {/* Function directly calling search function */}
            <img src={searchIcon} alt="search"/> 
          </div>
        </div>
        {/* Input Box End */} 

        {loading && <div className="loading-message">loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        {/* Second Props */}
        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} 
        country={country} lat={lat} log={log} humidity={humidity} 
        wind={wind} />}

        <p className='copyright'>
          Created by <span>Yogesh</span>
        </p>
      </div>
    </>
  )
};


export default App

