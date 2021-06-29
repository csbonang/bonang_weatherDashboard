//==========Variable Declarations=============================================
    // APIKEY: holds the API Key
        var APIKEY = "6f729042d0e904833f377ed98e9382de";
    // latitude: holds the latitude 
        var latitude;
    // longituded: holds the longitude 
        var longitude;
    // displayCityInfo: holds the element to display the city information
        var displayCityInfo = document.getElementById('city-info');
    // curr_date: hold the current date for each card 
        var curr_date = document.getElementById('card-title');
    // curr_icon: able to access weather icon
        var curr_icon = document.getElementById('weather_icon');
    // curr_description: holds the element to access weather description 
        var curr_description = document.getElementById('card-text');
    // displayButtons: holds the element id to display the buttons 
        var displayButtons = document.getElementById('button-holder');
    // displayTemp: holds the element to display the temperature 
        var displayTemp = document.getElementById('city-temp');
    // displayWind: holds the element to display the temperature 
        var displayWind = document.getElementById('city-wind');
    // displayHumidity: holds the element to display the temperature 
        var displayHumidity = document.getElementById('city-humidity');
        var displayUV = document.getElementById('city-uv');
    // displayUVNum: element use to display the uv number 
        var displayUVNum = document.getElementById('city-uv-num');
    // selectedCity: city selected on button click 
        var selectedCity;


// calls createButtons to ensure that buttons appear when page loads 
    init();
    function init() {
        console.log('calling init');
        createButtons();
    }
// apiCall():: calls api and stores input field data to local storage 
function apiCall(event) {
    // ensures display stays 
    event.preventDefault();
    // clears cards to ensure it doesn't append in addition to the 5 other cards 
    document.querySelector(".card").innerHTML = "";
    // assigns the city to the city name user typed in text field 
    var city = document.querySelector('#cityName').value.trim();
    // store the city name into local storage
    var store_cities = JSON.parse(localStorage.getItem('store-cities')) || [];
    store_cities.push({
        cityName: city
    });
    // console.log("Stored City Name: ", store_cities);
    localStorage.setItem('store-cities', JSON.stringify(store_cities));
    getAPIData(city) 
    createButtons();
}
// getAPIData():: retrieves data 
function getAPIData(city) {
    // ensures that cards display doesn't overloop 
    document.querySelector(".card").innerHTML = "";

    // print the query url to ensure that it is correct 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKEY;
    console.log('city: ' + city);
    // display city name and current date 
    document.getElementById('cityHead').textContent = city + " (" + moment().format('l') + " )"; 
    console.log(queryURL);

    // execute the fetch --> call API  
    fetch(queryURL)
        .then(function (response) {
            var accessCityData = response.json;
            return response.json();
        })
        .then(function (data) {
            // Diagnostics 
                console.log('Data: ', data);
                // temp
                console.log('Temperature: ', data.main.temp);
                // wind speed 
                console.log('Weather Speed: ', data.wind.speed);
                // humidity 
                console.log('Humidity: ', data.main.humidity);
                // Latitude 
                console.log('Latitude: ', data.coord.lat);
            latitude = data.coord.lat;
            console.log('Latitude Saved : ', latitude);
            // Longitude 
            console.log('Longitude: ', data.coord.lon);
            longitude = data.coord.lon;
            console.log('Longitude Saved : ', longitude);
            // weatherIcon: holds the weather icon
            var weatherIcon = data.weather.icon;
            console.log('weather icon: ', weatherIcon);
            //  call displayFiveDay to display the weather for the next 5 day display  + icons 
            displayFiveDay(latitude, longitude, APIKEY);
            // display the city information 
            displayCurrentCityInfo(data, latitude, longitude, APIKEY);

        });

}

// uviForcasts():: uv index and forcasts within the last 5 days 
function uviForcasts(lat, lon, apid) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=' + APIKEY;
    console.log('uvi link: ', queryURL);
    fetch(queryURL)
        .then(function (response) {
            var accessCityData = response.json;
            return response.json();
        })
        .then(function (data) {
            console.log('Data: ', data);
            var uvi = data.current.uvi;
            console.log('uvi: ', data.current.uvi);
            return uvi;
        });
}

// displayCurrentCityInfo():: display the information about the city selected or newly searched 
function displayCurrentCityInfo(data, lat, lon, apid) {
    // display the current city info 
    displayCityInfo.style.display = "block";
    // display the temp, wind, Humidity
    displayTemp.textContent = 'Temp: ' + data.main.temp;
    displayWind.textContent = 'Wind: ' + data.wind.speed + " MPH";
    displayHumidity.textContent = 'Humidity: ' + data.main.humidity;
    // UV index 
    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=' + APIKEY;
    console.log('uvi link: ', queryURL);
    fetch(queryURL)
        .then(function (response) {
            var accessCityData = response.json;
            return response.json();
        })
        .then(function (data) {
            console.log('Data: ', data);
            var uvi = data.current.uvi;
            displayUV.textContent = 'UV Index: ';
            displayUVNum.textContent = uvi;
            // display different colors depending on the uv value 
            console.log("displaying colors");
            switch (true) {
                case (uvi <= 2):
                    // low 
                    displayUVNum.style.backgroundColor = 'green';
                    break;
                case (uvi <= 5):
                    // moderate
                    displayUVNum.style.backgroundColor = 'yellow';
                    break;
                case (uvi <= 7):
                    // high 
                    displayUVNum.style.backgroundColor = 'orange';
                    break;
                case (uvi <= 10):
                    // very high 
                    displayUVNum.style.backgroundColor = 'red';
                    break;
                default:
                    // extreme 
                    displayUVNum.style.backgroundColor = 'purple';
            }
        });
}

// displayFiveDay():: display the future weather conditions 
function displayFiveDay(lat, lon, apid) {
    var queryURL = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=' + APIKEY;
    console.log('icon/five day link: ', queryURL);
    fetch(queryURL)
        .then(function (response) {
            var accessCityData = response.json;
            return response.json();
        })
        .then(function (data) {
            console.log('Data: ', data);
            // create the 5 cards      
            for (var i = 1; i <= 5; i++) {
                createCard(data.daily[i], i);

            }
        });
}

// createCard():: populate the card with the correct weather conditions 
function createCard(data, i) {

    // card container 
    var card = document.createElement('div');
    var cardHeader = document.createElement('div'); 
    // current day is updated for cards 
    cardHeader.textContent = moment().add(i, "days").format("l")
    console.log('current data: ', data); 
    card.appendChild(cardHeader);

    // include weather icon 
    var card_Img = document.createElement('img');
    card_Img.setAttribute('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    card.appendChild(card_Img);

    // temp element 
    var card_temp = document.createElement('p');
    // wind element 
    var card_wind = document.createElement('p');
    // humidity 
    var card_humidity = document.createElement('p');
    // Displays information
    // temp
    card_temp.textContent = "Temp: " + data.temp.day;
    card.appendChild(card_temp);
    // wind 
    card_wind.textContent = "Wind: " + data.wind_speed + " MPH";
    card.appendChild(card_wind);
    // humidity 
    card_humidity.textContent = "Humidity: " + data.humidity;
    card.appendChild(card_humidity);

    // style the card 
    card.style.padding = "1vw";
    card.style.margin = "1vw";
    card.style.backgroundColor = "#0B5BE6";
    // leave at end 
    document.querySelector('.card').appendChild(card);
}

// createButtons():: displays all the cities and their buttons 
function createButtons() {
    var storedCityNames = JSON.parse(localStorage.getItem('store-cities'));
    // TODO: try-catch block 
    if (!storedCityNames) {
        // if there is no city name then exit the function 
        return;

    }
    // loop through local storage 
    // assign each city name to the button
    // clears button scope and populates it  
    displayButtons.innerHTML = "";
    for (var i = 0; i < storedCityNames.length; i++) {
        var city_button = document.createElement('button');
        // display button name 
        city_button.textContent = storedCityNames[i].cityName;
        city_button.setAttribute('data-index', storedCityNames[i].cityName);
        // update city name with the city name button that user just clicked on 
        selectedCity = storedCityNames[i].cityName;
        console.log('Selected city: ', selectedCity);
        city_button.addEventListener("click", buttonClicked);
        displayButtons.appendChild(city_button);
        // if the button is click, then display the information associated with it 

    }
}
function buttonClicked(event) {
    console.log('city Name on click: ', this.getAttribute('data-index')); // selectedCity); 
    var city = this.getAttribute('data-index');
    getAPIData(city);
}








