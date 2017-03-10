//scroll up and down for new location
//scroll left and right for new images of same location

//information required: distance from current location, weather, precipitation, wind, 

//google maps api for hiking spots

//give users option to upvote location
//give users option to choose radius of locations

//show locations with most upvotes first, then go by distance


//google Places Javascript Library api key: AIzaSyDdNmLe6QXmChKNtIn-n4TToeL2Ly7KHis


// TEXT SEARCH request
var map;
var service;
var infowindow;
var myLat = 32.7912970;
var myLng = -117.1445170;

function initialize(lat, lng) {
    var pyrmont = new google.maps.LatLng(lat, lng);

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    var request = {
        location: pyrmont,
        radius: '500',
        query: 'hiking'
    };

    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, callback);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];

            //DO STUFF IN HERE TO ACCESS EACH PLACE
            console.log(place);
        }
    }
}

//load places
initialize(myLat, myLng);