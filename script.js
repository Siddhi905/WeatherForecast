const url = 'https://yahoo-weather5.p.rapidapi.com/weather?location=';
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '2706a935b1msh9d7docde0b7e93fp119262jsn38fc9a01b187',  // Replace with your actual key
        'x-rapidapi-host': 'yahoo-weather5.p.rapidapi.com'
    }
};

// Function to format the date in a readable format (e.g., Monday, Feb 1)
const formatDate = (dateStr) => {
    const date = new Date(dateStr * 1000);  // Convert Unix timestamp to JavaScript Date object
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

// Function to display 7-day forecast
const displayForecast = (forecast) => {
    const forecastContainer = document.getElementById("forecast-cards");
    forecastContainer.innerHTML = ""; // Clear any existing forecast cards

    forecast.forEach(day => {
        const dayCard = document.createElement("div");
        dayCard.classList.add("col-md-2", "mb-4");

        // Call formatDate to format the date properly
        const formattedDate = formatDate(day.date);

        dayCard.innerHTML = `
            <div class="card shadow-sm">
                <div class="card-header">
                    <h5 class="card-title">${formattedDate}</h5>
                </div>
                <div class="card-body">
                    <p class="card-text">Temp: ${day.high}°F / ${day.low}°F</p>
                    <p class="card-text">Condition: ${day.text}</p>
                </div>
            </div>
        `;

        forecastContainer.appendChild(dayCard);
    });
};

// Function to fetch weather data
const getWeather = (city) => {
    document.getElementById("loader").style.display = "block";
    document.getElementById("city-name").innerHTML = `Weather for ${city}`;

    fetch(url + city + '&format=json&u=f', options)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loader").style.display = "none";

            console.log("Full Response:", data);

            // Display location
            const cityName = data.location.city;
            const country = data.location.country;
            document.getElementById("city-name").innerHTML = `Weather for ${cityName}, ${country}`;

            // Display current temperature and condition
            const temperature = data.current_observation.condition.temperature;
            const conditionText = data.current_observation.condition.text;
            document.getElementById("temperature").innerHTML = `Temperature: ${temperature}°F`;
            document.getElementById("condition").innerHTML = `Condition: ${conditionText}`;

            // Display wind details
            const windSpeed = data.current_observation.wind.speed;
            const windDirection = data.current_observation.wind.direction;
            document.getElementById("wind").innerHTML = `Wind: ${windSpeed} mph, Direction: ${windDirection}`;

            // Display humidity
            const humidity = data.current_observation.atmosphere.humidity;
            document.getElementById("humidity").innerHTML = `Humidity: ${humidity}%`;

            // Display sunrise and sunset
            const sunrise = data.current_observation.astronomy.sunrise;
            const sunset = data.current_observation.astronomy.sunset;
            document.getElementById("sunrise").innerHTML = `Sunrise: ${sunrise}`;
            document.getElementById("sunset").innerHTML = `Sunset: ${sunset}`;

            // Display UV Index
            const uvIndex = data.current_observation.environment.uv_index;
            document.getElementById("uv-index").innerHTML = `UV Index: ${uvIndex}`;

            // Display 7-Day Forecast
            const forecast = data.forecasts;
            if (forecast && forecast.length > 0) {
                displayForecast(forecast);
            } else {
                console.error("No forecast data available");
            }
        })
        .catch(error => {
            document.getElementById("loader").style.display = "none";
            console.error("Error fetching weather data:", error);
        });
};

// Event listener for search form
const submit = document.getElementById("submit");
submit.addEventListener("click", (event) => {
    event.preventDefault();  // Prevent form submission
    const cityInput = document.getElementById("city");
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a city.");
    }
});

// Initial weather fetch for default city (Mumbai)
getWeather('Mumbai');
