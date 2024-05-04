// Function to update the text fields with the received data
function updateTextFields(data) {
    // Update the text fields in the HTML document
    if ( data[2].state < 100 ) {
        location.href = 'off.html';
    }
    if ( data[2].state > 100 && location.pathname === '/off.html') {
        location.href = '/index.html';
    }
    console.log('data', data)
    document.getElementById('temperatur').textContent = data[1].state + ' ' + data[1].unit_of_measurement;
    document.getElementById('co2').textContent = data[0].state + ' ' + data[0].unit_of_measurement;
    // document.getElementById('brightness').textContent = data[2].state + ' ' + data[2].unit_of_measurement;
    document.getElementById('time').textContent = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('date').textContent = new Date().toLocaleDateString('de-DE', { weekday: 'long', month: 'long', day: 'numeric' });
    if(data[0].state > 1300){
        document.getElementById('co2Icon').style.color = 'red';
    } else {
        document.getElementById('co2Icon').style.color = 'white';
    }
}

// Function to fetch data from the API endpoint
function fetchData() {
    console.log('fetching data');
    fetch('/api/getSensorData')
        .then(response => response.json())
        .then(data => updateTextFields(data))
        .catch(error => console.log(error));
}

function updateWeather(){
    fetch('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,is_day,rain,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=1')
    .then(response => response.json())
    .then(data => {
        console.log('weather', data)
        document.getElementById('wetterTemperatur').textContent = data.current.temperature_2m + ' °C';
        document.getElementById('wetterMinimum').textContent = data.daily.temperature_2m_min + ' °C';
        document.getElementById('wetterMax').textContent = data.daily.temperature_2m_max + ' °C';

        const weatherIcon = getMaterialDesignIconForWeatherCode(data.current.weather_code, data.current.is_day);
        console.log('icon', weatherIcon)

        document.getElementById('wetterIcon').textContent = weatherIcon;
    })
    
}

function weatherClicked(){
    console.log('weather clicked');
    fetch('/api/toggleLightAll')
}

function getMaterialDesignIconForWeatherCode(weatherCode, isDay) {
    if (weatherCode === 0) {
      return "sunny"; // Clear sky
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      return isDay === 1 ? "partly_cloudy_day" : "partly_cloudy_night"; // Partly cloudy: 1-3 oktas
        //return "partly_cloudy_day"; // Mainly clear, partly cloudy, and overcast
    } else if (weatherCode === 45 || weatherCode === 48) {
      return "foggy"; // Fog and depositing rime fog
    } else if (weatherCode >= 51 && weatherCode <= 55) {
      return "rainy_light"; // Drizzle: Light, moderate, and dense intensity
    } else if (weatherCode === 56 || weatherCode === 57) {
      return "rainy_snow"; // Freezing Drizzle: Light and dense intensity
    } else if (weatherCode >= 61 && weatherCode <= 65) {
      return "rainy"; // Rain: Slight, moderate and heavy intensity
    } else if (weatherCode === 66 || weatherCode === 67) {
      return "grain"; // Freezing Rain: Light and heavy intensity
    } else if (weatherCode >= 71 && weatherCode <= 75) {
      return "weather_snowy"; // Snow fall: Slight, moderate, and heavy intensity
    } else if (weatherCode === 77) {
      return "grain"; // Snow grains
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      return "rainy"; // Rain showers: Slight, moderate, and violent
    } else if (weatherCode === 85 || weatherCode === 86) {
      return "weather_snowy"; // Snow showers slight and heavy
    } else if (weatherCode === 95) {
      return "thunderstorm"; // Thunderstorm: Slight or moderate
    } else if (weatherCode >= 96 && weatherCode <= 99) {
      return "thunderstorm"; // Thunderstorm with slight and heavy hail
    } else {
      console.warn("Unknown weather code:", weatherCode);
      return isDay === 1 ? "cloud" : "clear_night"; // Partly cloudy: 1-3 oktas
      //return "cloud"; // Unknown weather code
    }
}
  
fetchData();
updateWeather();


setInterval(fetchData, 60000);
setInterval(updateWeather, 1.2e+6);

