const apiKey = 'ddd5b1b203d5e3b5696961faf83200dd';

document.getElementById('city-search').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cityInput = document.getElementById('city-search-input').value;
    getCoordinates(cityInput)
        .then(coords => getWeatherData(coords.lat, coords.lon))
        .then(weatherData => {
            displayWeather(weatherData);
        })
        .catch(error => {
            console.error('Error:', error);
            displayError('City not found. Please try again.');
        });
});