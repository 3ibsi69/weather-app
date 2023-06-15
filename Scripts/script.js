const findMyState = () => {
  return new Promise((resolve, reject) => {
    const success = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const geoUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
      fetch(geoUrl)
        .then((response) => response.json())
        .then((data) => {
          const country = data.countryName;
          resolve(country);
        })
        .catch(reject);
    };

    const error = (err) => {
      reject(err);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  });
};

window.addEventListener("DOMContentLoaded", async () => {
  const cityname = document.querySelector(".city");
  const temp = document.querySelector(".temp");
  const weather = document.querySelector(".weather");
  const weatherPic = document.querySelector(".weather-pic");
  const windNb = document.querySelector(".wind-nb");
  const humidityNb = document.querySelector(".humidity-nb");
  const apikey = "04ea0d4bb12c89740b0be1b440d90ec5";
  const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric";
  const searchSelect = document.querySelector(".search-select");

  fetch("https://restcountries.com/v3.1/all")
    .then((response) => response.json())
    .then((data) => {
      findMyState()
        .then((country) => {
          const option = document.createElement("option");
          option.textContent = country;
          searchSelect.appendChild(option);
          getWeatherData(country);
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      data.sort((a, b) => a.name.common.localeCompare(b.name.common)); // Sort options alphabetically

      data.forEach((country) => {
        const option = document.createElement("option");
        option.textContent = country.name.common;
        searchSelect.appendChild(option);
      });
    })
    .catch((err) => {
      console.log("Error:", err);
    });

  async function getWeatherData(city) {
    const response = await fetch(apiUrl + `&q=${city}` + `&appid=${apikey}`);
    var data = await response.json();
    cityname.innerHTML = data.name;
    temp.innerHTML = Math.round(data.main.temp) + "°C";
    humidityNb.innerHTML = data.main.humidity + " %";
    windNb.innerHTML = data.wind.speed + " km/h";
    weather.innerHTML = data.weather[0].description;

    if (data.weather[0].main == "Clear") {
      weatherPic.src = "../pics/clear.png";
    } else if (data.weather[0].main == "Clouds") {
      weatherPic.src = "../pics/clouds.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherPic.src = "../pics/drizzle.png";
    } else if (data.weather[0].main == "Mist") {
      weatherPic.src = "../pics/mist.png";
    } else if (data.weather[0].main == "Rain") {
      weatherPic.src = "../pics/rain.png";
    } else if (data.weather[0].main == "Snow") {
      weatherPic.src = "../pics/snow.png";
    }

    document.querySelector(".all-info").style.display = "block";
  }

  searchSelect.addEventListener("change", (e) => {
    getWeatherData(e.target.value);
  });
});
