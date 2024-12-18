document.addEventListener('DOMContentLoaded', () => {
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const text = document.getElementsByClassName("text");
  const cityInput = document.getElementById("cityInput");
  const autoComplete = document.getElementById("autocomplete");
  cityInput.value = "";
  let isDarkMode = false;

  darkModeBtn.addEventListener("click", () => {
      isDarkMode = !isDarkMode;
      for (let i = 0; i < text.length; i++) {
          text[i].style.color = isDarkMode ? "white" : "#124ac2";
      }
      document.body.style.background = isDarkMode ? "black" : "linear-gradient(to top, #a2c2e9, #d7f1fd)";
  });

  const apiKey = '4d8fb5b93d4af21d66a2948710284366';

  function getSuggestions(q) {
      if (q.length < 2) return;
      const suggestUrl = `https://api.openweathermap.org/data/2.5/find?q=${q}&type=like&cnt=10&appid=${apiKey}`;
      fetch(suggestUrl)
          .then(response => response.json())
          .then(data => displaySuggestions(data.list))
          .catch(error => console.log(error));
  }

  function displaySuggestions(suggestions) {
      autoComplete.style.display = "block";
      autoComplete.innerHTML = "";
      suggestions.forEach(item => {
          const div = document.createElement('div');
          div.textContent = `${item.name}, ${item.sys.country}`;
          div.addEventListener('click', () => clickSuggestions(item));
          autoComplete.appendChild(div);
      });
  }

  function clickSuggestions(item) {
      cityInput.value = `${item.name}, ${item.sys.country}`;
      autoComplete.innerHTML = "";
      autoComplete.display = "none";
  }

  let timeout;
  cityInput.addEventListener("input", (event) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (cityInput.value === "") {
          autoComplete.style.display = "none";
        }
          getSuggestions(event.target.value);
      }, 200);  
  });

  function getWeatherByLocation() {
      const city = document.getElementById("cityInput").value;
      if (city.trim() === "") {
          alert("Please enter a city name.");
          return;
      }
      const getLocation = encodeURIComponent(city);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${getLocation}&appid=${apiKey}&units=metric`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              const temperature = data.main.temp;
              const weatherDescription = data.weather[0].description;

              const degrees = document.getElementById("degrees");
              const description = document.getElementById("description");
              const weatherImg = document.getElementById("weather-image");

              degrees.innerText = `Temperature: ${temperature}°C`;
              description.innerText = `Description: ${weatherDescription}`;

              const cloudy = ["overcast", "cloudy", "clouds", "fog", "foggy", "smoke"];
              const rainy = ["rain", "rainy", "drizzle", "shower", "showers"];
              const sunny = ["sun", "sunny", "sunshine", "clear"];
              const snowy = ["frost", "frosty", "snow", "snowy", "hail"];
              const stormy = ["storms", "storm", "thunder", "thunderbolts", "lightning"];
              const windy = ["wind", "windy", "breeze", "breezy"];

              const cloudyDay = new RegExp(cloudy.join("|"), "i");
              const rainyDay = new RegExp(rainy.join("|"), "i");
              const sunnyDay = new RegExp(sunny.join("|"), "i");
              const snowyDay = new RegExp(snowy.join("|"), "i");
              const stormyDay = new RegExp(stormy.join("|"), "i");
              const windyDay = new RegExp(windy.join("|"), "i");

              const descriptionText = weatherDescription.trim();

              if (cloudyDay.test(descriptionText)) {
                  weatherImg.style.display = "block";
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/91/91979.png";
              } else if (rainyDay.test(descriptionText)) {
                  weatherImg.src = "https://i.pinimg.com/564x/73/60/fc/7360fcf6fd40842cad410f8d147d1f8b.jpg";
                  weatherImg.style.display = "block";
              } else if (sunnyDay.test(descriptionText)) {
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/3917/3917805.png";
                  weatherImg.style.display = "block";
              } else if (snowyDay.test(descriptionText)) {
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/11845/11845405.png";
                  weatherImg.style.display = "block";
              } else if (stormyDay.test(descriptionText)) {
                  weatherImg.src = "https://cdn0.iconfinder.com/data/icons/cloudy-2/425/thunder-512.png";
                  weatherImg.style.display = "block";
              } else if (windyDay.test(descriptionText)) {
                weatherImg.src = "https://www.clipartmax.com/png/middle/59-593346_wind-clipart-weather-symbol-windy-weather-icon.png";
              } else {
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/9393/9393425.png";
                  weatherImg.style.display = "block";
              }
          })
          .catch(error => {
              console.error("Error fetching weather data:", error);
          });
  }

  const searchButton = document.getElementById("button");
  searchButton.addEventListener("click", getWeatherByLocation);
});
