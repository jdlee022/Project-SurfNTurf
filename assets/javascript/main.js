// // Initialize Firebase
// var config = {
//     apiKey: "AIzaSyABAurtLfnJD7fa63YfFAXgrM3wl2u7A84",
//     authDomain: "project-surfnturf.firebaseapp.com",
//     databaseURL: "https://project-surfnturf.firebaseio.com",
//     storageBucket: "project-surfnturf.appspot.com",
//     messagingSenderId: "948418625999"
// };
// firebase.initializeApp(config);

// var database = firebase.database();

// var currentLot = {
//     		lat: null,
//     		lng: null
//             	}; 
//get weather

function getWeather(lat, lng){
	var queryURL = "https://api.openweathermap.org/data/2.5/weather?"
		+ "lat=" + lat 
		+ "&lon=" + lng 
		+ "&appid=eb3f27114445b4659aab2c8fd7a8fa5d";
	console.log(queryURL);
	$.ajax({
		url: queryURL,
		method: 'GET' })
		.done(function(response){
			console.log(response);
		});
}

//initMap();
getWeather(lat = 32.7912970, lng = -117.1445170);
//GET CURRENT LOCATION IN LONGTITUDE AND LATITUDE

// function initMap() {
//     if (navigator.geolocation){
//       	navigator.geolocation.getCurrentPosition( function(position){
//       	currentLot = {
//       		lat: position.coords.latitude,
//     	  	lng: position.coords.longitude
//     	};
//     	console.log("Latitude: " + currentLot.lat + ". Longitude: " + currentLot.lng);
//     	})
//     }
//   else {
//       // Browser doesn't support Geolocation. Ask user to input location
//         prompt('Please input your location');
//   	}	
// }


