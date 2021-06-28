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
function apiCall(event){
    // ensures it stays 
   event.preventDefault();
   var city = document.querySelector('#cityName').value;  
   var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKEY;
   console.log('city: ' + city); 
    // store the city name into local storage
    var store_cities = JSON.parse(localStorage.getItem('store-cities')) || []; 
    store_cities.push({
        cityName: city
    }); 
    console.log("Stored City Name: ", store_cities); 
    localStorage.setItem('store-cities', JSON.stringify(store_cities));

   // print the query url to ensure that it is correct 
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
        console.log('Temperature: ',data.main.temp); 
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
        console.log('Longitude Saved : ' ,longitude); 
        // get the uvi information 
        var uvi_info = uviForcasts(latitude, longitude); 
        console.log('uvi info: ', uvi_info); 
        var weatherIcon = data.weather.icon;
        console.log('weather icon: ', weatherIcon); 
        // TODO: display the city information 
        displayCurrentCityInfo(); 
        // TODO: 5 day display  + icons 
        displayFiveDay(latitude, longitude, APIKEY); 
        });

}

// uv index and forcasts within the last 5 days 
function uviForcasts(lat, lon, apid){
// https://openweathermap.org/api/one-call-api
    var queryURL ='https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=' + APIKEY; 
    console.log('uvi link: ',queryURL); 
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
function displayCurrentCityInfo()
{
    displayCityInfo.textContent = 'Hello'; 


}
function displayFiveDay(lat, lon, apid)
{
    var queryURL ='https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=' + APIKEY;
    console.log('icon/five day link: ',queryURL); 
    fetch(queryURL)
    .then(function (response) {
       var accessCityData = response.json; 
       return response.json();
       })
       .then(function (data) {
           console.log('Data: ', data);
            //5-day: information     
            for(var i = 1; i <= 5; i++)
            {
               createCard(data.daily[i]); 
               
            }



    
       }); 
}


function createCard(data) 
{
    
   // card container 
   var card = document.createElement('div'); 

   // include weather icon 
   var card_Img = document.createElement('img'); 
   card_Img.setAttribute('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png'); 
   card.appendChild(card_Img); 

   // temp element 
   var card_temp= document.createElement('p'); 
   // wind element 
   var card_wind= document.createElement('p'); 
   // humidity 
   var card_humidity= document.createElement('p'); 
   // temp
   card_temp.textContent = "Temp: " + data.temp.day; 
   card.appendChild(card_temp); 
   // wind 
   card_wind.textContent = "Wind: " + data.wind_speed + "MPH"; 
   card.appendChild(card_wind); 
   // humidity 
   card_humidity.textContent = "Humidity: " + data.humidity; 
   card.appendChild(card_humidity); 

   // style the card 
   card.style.padding = "1vw"; 
   card.style.margin = "1vw"; 
   card.style.backgroundColor = "#AA0000";
   // TODO: include width 

   // leave at end 
   document.querySelector('.card').appendChild(card); 
}

function createButtons()
{
    var storedCityNames = JSON.parse(localStorage.getItem('store-cities')); 
    // TODO: try-catch block 
    if(!storedCityNames){
        // if there is no city name then exit the function 
        return; 

    }
    // loop through local storage 
    // assign each city name to the button 
    for(var i = 0; i < storedCityNames.length; i++){
        var city_button= document.createElement('button'); 
        city_button.textContent = storedCityNames[i].cityName;
        console.log('city Name: ' + storedCityNames[i]); 
        displayButtons.appendChild(city_button); 
        
    }
    
}
function init()
{
    console.log('calling init'); 
    createButtons(); 
}




  

