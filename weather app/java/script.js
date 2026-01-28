const apiKey = '3045dd712ffe6e702e3245525ac7fa38'; // Free OpenWeatherMap API key
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');

// Weather messages based on conditions
const weatherMessages = {
    Rain: "It's raining now, take your umbrella!",
    Drizzle: "Light rain expected, bring an umbrella!",
    Thunderstorm: "Thunderstorm alert! Stay safe indoors!",
    Snow: "It's snowing! Bundle up warm!",
    Clear: "Beautiful clear skies today!",
    Clouds: "Cloudy weather today!",
    Mist: "Misty conditions, drive carefully!",
    Fog: "Foggy weather, visibility is low!",
    default: "Check the weather in your city!"
};

// Get day name from date
function getDayName(timestamp) {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const date = new Date(timestamp * 1000);
    return days[date.getDay()];
}

async function getForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Forecast not found');
        }

        const data = await response.json();
        displayForecast(data);

    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayForecast(data) {
    const forecastCards = document.getElementById('forecastCards');
    forecastCards.innerHTML = '';

    // Get one forecast per day (every 8th item = 24 hours)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length; i += 8) {
        if (dailyForecasts.length < 5) {
            dailyForecasts.push(data.list[i]);
        }
    }

    dailyForecasts.forEach(forecast => {
        const card = document.createElement('div');
        card.className = 'forecast-card';
        
        const day = getDayName(forecast.dt);
        const temp = Math.round(forecast.main.temp);
        const icon = forecast.weather[0].icon;
        const description = forecast.weather[0].description;

        card.innerHTML = `
            <div class="forecast-day">${day}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="forecast-icon" alt="${description}">
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${description}</div>
        `;

        forecastCards.appendChild(card);
    });
}

async function getWeather(city) {
    const weatherContent = document.getElementById('weatherContent');
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');

    try {
        weatherContent.style.display = 'none';
        errorMessage.style.display = 'none';
        loadingMessage.style.display = 'block';

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();

        // Update UI with weather data
        document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('humidity').textContent = data.main.humidity + '%';
        document.getElementById('windSpeed').textContent = Math.round(data.wind.speed * 3.6) + ' km/h';
        
        const weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        weatherIcon.alt = data.weather[0].description;

        // Update main message based on weather
        const mainCondition = data.weather[0].main;
        document.getElementById('mainMessage').textContent = 
            weatherMessages[mainCondition] || weatherMessages.default;

        loadingMessage.style.display = 'none';
        weatherContent.style.display = 'block';

        // Get 5-day forecast
        getForecast(city);

    } catch (error) {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = 'City not found. Please try again.';
        errorMessage.style.display = 'block';
        console.error('Error fetching weather:', error);
    }
}

// Search button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Enter key press
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});

// Load default city on page load
window.addEventListener('load', () => {
    getWeather('Paris');
});
// Get elements
const formsWrapper = document.querySelector('.forms-wrapper');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

// Toggle to register form
if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        formsWrapper.classList.add('active');
    });
}

// Toggle to login form
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        formsWrapper.classList.remove('active');
    });
}

// Handle form submissions (you can customize this)
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formType = form.closest('.form-box').classList.contains('login') ? 'Login' : 'Sign Up';
        const inputs = form.querySelectorAll('input');
        
        let formData = {};
        inputs.forEach(input => {
            formData[input.placeholder] = input.value;
        });
        
        console.log(`${formType} Form Data:`, formData);
        
        // Show success message
        alert(`${formType} successful! (This is a demo)`);
        
        // You can add your own logic here, such as:
        // - Send data to a server
        // - Validate credentials
        // - Redirect to another page
    });
});

// Add input validation feedback
const inputs = document.querySelectorAll('input');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() === '' && input.hasAttribute('required')) {
            input.style.borderColor = '#ff6b6b';
        } else {
            input.style.borderColor = '#ddd';
        }
    });

    input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
            input.style.borderColor = '#51cf66';
        }
    });
});