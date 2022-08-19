function getFormattedCurrentDate() {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let date = now.getDate();
  return `${hour}:${minutes} - ${day}, ${date}/${month}`;
}

let currentDate = document.querySelector("#current-date");
currentDate.innerHTML = getFormattedCurrentDate();

let tempElement = document.querySelector("#current-temp");
let cityNameElement = document.querySelector("#main-city");
let inputElement = document.querySelector("#current-city");
let humidityElement = document.querySelector("#humidity");
let windSpeedElement = document.querySelector("#wind-speed");
let minTempElement = document.querySelector("#min-temp");
let maxTempElement = document.querySelector("#max-temp");
let weatherDescriptionElement = document.querySelector("#weather-description");
let weatherIconElement = document.querySelector("#weather-icon");

let form = document.querySelector("form");
form.addEventListener("submit", onUserInput);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", onUserInput);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", onDefineCurrentLocation);

function displayForecast(response) {
  let forecastElement = document.querySelector("#next-forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  days.forEach(function (day) {
    forecastHTML =
      forecastHTML +
      `
  <div class="col-2">
    <div class="next-forecast">
          <p>${day} <br />4/7</p></div>
          <p><i class="fa-solid fa-sun weather-pic"></i></p>
          <p>
            +25°C <br />
            <span class="min-temperature">+15°C</span>
          </p>
    </div>
  
        `;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function displayCurrentLocation() {
  navigator.geolocation.getCurrentPosition(applyLocationData);
}

function onDefineCurrentLocation(event) {
  event.preventDefault();
  displayCurrentLocation();
}

function applyLocationData(position) {
  let latitude = position.coords.latitude;
  let longtitude = position.coords.longitude;
  axios.get(getApiUrForLocation(latitude, longtitude)).then(applyWeatherData);
}

function getApiUrForLocation(latitude, longtitude) {
  return `${apiUrlBase}?lat=${latitude}&lon=${longtitude}&appid=${apiKey}&units=metric`;
}

let apiKey = "2b1c531b63a0a1bd70c91ee6eaa4b38b";
let apiUrlBase = "https://api.openweathermap.org/data/2.5/weather";

function onUserInput(event) {
  event.preventDefault();
  let input = inputElement.value;
  axios.get(getApiUrl(input)).then(applyWeatherData);
}

function getApiUrl(input) {
  return `${apiUrlBase}?q=${input}&appid=${apiKey}&units=metric`;
}

function getIconClass(weatherId) {
  let weatherIcons = [
    {
      groupId: "2XX",
      iconClassDay: "fa-cloud-bolt",
      iconClassNight: "fa-cloud-bolt",
    },
    {
      groupId: "3XX",
      iconClassDay: "fa-cloud-rain",
      iconClassNight: "fa-cloud-moon-rain",
    },
    {
      groupId: "5XX",
      iconClassDay: "fa-cloud-showers-heavy",
      iconClassNight: "fa-cloud-showers-heavy",
    },
    {
      groupId: "6XX",
      iconClassDay: "fa-snowflake",
      iconClassNight: "fa-snowflake",
    },
    { groupId: "7XX", iconClassDay: "fa-smog", iconClassNight: "fa-smog" },
    { groupId: "800", iconClassDay: "fa-sun", iconClassNight: "fa-moon" },
    {
      groupId: "80X",
      iconClassDay: "fa-cloud",
      iconClassNight: "fa-cloud-moon",
    },
  ];

  let groupId = null;
  if (weatherId === 800) groupId = "800";
  else if (weatherId >= 200 && weatherId < 300) groupId = "2XX";
  else if (weatherId >= 300 && weatherId < 400) groupId = "3XX";
  else if (weatherId >= 500 && weatherId < 600) groupId = "5XX";
  else if (weatherId >= 600 && weatherId < 700) groupId = "6XX";
  else if (weatherId >= 700 && weatherId < 800) groupId = "7XX";
  else if (weatherId > 800 && weatherId < 810) groupId = "80X";

  let foundWeatherIconObject = weatherIcons.find(
    (weatherIcon) => weatherIcon.groupId === groupId
  );

  let iconClass = null;
  let now = new Date();
  let hour = now.getHours();
  if (hour >= 21 || hour < 6) iconClass = foundWeatherIconObject.iconClassNight;
  else iconClass = foundWeatherIconObject.iconClassDay;
  return iconClass;
}

function getForecast(coordinates) {
  let apiKey = "2b1c531b63a0a1bd70c91ee6eaa4b38b";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function applyWeatherData(response) {
  celsiusTemperature = response.data.main.temp;
  tempElement.innerHTML = Math.round(celsiusTemperature);
  cityNameElement.innerHTML = response.data.name;
  currentDate.innerHTML = getFormattedCurrentDate();
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  minTempElement.innerHTML = Math.round(response.data.main.temp_min);
  maxTempElement.innerHTML = Math.round(response.data.main.temp_max);
  weatherDescriptionElement.innerHTML = response.data.weather[0].main;
  weatherIconElement.className = `fa-solid ${getIconClass(
    response.data.weather[0].id
  )} current-status`;

  getForecast(response.data.coord);
}

function convertTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  tempElement.innerHTML = Math.round(fahrenheitTemperature);
}

function customizeTemperature(event) {
  event.preventDefault();
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let cTempLink = document.querySelector("#celsius-temp");
let fTempLink = document.querySelector("#fahrenheit-temp");

fTempLink.addEventListener("click", convertTemperature);
cTempLink.addEventListener("click", customizeTemperature);

displayCurrentLocation();
