const apiKey = 'ddd5b1b203d5e3b5696961faf83200dd';

document.getElementById('city-search').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cityInput = document.getElementById('city-search-input').value;
    saveSearch(cityInput);
    getCoordinates(cityInput)
        .then(coords => getWeatherData(coords.lat, coords.lon))
        .then(weatherData => {
            displayWeather(weatherData);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('City not found. Please try again.');
        });
});

function saveSearch(city) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    
    if (!searches.includes(city)) {
        searches.push(city);
        localStorage.setItem('searches', JSON.stringify(searches));
        displaySearches();
    }
}

function displaySearches() {
    const sidebar = document.querySelector('.side-bar');
    const searchForm = document.getElementById('city-search');
    sidebar.appendChild(searchForm);
    
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    
    searches.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.classList.add('search-button');
        
       
        cityButton.addEventListener('click', function() {
            getCoordinates(city)
                .then(coords => getWeatherData(coords.lat, coords.lon))
                .then(weatherData => {
                    displayWeather(weatherData);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('City not found. Please try again.');
                });
        });
        
        sidebar.appendChild(cityButton);
    });
}


window.onload = displaySearches;
function getCoordinates(city) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    return fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon } = data[0];
                return { lat, lon };
            } else {
                throw new Error('City not found');
            }
        });
}

function getWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    return fetch(weatherUrl)
        .then(response => response.json());
}

function displayWeather (weatherData) {
    const weatherContainer = document.getElementById('weather-information');
    weatherContainer.innerHTML = '';
    const city = weatherData.city.name;
    const currentWeather = weatherData.list[0];
    const currentWeatherHTML = '<h2>' + city + '</h2>' +
    '<p>Date: ' + new Date(currentWeather.dt_txt).toLocaleDateString() + '</p>' +
    '<p>Temperature: ' + currentWeather.main.temp + ' °C</p>' +
    '<p>Humidity: ' + currentWeather.main.humidity + '%</p>' +
    '<p>Wind Speed: ' + currentWeather.wind.speed + ' m/s</p>' +
    '<p>Weather: ' + currentWeather.weather[0].description + '</p>';

weatherContainer.innerHTML = currentWeatherHTML;

const forecast = [];
for (let i = 0; i < weatherData.list.length; i += 8) {
    forecast.push(weatherData.list[i]);
}

forecast.forEach(function(day) {
    const dayHTML = '<div class="forecast-day">' +
        '<p>Date: ' + new Date(day.dt_txt).toLocaleDateString() + '</p>' +
        '<p>Temperature: ' + day.main.temp + ' °C</p>' +
        '<p>Humidity: ' + day.main.humidity + '%</p>' +
        '<p>Wind Speed: ' + day.wind.speed + ' m/s</p>' +
        '<p>Weather: ' + day.weather[0].description + '</p>' +
        '</div>';
    
    weatherContainer.innerHTML += dayHTML;
});
}