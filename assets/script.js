var apiKey = "849fb5d2f364ca626c95b52ce4d691be";
var searchbtn = document.getElementById("sub-btn");

var searchForm = document.getElementById('search-form');
var cityInput = document.getElementById('mySearch');
var historyDiv = document.getElementById('history');
var currentCityDisplay = document.getElementById('displayCity');
var weatherInfoDiv = document.getElementById('weatherInfo');
var forecastItemsDiv = document.getElementById('forecastItemsDiv');

// Load search history from local storage
window.addEventListener('load', function() {
  var searchHistory = localStorage.getItem('searchHistory');
  if (searchHistory) {
    historyDiv.innerHTML = searchHistory;
    addHistoryItemClickListeners();
  }
});

// Save search history to local storage
function saveSearchHistory() {
  localStorage.setItem('searchHistory', historyDiv.innerHTML);
}

function searchCity() {
  var city = cityInput.value.trim();
  var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + apiKey;
  fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var selectedCity = data[0];
      getWeatherData(selectedCity);
    });
}

function getWeatherData(cityData) {
  var lat = cityData.lat;
  var lon = cityData.lon;
  var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';
  var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey + '&units=metric';

  fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
      addCityToHistory(data.name);
    })
    .catch(error => {
      console.log(error);
      alert('Unable to fetch current weather data. Please try again.');
    });

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
    })
    .catch(error => {
      console.log(error);
      alert('Unable to fetch forecast data. Please try again.');
    });
}

function convertToFahrenheit(celsius) {
  var fahrenheit = (celsius * 9) / 5 + 32;
  return fahrenheit.toFixed(2);
}

function displayCurrentWeather(data) {
  var cityName = data.name;
  var temperature = convertToFahrenheit(data.main.temp);
  var windSpeed = data.wind.speed;
  var humidity = data.main.humidity;
  var weatherIcon = data.weather[0].icon; // Get the weather icon code

  currentCityDisplay.textContent = cityName;
  cityInput.value = ''; // Clear the search field

  var temperatureElement = document.createElement('div');
  temperatureElement.textContent = 'Temperature: ' + temperature + '°F';

  var windElement = document.createElement('div');
  windElement.textContent = 'Wind Speed: ' + windSpeed + ' m/s';

  var humidityElement = document.createElement('div');
  humidityElement.textContent = 'Humidity: ' + humidity + '%';

  var weatherIconElement = document.createElement('img'); // Create an image element for the weather icon
  weatherIconElement.src = 'http://openweathermap.org/img/w/' + weatherIcon + '.png'; // Set the source of the image to the weather icon URL

  weatherInfoDiv.innerHTML = '';

  weatherInfoDiv.appendChild(temperatureElement);
  weatherInfoDiv.appendChild(windElement);
  weatherInfoDiv.appendChild(humidityElement);
  weatherInfoDiv.appendChild(weatherIconElement); // Append the weather icon to the weather info div
}

function displayForecast(data) {
  var forecastItems = data.list.slice(0, 5); // Get the first 5 forecast items

  forecastItemsDiv.innerHTML = '';

  forecastItems.forEach(function(item, index) {
    var forecastDate = new Date(item.dt * 1000); // Convert timestamp to date
    var forecastTemperature = convertToFahrenheit(item.main.temp);
    var forecastWindSpeed = item.wind.speed;
    var forecastHumidity = item.main.humidity;
    var forecastWeatherIcon = item.weather[0].icon; // Get the weather icon code

    var forecastItemElement = document.createElement('div');
    forecastItemElement.classList.add('col-lg-2', 'wireframe1', 'forecast-item');

    var forecastDateElement = document.createElement('h4');
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + index + 1);
    forecastDateElement.textContent = 'Day ' + (index + 1) + ': ' + nextDate.toLocaleDateString();

    var forecastTemperatureElement = document.createElement('p');
    forecastTemperatureElement.textContent = 'Temperature: ' + forecastTemperature + '°F';

    var forecastWindElement = document.createElement('p');
    forecastWindElement.textContent = 'Wind Speed: ' + forecastWindSpeed + ' m/s';

    var forecastHumidityElement = document.createElement('p');
    forecastHumidityElement.textContent = 'Humidity: ' + forecastHumidity + '%';

    var forecastWeatherIconElement = document.createElement('img'); // Create an image element for the weather icon
    forecastWeatherIconElement.src = 'http://openweathermap.org/img/w/' + forecastWeatherIcon + '.png'; // Set the source of the image to the weather icon URL

    forecastItemElement.appendChild(forecastDateElement);
    forecastItemElement.appendChild(forecastTemperatureElement);
    forecastItemElement.appendChild(forecastWindElement);
    forecastItemElement.appendChild(forecastHumidityElement);
    forecastItemElement.appendChild(forecastWeatherIconElement); // Append the weather icon to the forecast item

    forecastItemsDiv.appendChild(forecastItemElement);
  });
}


function addCityToHistory(cityName) {
  var historyItem = document.createElement('button');
  historyItem.textContent = cityName;
  historyItem.classList.add('history-item');

  // Check if the city already exists in the search history
  var existingCities = Array.from(historyDiv.getElementsByTagName('button'));
  var cityExists = existingCities.some(function(item) {
    return item.textContent === cityName;
  });

  if (!cityExists) {
    historyItem.addEventListener('click', function() {
      clearWeatherInfo(); // Clear previous weather information
      searchCityFromHistory(cityName); // Search and display weather for the selected city from history
    });

    historyDiv.appendChild(historyItem);
    saveSearchHistory(); // Save updated search history to local storage
  }
}

function addHistoryItemClickListeners() {
  var historyItems = historyDiv.getElementsByTagName('button');
  Array.from(historyItems).forEach(function(item) {
    item.addEventListener('click', function() {
      var cityName = item.textContent;
      clearWeatherInfo(); // Clear previous weather information
      searchCityFromHistory(cityName); // Search and display weather for the selected city from history
    });
  });
}

function searchCityFromHistory(cityName) {
  var geoUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;
  fetch(geoUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var selectedCity = data[0];
      getWeatherData(selectedCity);
    });
}

function clearWeatherInfo() {
  currentCityDisplay.textContent = '';
  weatherInfoDiv.innerHTML = '';
  forecastItemsDiv.innerHTML = '';
}

searchbtn.addEventListener("click", searchCity);





