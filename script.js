document.addEventListener('DOMContentLoaded', () => {
    const darkModeBtn = document.getElementById("dark-mode-toggle");
    const text = document.getElementsByClassName("text");
    const cityInput = document.getElementById("cityInput");
    cityInput.value = "";
    let isDarkMode = false;
    darkModeBtn.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        for (let i = 0; i < text.length; i++) {
            text[i].style.color = isDarkMode ? "white" : "#124ac2";
        }
        document.body.style.background = isDarkMode ? "black" : "linear-gradient(to top, #a2c2e9, #d7f1fd)";
    });
});

function getWeatherByLocation() {
    const city = document.getElementById("cityInput").value;
    if (city.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
  
    const apiKey = '4d8fb5b93d4af21d66a2948710284366';
    const thingyLocation = encodeURIComponent(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${thingyLocation}&appid=${apiKey}&units=metric`;
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
  
        const cloudy = ["overcast", "cloudy", "clouds"];
        const rainy = ["rain", "rainy", "drizzle"];
        const sunny = ["sun", "sunny", "sunshine", "clear"];
        const snowy = ["frost", "frosty", "snow", "snowy", "hail"];
        const stormy = ["storms", "storm", "thunder", "thunderbolts", "lightning"];
  
        const cloudyDay = new RegExp(cloudy.join("|"), "i");
        const rainyDay = new RegExp(rainy.join("|"), "i");
        const sunnyDay = new RegExp(sunny.join("|"), "i");
        const snowyDay = new RegExp(snowy.join("|"), "i");
        const stormyDay = new RegExp(stormy.join("|"), "i");
  
        const descriptionText = weatherDescription.trim();
  
        if (cloudyDay.test(descriptionText)) {
          weatherImg.style.display = "block";
          weatherImg.src = "Cloudy.png";
        } else if (rainyDay.test(descriptionText)) {
          weatherImg.src = "Rainy.png";
          weatherImg.style.display = "block";
        } else if (sunnyDay.test(descriptionText)) {
          weatherImg.src = "Sunny.png";
          weatherImg.style.display = "block";
        } else if (snowyDay.test(descriptionText)) {
          weatherImg.src = "Snowy.png";
          weatherImg.style.display = "block";
        } else if (stormyDay.test(descriptionText)) {
          weatherImg.src = "Stormy.png";
          weatherImg.style.display = "block";
        } else {
          weatherImg.src = "Sunny & Cloudy.png";
          weatherImg.style.display = "block";
        }
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
      });
  }
  
  const searchButton = document.getElementById("button");
  searchButton.addEventListener("click", getWeatherByLocation);