//CALL FUNCTION AND ON CLICK EVENTS

var currentLot = {
    lat: null,
    lng: null,
    switch : false
};

var searchLocation = {
    lat: null,
    lng: null,
    switch : false
};


var surfSpot = {
    name: null,
    lat: null,
    lng: null,
    height: null, 
    wind: null, 
    weather: null
};

// TEXT SEARCH request
var counter = 0;
var map;
var service;
var infowindow;
//global variable used to store list of places relevant to current location
var search;
var places = [];
var currentPlace;
var currentPhotos = [];

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
        }, function(){console.log("error"); }, {timeout:5000});
    } else {
        //TODO: if unable to get current location then prompt user to enter one manually
        prompt('Please input your location');  
    }
}

/** gets places based on given lat & lng */
function initializePlaces(lat, lng) {
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
            var thisPlace = {
                location: place.geometry.location,
                placeId: place.place_id,
                name: place.name,
                url: place.url,
                //need to update photos after calling getDetails with this place's id
                photos: null
            };
            places.push(thisPlace);

            //log the current place and then the global array of place objects
            //console.log(place);
        }
    }
}

/** Get the photos from the details returned and update the photos attribute for the corresponding place object in the places[] array */
function detailsCallback(place, status) {
    //console.log(thisPlace);
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //whenever the newPlace button is clicked 
        //places[counter - 1].photos = place.photos;
        places[counter - 1].url = place.url;
        for (var i = 0; i < place.photos.length; i++) {
            currentPhotos[i] = place.photos[i].getUrl({
                'maxWidth': 4000,
                'maxHeight': 4000
            });
        }
        places[counter - 1].photos = currentPhotos;
        currentPlace = places[counter - 1];
        console.log("currentPlace:");
        console.log(currentPlace);
    }
}


function getPhotos(currentPlace) {
    //GET details for the current place
    var detailsRequest = {
        placeId: currentPlace.placeId
    };
    service.getDetails(detailsRequest, detailsCallback);
}

/** When the user clicks a button to load a new place update the array of current pictures */
$("#newPlace").on("click", function () {
    getPhotos(places[counter]);
    counter++;
});

//initialize data based on current location when page loads
initMap();
