// API CALL 
//https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// API Key 
var APIKEY = "6f729042d0e904833f377ed98e9382de";
var latitude;
var longitude;
var displayCityInfo = document.getElementById('city-info');
// able to access weather date for 5-day 
var curr_date = document.getElementById('card-title');
// able to access weather icon
var curr_icon = document.getElementById('weather_icon');
// able to access weather description 
var curr_description = document.getElementById('card-text');
var displayButtons = document.getElementById('button-holder');
var displayTemp = document.getElementById('city-temp');
var displayWind = document.getElementById('city-wind');
var displayHumidity = document.getElementById('city-humidity');
var displayUV = document.getElementById('city-uv');
var displayUVNum = document.getElementById('city-uv-num');
// city selected on button click 
var selectedCity;
// var queryURL; 

// user input for just the city name 

// document.getElementById('cityName'); 

// query URL 
// q: The query parameter, where we'll add the city variable.
// appid: The application id or key, where we'll add the API key variable.
// NOTE: 
// http://api.openweathermap.org/data/2.5/weather is the base URL for calling the Current Weather Data API.
// '?' marks the boundary between the base URL of the API call and the query terms of the API call. 
// q= is the query parameter, where we can add any user input to specify the data that we want to request in the API call. 
// The value assigned to this parameter is called the query string.
// we concatenate the user input, which is stored in the variable city. This is the query string assigned to the query parameter.
//  (&) indicates that we're adding another parameter after the query parameter.
// Finally, we concatenate the APIKey variable that contains the key we obtained at the beginning of this guide.
// var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY;

// API Call using fetch 
// fetch: Web API built in browser that allows you to make server-side API 
// calls without having to use AJAX and install a bulky library like jQuery
// TODO: SAVE JUST THE CITY NAMES.  

init();
function init() {
    console.log('calling init');
    createButtons();
}
function apiCall(event) {

    // ensures it stays 
    event.preventDefault();
    // clears cards to ensure it doesn't append in addition to the 5 other cards 
    document.querySelector(".card").innerHTML = "";

    var city = document.querySelector('#cityName').value.trim();

    // store the city name into local storage
    var store_cities = JSON.parse(localStorage.getItem('store-cities')) || [];
    store_cities.push({
        cityName: city
    });

    console.log("Stored City Name: ", store_cities);
    localStorage.setItem('store-cities', JSON.stringify(store_cities));
    getAPIData(city)
    // TODO: 
    createButtons();

}
function getAPIData(city) {
    // print the query url to ensure that it is correct 
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKEY;
    console.log('city: ' + city);
    document.getElementById('cityHead').textContent = city;
    console.log(queryURL);
    // execute the fetch --> call API  
    fetch(queryURL)
        .then(function (response) {
            var accessCityData = response.json;
            return response.json();
        })
        .then(function (data) {
            console.log('Data: ', data);
            // temp
            console.log('Temperature: ', data.main.temp);
            // wind speed 
            console.log('Weather Speed: ', data.wind.speed);
            // humidity 
            console.log('Humidity: ', data.main.humidity);
            // TODO: get the latitude and longitude for uv index 
            // Latitude 
            console.log('Latitude: ', data.coord.lat);
            latitude = data.coord.lat;
            console.log('Latitude Saved : ', latitude);
            // Longitude 
            console.log('Longitude: ', data.coord.lon);
            longitude = data.coord.lon;
            console.log('Longitude Saved : ', longitude);

            // console.log('uvi info: ', uvi_info); 
            var weatherIcon = data.weather.icon;
            console.log('weather icon: ', weatherIcon);
            // TODO: 5 day display  + icons 
            displayFiveDay(latitude, longitude, APIKEY);
            // display the city information 
            displayCurrentCityInfo(data, latitude, longitude, APIKEY);

        });

}

// uv index and forcasts within the last 5 days 
function uviForcasts(lat, lon, apid) {
    // https://openweathermap.org/api/one-call-api
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

// display the information about the city selected or newly searched 
function displayCurrentCityInfo(data, lat, lon, apid) {
    // display the current city info 
    displayCityInfo.style.display = "block";
    // var cityHeadName = getElementById('cityHead'); 
    // TODO: 
    // cityHeadName.textContent = cityName; 
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
                    console.log('display green');
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
            //5-day: information     
            for (var i = 1; i <= 5; i++) {
                createCard(data.daily[i]);

            }
        });
}


function createCard(data) {

    // card container 
    var card = document.createElement('div');

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

// displays all the cities and their buttons 
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
        // TODO: style the buttons to be rounded and spaced out 
        // console.log('city Name: ' + storedCityNames[i].cityName); 
        city_button.setAttribute('data-index', storedCityNames[i].cityName);
        // update city name with the city name button that user just clicked on 
        selectedCity = storedCityNames[i].cityName;
        // selectedCity = city_button.getAttribute(data-index[i]); 
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








