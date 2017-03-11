//Configuration and initialize DB
var config = {
    apiKey: "AIzaSyABAurtLfnJD7fa63YfFAXgrM3wl2u7A84",
    authDomain: "project-surfnturf.firebaseapp.com",
    databaseURL: "https://project-surfnturf.firebaseio.com",
    storageBucket: "project-surfnturf.appspot.com",
    messagingSenderId: "948418625999"
};
firebase.initializeApp(config);
var database = firebase.database();

//Create new folders called 'hike' and 'surf' by importing fbpath.json file
//new var count the likes:
var likeCount = null;

//When the heart is click on, i++ like counts:
function likeCount(){
    $("#heart").on('click', function(){
        //get the current spot's name        
        currentName = $("#currentSpot").html();
        //check if database has a path for this aready
        if (firebase.database().ref("hike/" + currentName)){
            //get current count for likes
            likeCount = firebase.database().ref("hike/" + currentName + "/likes");
            //add one more like to current one:
            likeCount++;
            //push this back to the data count: 
            likeCount = firebase.database().ref("hike/" + currentName).push(){
                likes: likeCount
            };
        //if the database doesn't have that path:
        } else {
            //create new path to that place id and like starts at 1
            firebase.database().ref("hike/" + currentName).push(){
                "id" : currentName, 
                "likes": 1
            };
        }
    });
}