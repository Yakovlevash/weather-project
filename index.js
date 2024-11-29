const apiKey = '5b6c6c640433e7b3f898575935d364c1'; 

document.getElementById('get-weather-button').addEventListener('click', getWeather);

async function getWeather() {
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
            
    if (!validateInputs(latitude, longitude)) {
        document.getElementById('result-container').innerText = 'Введите корректные значения.';
        return;
    }      
    const url = `https://ru.api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;      
    try {
        const response = await fetch(url);
        if(!response.ok){
            throw new Error(response.statusText)
        }
        const data = await response.json();
        createWidget(data, latitude, longitude);
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    } catch (error) {
        document.getElementById('result-container').innerText = `Ошибка получения данных: ${error.message}`;
    }
}

function createWidget (data, latitude, longitude) { 
    const widget = document.createElement('div');
    widget.className = 'weather-widget';
    const localTime = getLocalTime(data.timezone);
    const weatherImage = getWeatherImage(data.weather[0].main); 
    const mapId = `map-lat-${latitude}-lon-${longitude}`;
    widget.innerHTML = `
        <div class="widget-container">
            <div>
                <span>Температура: ${Math.round(data.main.temp)}°</span>
                <br>
                <span>Время: ${localTime}</span>
                <br>
                <span>Скорость ветра: ${data.wind.speed} м/с</span>
            </div>
            <div>
                <img src="${weatherImage}" alt="Weather" width="87" height="87"/>
            </div>
            <div id="${mapId}" style="height: 300px; width: 300px;"></div>\
        </div>
    `;
    document.getElementById('result-container').appendChild(widget);
    addMap(latitude, longitude, mapId);
};

function validateInputs(latitude, longitude) {
    return latitude && longitude && !isNaN(latitude) && !isNaN(longitude) && latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function getLocalTime(timezoneOffset) { 
    const newUtc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const localTime = new Date(newUtc + timezoneOffset * 1000); 
    return localTime.toLocaleTimeString(); 
}

function getWeatherImage(weatherCondition) {
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            return 'image/clear-day.png';
        case 'rain':
            return 'image/rain.png';
        case 'clouds':
            return 'image/cloudy.png';
        case 'snow':
            return 'image/snow.png';
        case 'thunderstorm':
            return 'image/storm.png';
        default:
            return '';
    }
}

function addMap(latitude, longitude, mapId) {
    const map = L.map(mapId).setView([latitude, longitude], 12); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18
    }).addTo(map);
    L.marker([latitude, longitude]).addTo(map)
}