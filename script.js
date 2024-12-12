var degrees = document.getElementById("degrees");
var currentLocation = document.getElementById("current-location");
var description = document.getElementById("description")
var weatherImg = document.getElementById("weather-image").src;
// console.log(weatherImg);

if ("geolocation" in navigator) {
    console.log("Location is available!");
  
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
  
      console.log("Latitude: " + latitude);
      console.log("Longitude: " + longitude);
  
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
        degrees.innerHTML = `Temperature: ${temperature}°C`;
        description.innerHTML = `Description: ${weatherDescription}`;
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
      });
  }
  
  if (description.includes("overcast")) {
    weatherImg = "Cloudy.png";
  } else if (description.includes("rain")) {
    weatherImg = "Rainy.png";
  } else if (description.includes("sun")) {
    weatherImg = "Sunny.png";
  } else if (description.includes("snow")) {
    weatherImg = "Snowy.png";
  } else if (description.includes("storm")) {
    weatherImg = "Stormy.png";
  } else {
    weatherImg = "Sunny & Cloudy.png";
  }