// Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
const apiKey = 'YOUR_API_KEY';

async function checkWeather() {
    const city = document.getElementById("cityInput").value;
    
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        // Step 1: Get coordinates from city name using Geocoding API
        const geoResponse = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
        );
        
        if (!geoResponse.ok) {
            throw new Error('Failed to fetch location data');
        }
        
        const geoData = await geoResponse.json();
        
        if (geoData.length === 0) {
            throw new Error('City not found');
        }
        
        const { lat, lon, name, country } = geoData[0];
        
        // Step 2: Get weather data using One Call API 3.0
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKey}`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data');
        }
        
        const weatherData = await weatherResponse.json();
        
        // Display current weather
        displayCurrentWeather(weatherData.current, name, country);
        
        // Display hourly forecast
        displayHourlyForecast(weatherData.hourly);
        
        // Display daily forecast
        displayDailyForecast(weatherData.daily);
        
        // Check for alerts and show notification
        checkWeatherAlerts(weatherData, name);
        
    } catch (error) {
        console.error(error);
        alert("Error: " + error.message);
    }
}

function displayCurrentWeather(current, city, country) {
    const currentWeatherDiv = document.getElementById("currentWeather");
    const temp = Math.round(current.temp);
    const feelsLike = Math.round(current.feels_like);
    const weather = current.weather[0];
    const icon = weather.icon;
    
    currentWeatherDiv.innerHTML = `
        <div class="current-card">
            <h2>${city}, ${country}</h2>
            <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${weather.description}">
            <div class="temp-main">${temp}°C</div>
            <div class="weather-desc">${weather.description}</div>
            <div class="weather-details">
                <div class="detail">
                    <span>Feels like</span>
                    <strong>${feelsLike}°C</strong>
                </div>
                <div class="detail">
                    <span>Humidity</span>
                    <strong>${current.humidity}%</strong>
                </div>
                <div class="detail">
                    <span>Wind Speed</span>
                    <strong>${current.wind_speed} m/s</strong>
                </div>
                <div class="detail">
                    <span>Pressure</span>
                    <strong>${current.pressure} hPa</strong>
                </div>
                <div class="detail">
                    <span>UV Index</span>
                    <strong>${current.uvi}</strong>
                </div>
                <div class="detail">
                    <span>Visibility</span>
                    <strong>${(current.visibility / 1000).toFixed(1)} km</strong>
                </div>
            </div>
        </div>
    `;
}

function displayHourlyForecast(hourly) {
    const hourlyDiv = document.getElementById("hourlyForecast");
    const next24Hours = hourly.slice(0, 24);
    
    let hourlyHTML = '<h3>Hourly Forecast (Next 24 Hours)</h3><div class="hourly-scroll">';
    
    next24Hours.forEach(hour => {
        const time = new Date(hour.dt * 1000);
        const hours = time.getHours();
        const timeString = `${hours}:00`;
        const temp = Math.round(hour.temp);
        const icon = hour.weather[0].icon;
        const pop = Math.round(hour.pop * 100); // Probability of precipitation
        
        hourlyHTML += `
            <div class="hourly-card">
                <div class="hour-time">${timeString}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather">
                <div class="hour-temp">${temp}°C</div>
                ${pop > 0 ? `<div class="hour-rain">💧 ${pop}%</div>` : ''}
            </div>
        `;
    });
    
    hourlyHTML += '</div>';
    hourlyDiv.innerHTML = hourlyHTML;
}

function displayDailyForecast(daily) {
    const dailyDiv = document.getElementById("dailyForecast");
    const next7Days = daily.slice(0, 7);
    
    let dailyHTML = '<h3>7-Day Forecast</h3><div class="daily-grid">';
    
    next7Days.forEach((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const maxTemp = Math.round(day.temp.max);
        const minTemp = Math.round(day.temp.min);
        const icon = day.weather[0].icon;
        const description = day.weather[0].description;
        const pop = Math.round(day.pop * 100);
        
        dailyHTML += `
            <div class="daily-card">
                <div class="day-name">${dayName}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                <div class="day-desc">${description}</div>
                <div class="day-temp">
                    <span class="temp-max">${maxTemp}°</span>
                    <span class="temp-min">${minTemp}°</span>
                </div>
                ${pop > 0 ? `<div class="day-rain">💧 ${pop}%</div>` : ''}
            </div>
        `;
    });
    
    dailyHTML += '</div>';
    dailyDiv.innerHTML = dailyHTML;
}

function checkWeatherAlerts(weatherData, city) {
    const notif = document.getElementById("weatherNotif");
    const current = weatherData.current;
    const weather = current.weather[0].main;
    
    // Check for weather alerts
    if (weatherData.alerts && weatherData.alerts.length > 0) {
        const alert = weatherData.alerts[0];
        document.getElementById("notifTitle").innerText = `⚠️ Weather Alert`;
        document.getElementById("notifText").innerText = `${alert.event} in ${city}`;
        document.getElementById("notifIcon").src = "https://openweathermap.org/img/wn/50d@2x.png";
        showNotification(notif);
        return;
    }
    
    // Check for specific weather conditions
    if (weather === "Rain" || weather === "Drizzle") {
        document.getElementById("notifTitle").innerText = "☔ Rain Alert";
        document.getElementById("notifText").innerText = `It's raining in ${city}. Take your umbrella 🌂`;
        document.getElementById("notifIcon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        showNotification(notif);
    } else if (weather === "Thunderstorm") {
        document.getElementById("notifTitle").innerText = "⛈️ Thunderstorm Alert";
        document.getElementById("notifText").innerText = `Thunderstorm in ${city}. Stay safe indoors!`;
        document.getElementById("notifIcon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        showNotification(notif);
    } else if (weather === "Snow") {
        document.getElementById("notifTitle").innerText = "❄️ Snow Alert";
        document.getElementById("notifText").innerText = `It's snowing in ${city}! Drive carefully ⛄`;
        document.getElementById("notifIcon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        showNotification(notif);
    } else if (current.temp > 35) {
        document.getElementById("notifTitle").innerText = "🌡️ Heat Warning";
        document.getElementById("notifText").innerText = `Very hot in ${city} (${Math.round(current.temp)}°C). Stay hydrated!`;
        document.getElementById("notifIcon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        showNotification(notif);
    } else if (current.temp < 0) {
        document.getElementById("notifTitle").innerText = "🥶 Cold Warning";
        document.getElementById("notifText").innerText = `Very cold in ${city} (${Math.round(current.temp)}°C). Dress warmly!`;
        document.getElementById("notifIcon").src = `https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`;
        showNotification(notif);
    }
}

function showNotification(notif) {
    notif.classList.add("show");
    setTimeout(() => {
        notif.classList.remove("show");
    }, 5000);
}