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

//get weather


//GET CURRENT LOCATION IN LONGTITUDE AND LATITUDE
var currentLot = {
    lat: null,
    lng: null
            }; 
function initMap() {
    if (navigator.geolocation){
      	navigator.geolocation.getCurrentPosition( function(position){
      	currentLot = {
      		lat: position.coords.latitude,
    	  	lng: position.coords.longitude
    	};
    	console.log("Latitude: " + currentLot.lat + ". Longitude: " + currentLot.lng);
    	})
    }
  else {
      // Browser doesn't support Geolocation. Ask user to input location
        prompt('Please input your location');
  	}	
	}


