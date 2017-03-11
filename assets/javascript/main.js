
// Initialize Firebase
var config = {
    apiKey: "AIzaSyABAurtLfnJD7fa63YfFAXgrM3wl2u7A84",
    authDomain: "project-surfnturf.firebaseapp.com",
    databaseURL: "https://project-surfnturf.firebaseio.com",
    storageBucket: "project-surfnturf.appspot.com",
    messagingSenderId: "948418625999"
};
firebase.initializeApp(config);
var database = firebase.database();

/** Check if value is a number */
function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function getWeather(){
    var apikeyid = "166a433c57516f51dfab1f7edaed8413";
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?"
		// + "lat=" + lat 
		// + "&lon=" + lng 
        + "q=Bujumbura,Burundi&units=imperial"
		+ "&appid=" + apikeyid;
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: 'GET' })
		.done(function(response){
			console.log(response);
		});
}



//get current location and store it in currentLot object
var currentLot = {
    lat: null,
    lng: null
};
/** Call this to get current location and store lat & lng in currentLot */
function initMap() {
    //if browser supports current location then store it in currentLot, else get from user input
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            currentLot = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            console.log("initMap Latitude: " + currentLot.lat + ". Longitude: " + currentLot.lng);
        });
    } else {
        //TODO: if unable to get current location then prompt user to enter one manually
        prompt('Please input your location');
    }
}

// TEXT SEARCH request
var map;
var service;
var infowindow;
/** gets places based on given lat & lng */
function initializePlaces(lat, lng) {
    //check if valid lat and lng were given
    if (isNumber(lat) && isNumber(lng)) {
        var pyrmont = new google.maps.LatLng(lat, lng);

        map = new google.maps.Map(document.getElementById('map'), {
            center: pyrmont,
            zoom: 15
        });
        //set data that determines what is returned
        var request = {
            location: pyrmont,
            radius: '500',
            query: 'hiking'
        };

        service = new google.maps.places.PlacesService(map);
        service.textSearch(request, callback);
    } else {
        //TODO: if invalid lat & lng were provided then do something
        alert("could not get current location, please search a place");
    }
}
/** Handles the data that is returned by google places */
function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //DO STUFF IN HERE TO ACCESS EACH PLACE
        for (var i = 0; i < results.length; i++) {
            var place = results[i];

            //TODO: create array of place objects with relative data
            console.log(place);
        }
    }
}



$(document).ready(function () {
    //call initMap() when page loads
    initMap();

    //get places when button is pressed
    $("#test").on("click", function () {
        //FIXME: Does not work unless you wait ~4 seconds for initMap() to finish getting location
        initializePlaces(currentLot.lat, currentLot.lng);
        getWeather();
    });
});