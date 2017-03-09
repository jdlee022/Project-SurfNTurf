//scroll up and down for new location
//scroll left and right for new images of same location

//information required: distance from current location, weather, precipitation, wind, 

//google maps api for hiking spots

//give users option to upvote location
//give users option to choose radius of locations

//show locations with most upvotes first, then go by distance


//google Places Javascript Library api key: AIzaSyDdNmLe6QXmChKNtIn-n4TToeL2Ly7KHis
var map;
var service;
var infowindow;

service = new google.maps.places.PlacesService(map);
service.nearbySearch(request, callback);

function initialize() {
  var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });

  var request = {
    location: pyrmont,
    radius: '500',
    types: ['hike']
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

