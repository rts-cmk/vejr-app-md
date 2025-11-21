import { useState } from "react";
import "./weather.css";


export default function Weather() {
    const [cityName, setCityName] = useState("");
    const [searchedCityName, setSearchedCityName] = useState("");
    const [temperature, setTemperature] = useState(null);
    const [weatherIcon, setWeatherIcon] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [windSpeed, setWindSpeed] = useState(null);
    const [error, setError] = useState(null);

    async function fetchCityCoordinates(cityName) {
        const apiKey = "75f858339ea04590364dfa0c1982f844";
        const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Error fetching coordinates: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.length === 0) {
                throw new Error("City not found");
            }

            const { lat, lon } = data[0];
            return { latitude: lat, longitude: lon };
        } catch (error) {
            console.error("Error fetching city coordinates:", error);
            throw error;
        }
    }

    async function fetchWeatherData(lat, lon) {
        const apiKey = "75f858339ea04590364dfa0c1982f844";
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Error fetching weather data: ${response.statusText}`);
            }

            const data = await response.json();
            const temp = Math.round(data.main.temp);
            const icon = data.weather[0].icon;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            setTemperature(temp);
            setWeatherIcon(`https://openweathermap.org/img/wn/${icon}@2x.png`);
            setHumidity(humidity);
            setWindSpeed(windSpeed);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setError("Unable to fetch weather data.");
        }
    }

    const handleSearch = async () => {
        setError(null);
        setTemperature(null);
        setWeatherIcon(null);
        setHumidity(null);
        setWindSpeed(null);

        if (!cityName.trim()) {
            setError("Please enter a city name.");
            return;
        }

        try {
            const coords = await fetchCityCoordinates(cityName);
            setSearchedCityName(cityName);
            await fetchWeatherData(coords.latitude, coords.longitude);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <section className="weather">
                <h1 className="weather__title">Enter city name</h1>
                <div className="weather__search-container">
                    <input
                        type="text"
                        placeholder= "Search city..."
                        className="weather__city-search-input"
                        value={cityName}
                        onChange={(e) => setCityName(e.target.value)}
                    />
                    <button onClick={handleSearch} className="weather__search-button">
                    Search
                    </button>
                </div>
                <div className="weather__results">
                {error && <p className="weather__error">{error}</p>}
                {temperature !== null && (
                    <>
                        <p className="weather__city-name">{searchedCityName}</p>
                        
                        {weatherIcon && (
                            <img
                                src={weatherIcon}
                                alt="Weather Icon"
                                className="weather__icon"
                            />
                        )}
                        <p className="weather__temperature">{temperature}°C</p>
                        <div className="weather__details">
                        <p className="weather__humidity">Humidity: {humidity}%</p>
                        <p className="weather__wind-speed">Wind Speed: {windSpeed} m/s</p>
                        </div>
                        
                    </>
                )}
                </div>
            </section>
        </>
    );
}