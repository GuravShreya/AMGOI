// Your OpenWeatherMap API key (replace with your own key)
const API_KEY = "7baedf95c394f45accb45ff5053d8092";  // Replace with your actual API key

// Elements
const locationInput = document.getElementById('location-input');
const searchButton = document.getElementById('search-button');
const weatherOutput = document.getElementById('weather-output');
const autocompleteList = document.getElementById('autocomplete-list');

// Event Listener for search button
searchButton.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeather(location);
    }
});

// Function to fetch weather data
async function getWeather(location) {

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod === 200) {
            displayWeather(data);
        } else {
            weatherOutput.innerHTML = `<p>Location not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        weatherOutput.innerHTML = `<p>There was an error fetching the weather data. Please try again later.</p>`;
    }
}

// Function to display weather data
function displayWeather(data) {
    const { name, weather, main, wind } = data;
    const weatherDescription = weather[0].description;
    const temperature = main.temp;
    const humidity = main.humidity;
    const windSpeed = wind.speed;

    weatherOutput.innerHTML = `
        <h3>Weather in ${name}</h3>
        <p><strong>Description:</strong> ${weatherDescription}</p>
        <p><strong>Temperature:</strong> ${temperature}°C</p>
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
    `;
}

// Autocomplete functionality (optional)
locationInput.addEventListener('input', () => {
    const query = locationInput.value.trim();
    if (query.length > 0) {
        fetchAutocompleteSuggestions(query);
    } else {
        autocompleteList.innerHTML = '';
    }
});

// Fetch autocomplete suggestions
async function fetchAutocompleteSuggestions(query) {
    const url = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        autocompleteList.innerHTML = '';

        if (data.list) {
            data.list.forEach(item => {
                const div = document.createElement('div');
                div.innerText = item.name;
                div.addEventListener('click', () => {
                    locationInput.value = item.name;
                    getWeather(item.name);
                    autocompleteList.innerHTML = '';
                });
                autocompleteList.appendChild(div);
            });
        }
    } catch (error) {
        console.error('Error fetching autocomplete data:', error);
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    weatherOutput.innerHTML = `
    <p>Location: ${name}</p>
    <p>Temperature: ${main.temp} *c</p>
    <p>Weather: ${weather[0].description}</p>
    <p>Humidity: ${main.humidity}%</p>
    `;
}