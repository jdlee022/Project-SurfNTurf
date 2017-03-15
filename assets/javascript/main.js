/**
 * @file - This file manages the api calls to get the hiking places and details
 * 
 * In order to access the information needed for the current display you can 
 * reference the global variable currentPlace and access it's properties:
 * name, lat, lng, temp, wind, url, photos
 * 
 * Each time a button with the "#newPlace" id is clicked the currentPlace object will update.
 * If the user continues to click newPlace and we run out of new places the currentPlace will 
 * cycle and repeat.
 * 
 * TODO:
 * As of now the currentPlace is empty when the page initially loads, it doesn't update until
 * the newPlace button is pressed.
 * 
 * This is due to the fact that it takes the browser an average of 3 seconds to get the user's
 * location after they click "Allow". So we need to figure out how to show some sort of loading screen
 * while this happens and then load the first place returned by their location.
 * 
 * Use modals instead of prompt when can't get location.
 */

// TEXT SEARCH request
var map;
var service;
var infowindow;
//global variable used to store list of places relevant to current location
var counter = 0;
var search;
var places = [];
var currentPlace;
var currentPhotos = [];
var locationSearch = "";

function getWeather(lat, lng, place) {
    var apikeyid = "eb3f27114445b4659aab2c8fd7a8fa5d";
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?mode=json&units=imperial&" +
        "lat=" + lat +
        "&lon=" + lng +
        "&appid=" + apikeyid;
    $.ajax({
            url: queryURL,
            method: 'GET'
        })
        .done(function (response) {
            place.temp = Math.floor(response.main.temp);
            place.wind = Math.floor(response.wind.speed);
        });
}

/** Call this to get current location and store lat & lng in currentLot */
function initMap() {
    //if browser supports current location then store it in currentLot, else get from user input
    navigator.geolocation.getCurrentPosition(function (position) {
        locationSearch = "";
        currentLot = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            switch: true
        };

        console.log("Got current place!");
        //Check if the API has returned the user's current location. If so the if statement would run
        if (currentLot.switch) {
            initializePlaces(currentLot.lat, currentLot.lng);
        }
    }, function () {
        //if geolocation doesnt work then prompt user to enter a location
        $('#myModal').modal('show');
        //locationSearch = prompt("Cannot get your current location! Please enter a location (eg. 'La Jolla')");

    }, {
        timeout: 5000
    });
}

/** gets places based on given lat & lng */
function initializePlaces(lat, lng) {
    var pyrmont = new google.maps.LatLng(lat, lng);
    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    //want to search for hiking locations
    var myQuery = 'hiking';
    //if we searched for a location then add it to search
    if (locationSearch.length > 1) {
        myQuery = myQuery + ' in ' + locationSearch;
    }
    //set data that determines what is returned
    var textRequest = {
        location: pyrmont,
        radius: '10000',
        query: myQuery
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(textRequest, searchCallback);
}

/** Handles the data that is returned by google places */
function searchCallback(results, status) {
    //empty places array when new location is searched
    places = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            //get the ith place object
            var place = results[i];

            //add a new place object to the places array
            var thisPlace = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                placeId: place.place_id,
                name: place.name,
                url: place.url,
                temp: null,
                wind: null,
                //need to update photos after calling getDetails with this place's id
                photos: null,
                rating: null
            };
            places.push(thisPlace);

            //log the current place and then the global array of place objects
            //console.log(place);
        }
    }
}

/** Get the photos from the details returned and update the photos attribute for the corresponding place object in the places[] array */
function detailsCallback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        //reset the currentPhotos
        currentPhotos = [];
        //if details api gives us a url then assign it to the place, else set default url to google maps
        if (typeof (place.url) !== undefined) {
            places[counter - 1].url = place.url;
        } else {
            places[counter - 1].url = "https://www.google.com/maps/";
        }

        //if details api gives us photos then assign it to the place, else give it a default image
        if (place.photos !== undefined) {
            for (var i = 0; i < place.photos.length; i++) {
                currentPhotos[i] = place.photos[i].getUrl({
                    'maxWidth': 4000,
                    'maxHeight': 4000
                });
            }
        } else {
            currentPhotos[0] = "https://lh4.googleusercontent.com/-IhuqmUwfUNE/V5q2XH0F37I/AAAAAAAAEtw/r5A0UzbkuO0-wCoko9BL5-DpByXBzzO0wCJkC/w4000-h4000-k/";
        }

        //set currentPlace after all info has been added
        places[counter - 1].photos = currentPhotos;
        places[counter - 1].rating = place.rating;
        currentPlace = places[counter - 1];
        console.log("currentPlace:");
        console.log(currentPlace);
    }
}

/** Gets the photos for the given place */
function getPhotos(currentPlace) {
    //GET details for the current place
    var detailsRequest = {
        placeId: currentPlace.placeId
    };
    service.getDetails(detailsRequest, detailsCallback);
}

/** When the user clicks a button to load a new place update the array of current pictures */
$("#newPlace").on("click", function () {
    getWeather(places[counter].lat, places[counter].lng, places[counter]);
    getPhotos(places[counter]);
    

    counter = counter % (places.length - 1);
    counter++;
});

$("#modalSearch").on("click", function () {
    locationSearch = $("#modalInput").val();
    $("#modalInput").html("");
    $('#myModal').modal('hide');
    initializePlaces(0.0, 0.0);
    // getWeather(places[counter].lat, places[counter].lng, places[counter]);
    // getPhotos(places[counter]);
    //counter++;
});

initMap();