const autoComplete = document.getElementById("autocomplete");
const cityInput = document.getElementById("cityInput");
document.addEventListener('DOMContentLoaded', () => {
  cityInput.value = "";
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const text = document.getElementsByClassName("text");
  
  let isDarkMode = false;
  darkModeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
      for (let i = 0; i < text.length; i++) {
          text[i].style.color = isDarkMode ? "white" : "#124ac2";
          text[i].style.textShadow = isDarkMode ? "0 0 2rem black" : "none";
      }
      document.body.style.transition = "background-image 3s ease";
      document.body.style.setProperty("background-image", isDarkMode ? 
        "linear-gradient(90deg,rgb(19, 43, 127),rgb(60, 59, 158))" 
      : "linear-gradient(to top, #98c6ff, #d4f2ff)");

      document.getElementById("weather").style.backgroundColor = isDarkMode 
        ? "rgba(255, 255, 255, 0.9)" 
        : "rgba(255, 255, 255, 0.9)";
  });
});


  const apiKey = '4d8fb5b93d4af21d66a2948710284366';

  function getSuggestions(q) {
    if (q.length < 2) return;
    const suggestUrl = `https://api.openweathermap.org/data/2.5/find?q=${q}&type=like&cnt=10&appid=${apiKey}`;
    fetch(suggestUrl)
      .then(response => response.json())
      .then(data => {
          if (data.list.length === 0) {
              displaySuggestions([], true)
          } else {
              displaySuggestions(data.list);
          }
      })
      .catch(error => { 
          console.log(error); 
      });
}

function displaySuggestions(suggestions, notFound) {
    notFound = notFound || false;
    autoComplete.style.display = "block";
    autoComplete.innerHTML = "";
    if (notFound) {
        autoComplete.innerHTML = `${cityInput.value} is not a location`;
    } else {
        suggestions.forEach(item => {
            const div = document.createElement('div');
            div.textContent = `${item.name}, ${item.sys.country}`;
            div.addEventListener('click', () => clickSuggestions(item));
            autoComplete.appendChild(div);
        });
    }
}

 
  function clickSuggestions(item) {
      cityInput.value = `${item.name}, ${item.sys.country}`;
      autoComplete.innerHTML = "";
      autoComplete.style.display = "none";
  }

  let timeout;
  cityInput.addEventListener("input", (event) => {
      autoComplete.innerHTML = "Loading...";
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
      if (cityInput.value.trim() === "") {
          cityInput.style.backgroundColor = "#ffecf3";
          cityInput.style.border = "1px solid #ffc4da";
          cityInput.placeholder = "You live somewhere, right?";
          cityInput.oninput = () => {
            cityInput.style.backgroundColor = "white";
            cityInput.style.border = "1px solid #124ac2";
            cityInput.placeholder = "e.g. Paris";
        };
          return;
      }
      const getLocation = encodeURIComponent(city);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${getLocation}&appid=${apiKey}&units=metric`;

      fetch(url)
          .then(response => response.json())
          .then(data => {
              const temperature = data.main.temp;
              const sunrise = data.sys.sunrise;
              const sunset = data.sys.sunset;
              const userTime = Math.floor(Date.now() / 1000) + data.timezone;
              const weatherDescription = data.weather[0].description;
              
              const degrees = document.getElementById("degrees");
              const description = document.getElementById("description");
              const weatherImg = document.getElementById("weather-image");
              document.getElementById("src").href = url;
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
              } else if (sunnyDay.test(descriptionText)) {
                if (userTime >= sunrise && userTime <= sunset) {
                    weatherImg.src = "https://cdn-icons-png.flaticon.com/512/3917/3917805.png";
                    weatherImg.style.display = "block";
                  } else {
                    weatherImg.src = "https://img.freepik.com/free-vector/yellow-crescent-geometric-shape-vector_53876-164618.jpg?w=360";
                      weatherImg.style.display = "block";
                    }  
              } else if (snowyDay.test(descriptionText)) {
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/11845/11845405.png";
                  weatherImg.style.display = "block";
              } else if (stormyDay.test(descriptionText)) {
                  weatherImg.src = "https://cdn0.iconfinder.com/data/icons/cloudy-2/425/thunder-512.png";
                  weatherImg.style.display = "block";
              } else if (windyDay.test(descriptionText)) {
                weatherImg.src = "https://www.clipartmax.com/png/middle/59-593346_wind-clipart-weather-symbol-windy-weather-icon.png";
              } else if (descriptionText.includes("clear sky")) {
                  weatherImg.src = "https://cdn-icons-png.flaticon.com/512/4148/4148193.png";
                  weatherImg.style.display = "block";

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
  searchButton.addEventListener("click", () => { 
    getWeatherByLocation();
    autoComplete.style.display = "none";
 });
