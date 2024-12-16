document.addEventListener('DOMContentLoaded', () => {
  const darkModeBtn = document.getElementById("dark-mode-toggle");
  const text = document.getElementsByClassName("text");

 let isDarkMode = false;
  darkModeBtn.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    for (let i = 0; i < text.length; i++) {
      text[i].style.color = isDarkMode ? "white" : "#124ac2";
    }
    document.body.style.background = isDarkMode ? "black" : "linear-gradient(to top, #a2c2e9, #d7f1fd)";
  });
});



if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        getWeatherByCoordinates(latitude, longitude);
    }, function(error) {
        console.error("Error getting location:", error);
    });
} else {
    console.log("Location is not supported by this browser.");
}

function getWeatherByCoordinates(lat, lon) {
    const apiKey = '4d8fb5b93d4af21d66a2948710284366';
    const units = 'metric';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;

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
                weatherImg.src = "Cloudy.png";
            } else if (rainyDay.test(descriptionText)) {
                weatherImg.src = "Rainy.png";
            } else if (sunnyDay.test(descriptionText)) {
                weatherImg.src = "Sunny.png";
            } else if (snowyDay.test(descriptionText)) {
                weatherImg.src = "Snowy.png";
            } else if (stormyDay.test(descriptionText)) {
                weatherImg.src = "Stormy.png";
            } else {
                weatherImg.src = "Sunny & Cloudy.png"; 
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}
