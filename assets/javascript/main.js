//FUNCTIONS 

// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyABAurtLfnJD7fa63YfFAXgrM3wl2u7A84",
//     authDomain: "project-surfnturf.firebaseapp.com",
//     databaseURL: "https://project-surfnturf.firebaseio.com",
//     storageBucket: "project-surfnturf.appspot.com",
//     messagingSenderId: "948418625999"
// };
// firebase.initializeApp(config);
// var database = firebase.database();

/** Check if value is a number */
function isNumber(o) {
    return !isNaN(o - 0) && o !== null && o !== "" && o !== false;
}

function getWeather(lat, lng){
    var apikeyid = "eb3f27114445b4659aab2c8fd7a8fa5d";
	var queryURL = "http://api.openweathermap.org/data/2.5/weather?"
		+ "lat=" + lat 
		+ "&lon=" + lng 
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

/** Call this to get current location and store lat & lng in currentLot */
function initMap() {
    //if browser supports current location then store it in currentLot, else get from user input
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) { 
            currentLot = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                switch: true
            };
            console.log("initMap Latitude: " + currentLot.lat + ". Longitude: " + currentLot.lng);
            //Check if the API has returned the user's current location. If so the if statement would run
            if(currentLot.switch){
                initializePlaces(currentLot.lat, currentLot.lng);
                getWeather(currentLot.lat, currentLot.lng);
            }
        });
    } else {
        //TODO: if unable to get current location then prompt user to enter one manually
        prompt('Please input your location');
        
    }
}

// TEXT SEARCH request
var counter = 0;
var map;
var service;
var infowindow;
//global variable used to store list of places relevant to current location
var places = [];
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
        var textRequest = {
            location: pyrmont,
            radius: '500',
            query: 'hiking'
        };

        service = new google.maps.places.PlacesService(map);
        //GET the data (see searchCallBack function)
        service.textSearch(textRequest, searchCallback);
    } else {
        //TODO: if invalid lat & lng were provided then do something
        alert("Error: invalid lat & lng passed to initializePlaces");
    }
}
/** Handles the data that is returned by google places */
function searchCallback(results, status) {
    //empty places array when new location is searched
    places = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //DO STUFF IN HERE TO ACCESS EACH PLACE
        for (var i = 0; i < results.length; i++) {
            //get the ith place object
            var place = results[i];

            //add a new place object to the places array
            places.push({
                location: place.geometry.location,
                placeId: place.place_id,
                name: place.name,
                url: place.url,
                //need to update photos after calling getDetails with this place's id
                photos: null
            });

            console.log(places[i]);

            //call getDetails using id for current place
            var detailsRequest = {
                placeId: place.place_id
            };
            //GET details (refer to detailsCallback function)
            service.getDetails(detailsRequest, detailsCallback);
            
            //places[i]={};

            //TODO: figure out how to add the returned photos from the above getDetails() call to the current place's data.
            //Not sure if this should be updated here or in the detailsCallback() function

            //log the current place and then the global array of place objects
            console.log("place: " + place);
            console.log("places: " + places);
            counter++;
        }
    }
}

/** Get the photos from the details returned and update the photos attribute for the corresponding place object in the places[] array */
function detailsCallback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //places[counter].photos = place.photos;
        console.log("photos for " + place.name + ":");
        console.log(place.photos);
    }
}


