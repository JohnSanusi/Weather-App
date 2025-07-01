import React, { useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear from "../assets/clear.png";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import humidity from "../assets/humidity.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import wind from "../assets/wind.png";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, Setweather] = useState(null);

  const getWeather = async () => {
    Setweather(null);
    console.log("fetching weather for:", city);

    if (!city.trim()) {
      alert("please enter a valid city");
      return;
    }

    try {
      const weatherIcons = {
        0: clear,
        1: cloud,
        2: cloud,
        3: cloud,
        45: cloud,
        48: cloud,
        51: drizzle,
        53: drizzle,
        55: drizzle,
        56: drizzle,
        57: drizzle,
        61: rain,
        63: rain,
        65: rain,
        66: rain,
        67: rain,
        71: snow,
        73: snow,
        75: snow,
        77: snow,
        85: snow,
        86: snow,
        80: rain,
        81: rain,
        82: rain,
        95: rain,
        96: rain,
        99: rain,
      };
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city.trim()}`
      );
      const geoData = await geoRes.json();
      console.log("geo data:", geoData);

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
      );

      const weatherData = await weatherRes.json();
      console.log("weather data:", weatherData);

      const temperature = weatherData.current_weather.temperature;
      const windspeed = weatherData.current_weather.windspeed;
      const weatherCode = weatherData.current_weather.weathercode;
      const icon = weatherIcons[weatherCode] || clear;

      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13) + ":00";
      const humidityIndex = weatherData.hourly.time.indexOf(currentHour);
      const humidity = weatherData.hourly.relativehumidity_2m[humidityIndex];

      Setweather({
        location: `${name}, ${country}`,
        temperature,
        windspeed,
        humidity,
        icon,
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={search_icon} onClick={getWeather} alt="" />
      </div>
      <img src={weather?.icon ?? clear} className="weather-icon" alt="" />
      <p className="temperature">{weather?.temperature ?? "0"}&deg;C</p>
      <p className="location">{weather?.location ?? "unknown location"}</p>
      <div className="weather-data">
        <div className="col">
          <img src={humidity} alt="" />
          <div>
            <p> {weather?.humidity ?? "0"}%</p>
            <span>Humidity</span>
          </div>
        </div>
        <div className="col">
          <img src={wind} alt="" />
          <div>
            <p>{weather?.windspeed ?? "0"} Km/h</p>
            <span>Wind SPeed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
