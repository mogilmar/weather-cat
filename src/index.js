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

let weatherGroupDataCollection = [
  {
    groupId: "2XX",
    iconClassDay: "fa-cloud-bolt",
    iconClassNight: "fa-cloud-bolt",
    backgroundDay: {
      video: "videos/Trees - 107911.mp4",
      colorPrimary: "floralwhite",
      colorSecondary: "floralwhite",
      mixBlendMode: "screen",
    },
    backgroundNight: {
      video: "videos/storm (fa-cloud-bolt)-night.mp4",
      colorPrimary: "khaki",
      colorSecondary: "aliceblue",
      mixBlendMode: "plus-lighter",
    },
  },
  {
    groupId: "3XX",
    iconClassDay: "fa-cloud-rain",
    iconClassNight: "fa-cloud-moon-rain",
    backgroundDay: {
      video: "videos/rain-day.mp4",
      colorPrimary: "grey",
      colorSecondary: "lightgrey",
      mixBlendMode: "difference",
    },
    backgroundNight: {
      video: "videos/Rain - 28236.mp4",
      colorPrimary: "aliceblue",
      colorSecondary: "aliceblue",
      mixBlendMode: "screen",
    },
  },
  {
    groupId: "5XX",
    iconClassDay: "fa-cloud-showers-heavy",
    iconClassNight: "fa-cloud-showers-heavy",
    backgroundDay: {
      video: "videos/showers-heavy-day.mp4",
      colorPrimary: "honeydew",
      colorSecondary: "honeydew",
      mixBlendMode: "screen",
    },
    backgroundNight: {
      video: "videos/showers-heavy-night.mp4",
      colorPrimary: "aliceblue",
      colorSecondary: "aliceblue",
      mixBlendMode: "screen",
    },
  },
  {
    groupId: "6XX",
    iconClassDay: "fa-snowflake",
    iconClassNight: "fa-snowflake",
    backgroundDay: {
      video: "videos/snowing-day.mp4",
      colorPrimary: "aliceblue",
      colorSecondary: "aliceblue",
      mixBlendMode: "plus-lighter",
    },
    backgroundNight: {
      video: "videos/Snow - 7605.mp4",
      colorPrimary: "snow",
      colorSecondary: "snow",
      mixBlendMode: "screen",
    },
  },
  {
    groupId: "7XX",
    iconClassDay: "fa-smog",
    iconClassNight: "fa-smog",
    backgroundDay: {
      video: "videos/Fog_ahead_of_Forest_2.mp4",
      colorPrimary: "snow",
      colorSecondary: "snow",
      mixBlendMode: "difference",
    },
    backgroundNight: {
      video: "videos/Fog_ahead_of_Forest_1.mp4",
      colorPrimary: "snow",
      colorSecondary: "snow",
      mixBlendMode: "difference",
    },
  },
  {
    groupId: "800",
    iconClassDay: "fa-sun",
    iconClassNight: "fa-moon",
    backgroundDay: {
      video: "videos/Rainbow - 21460.mp4",
      colorPrimary: "darkgrey",
      colorSecondary: "lightgrey",
      mixBlendMode: "difference",
    },
    backgroundNight: {
      video: "videos/Starry Sky - 14955.mp4",
      colorPrimary: "aliceblue",
      colorSecondary: "antiquewhite",
      mixBlendMode: "difference",
    },
  },
  {
    groupId: "80X",
    iconClassDay: "fa-cloud",
    iconClassNight: "fa-cloud-moon",
    backgroundDay: {
      video: "videos/cloud-sun.mp4",
      colorPrimary: "floralwhite",
      colorSecondary: "floralwhite",
      mixBlendMode: "screen",
    },
    backgroundNight: {
      video: "videos/Beach - 51923.mp4",
      colorPrimary: "slateblue",
      colorSecondary: "azure",
      mixBlendMode: "difference",
    },
  },
];

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
let videoBackgroundElement = document.querySelector("#background");
let videoElement = document.querySelector("#myVideo");

let form = document.querySelector("form");
form.addEventListener("submit", onUserInput);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", onUserInput);

let locationButton = document.querySelector("#location-button");
locationButton.addEventListener("click", onDefineCurrentLocation);

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function formatForecastDate(timestamp) {
  let parsedDate = new Date(timestamp * 1000);
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
  let date = parsedDate.getDate();
  let month = months[parsedDate.getMonth()];

  return `${date}/${month}`;
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#next-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 7 && index > 0) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col-2">
    <div class="next-forecast">
          <p>${formatDay(forecastDay.dt)} <br />${formatForecastDate(
          forecastDay.dt
        )}</p></div>
          <p> <i
              class="fa-solid ${getIconClassDay(
                forecastDay.weather[0].id
              )} current-status"
              id="weather-icon"
            ></i>
          
          </p>
          <p>
            ${formatTemperature(forecastDay.temp.max)}°C <br />
            <span class="min-temperature">${formatTemperature(
              forecastDay.temp.min
            )}°C</span>
          </p>
    </div>
        `;
    }
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
  applyApiSearh(getApiUrlForLocation(latitude, longtitude));
}

function getApiUrlForLocation(latitude, longtitude) {
  return `${apiUrlBase}?lat=${latitude}&lon=${longtitude}&appid=${apiKey}&units=metric`;
}

let apiKey = "2b1c531b63a0a1bd70c91ee6eaa4b38b";
let apiUrlBase = "https://api.openweathermap.org/data/2.5/weather";

function applyApiSearh(inputUrl) {
  axios.get(inputUrl).then(function (weatherResponse) {
    let coordinates = weatherResponse.data.coord;
    let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
    axios.get(forecastApiUrl).then(function (forecastResponse) {
      console.log(weatherResponse);
      console.log(forecastResponse);
      applyWeatherData(weatherResponse);
      displayForecast(forecastResponse);
      applyBackground(weatherResponse);
    });
  });
}

function onUserInput(event) {
  event.preventDefault();
  let input = inputElement.value;
  applyApiSearh(getApiUrl(input));
}

function applyBackground(response) {
  let weatherGroupData = getWeatherGroupData(response.data.weather[0].id);

  let background = null;
  if (isNowDay()) {
    background = weatherGroupData.backgroundDay;
  } else {
    background = weatherGroupData.backgroundNight;
  }

  // todo: delete after debug
  //background = weatherGroupDataCollection[6].backgroundNight;

  applyElementsColorSchema(background);

  videoBackgroundElement.setAttribute("src", background.video);
  videoElement.load();
  videoElement.play();
}

function applyElementsColorSchema(background) {
  let headerElements = document.querySelectorAll("h6");
  let pElements = document.querySelectorAll("p");
  /*let tempElements = document.querySelectorAll(
    "#celsius-temp, #fahrenheit-temp"
  );*/
  let currentTemperatureElement = document.querySelector(
    ".current-temperature"
  );
  let mainInformationElement = document.querySelector(".main-information");

  headerElements.forEach(function (element, index) {
    element.style.color = background.colorPrimary;
    element.style.mixBlendMode = background.mixBlendMode;
  });
  pElements.forEach(function (element, index) {
    if (element.id == "current-temp-p") return;
    element.style.color = background.colorSecondary;
    element.style.mixBlendMode = background.mixBlendMode;
  });
  /*tempElements.forEach(function (element, index) {
    element.style.color = background.colorSecondary;
  });*/
  currentTemperatureElement.style.backgroundColor = background.colorSecondary;
  mainInformationElement.style.mixBlendMode = background.mixBlendMode;
}

function getWeatherGroupData(weatherId) {
  let groupId = getWeatherGroupId(weatherId);
  let weatherGroupData = weatherGroupDataCollection.find(
    (weatherGroupData) => weatherGroupData.groupId === groupId
  );
  return weatherGroupData;
}

function fakeInput() {
  let input = "Lviv";
  applyApiSearh(getApiUrl(input));
}

function getApiUrl(input) {
  return `${apiUrlBase}?q=${input}&appid=${apiKey}&units=metric`;
}

function getWeatherGroupId(weatherId) {
  let groupId = null;
  if (weatherId === 800) groupId = "800";
  else if (weatherId >= 200 && weatherId < 300) groupId = "2XX";
  else if (weatherId >= 300 && weatherId < 400) groupId = "3XX";
  else if (weatherId >= 500 && weatherId < 600) groupId = "5XX";
  else if (weatherId >= 600 && weatherId < 700) groupId = "6XX";
  else if (weatherId >= 700 && weatherId < 800) groupId = "7XX";
  else if (weatherId > 800 && weatherId < 810) groupId = "80X";
  return groupId;
}

function getIconClass(weatherId, isDay) {
  let weatherGroupData = getWeatherGroupData(weatherId);

  let iconClass = null;
  if (isDay) {
    iconClass = weatherGroupData.iconClassDay;
  } else {
    iconClass = weatherGroupData.iconClassNight;
  }
  return iconClass;
}

function getIconClassDay(weatherId) {
  return getIconClass(weatherId, true);
}

function isNowDay() {
  let isDay = true;
  let now = new Date();
  let hour = now.getHours();
  if (hour >= 21 || hour < 6) {
    isDay = false;
  } else {
    isDay = true;
  }
  return isDay;
}

function getIconClassCurrentTime(weatherId) {
  return getIconClass(weatherId, isNowDay());
}

function applyWeatherData(response) {
  celsiusTemperature = response.data.main.temp;
  tempElement.innerHTML = formatTemperature(response.data.main.temp);
  cityNameElement.innerHTML = response.data.name;
  currentDate.innerHTML = getFormattedCurrentDate();
  humidityElement.innerHTML = response.data.main.humidity;
  windSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  minTempElement.innerHTML = formatTemperature(response.data.main.temp_min);
  maxTempElement.innerHTML = formatTemperature(response.data.main.temp_max);
  weatherDescriptionElement.innerHTML = response.data.weather[0].main;
  weatherIconElement.className = `fa-solid ${getIconClassCurrentTime(
    response.data.weather[0].id
  )} current-status`;
}

function formatTemperature(temp) {
  if (temp > 0) {
    return `+${Math.round(temp)}`;
  } else {
    return Math.round(temp);
  }
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

fakeInput();
