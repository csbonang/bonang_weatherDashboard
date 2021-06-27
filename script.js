// API CALL 
//https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893
// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}

// API Key 
var APIKEY = "6f729042d0e904833f377ed98e9382de"; 
var latitude; 
var longitude; 
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
function apiCall(event){
    // ensures it stays 
   event.preventDefault();
   var city = document.querySelector('#cityName').value;  
   var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKEY;
   console.log('city: ' + city); 
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
        uviForcasts(latitude, longitude); 
        });

}

// uv index and forcasts within the last 5 days 
function uviForcasts(lat, lon, apid){
// https://openweathermap.org/api/one-call-api
    var queryURL ='https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,daily&appid=' + APIKEY; 
    console.log('uvi link: ',queryURL); 
     fetch(queryURL)
     .then(function (response) {
        var accessCityData = response.json; 
        return response.json();
        })
        .then(function (data) {
            console.log('Data: ', data);
            console.log('uvi: ', data.current.uvi); 
        }); 
}
  

