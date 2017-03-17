//RUNNING FX when LOAD:

//Variables: 
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
var UserlikedPlace = false;
var placeExists = false;
var currentName;
//Store user's data in the storage:
var favoriteList = localStorage.getItem("Favorite Hike Spots");



//When the heart is click on, i++ like counts:

likeCountFx("#heartSurf", "surf");

//Get local storage fav list and display it
$("#favHikeBtn").on("click", function(){ 
    loadUserFav("Favorite Hike Spots", "#favHikeList");
});

$("#heartHike").on("click", function () {
    //check in the list 
    heartForFavPlace("#heartHike", favoriteList, currentName);
    saveFavLocal("Favorite Hike Spots");
    likeCountFx("#heartHike", "hike");
});

function likeCountFx(heartID, typeSpot) {
    // $(heartID).on("click", function () {
        //heartForFavPlace("#heartHike", favoriteList, currentName);
        //get the current spot's name        
        currentName = $("#current-spot").html();
        //check if database has a path for this aready
        var ref = database.ref("spotsInfo/" + typeSpot);
        //take a snapshot of current data
        ref.once("value")
            .then(function (snapshot) {
            //Test if this place has info in db
            //TODO: ERROR
            if (snapshot.child(currentName).exists()) {
                //retrievve current like count 
                likeCount = snapshot.child(currentName + "/likes").val();
                spotID = snapshot.child(currentName + "/id").val();
                //add one more like to current one:
                if (UserlikedPlace === false) {
                    likeCount++;
                    $(heartID).addClass("heartColor");
                } else if (UserlikedPlace === true && likeCount !== 0){
                    likeCount--;
                    $(heartID).removeClass("heartColor") ;
                    removePlace(favoriteList, currentName);
                    //UserlikedPlace = false;
                }
                console.log(likeCount)
                //push this back to the data count: 
                database.ref("spotsInfo/" + typeSpot + "/" + currentName).set({
                    id: spotID,
                    likes: likeCount
                });
                $("#heartCount").text(likeCount);
                //if the database doesn't have that path:
            } else {
                //create new path to that place id and like starts at 1
                likeCount = 1;
                database.ref("spotsInfo/" + typeSpot + "/" + currentName).set({
                    "id": currentName,
                    "likes": likeCount
                });
                $("#heartCount").text(likeCount);
                //database.ref
            } //else
        }) //function
        //Save fav to database
    //}); 
}

//Display current like of a placeName
function dispLikes() {
    currentName = $("#current-spot").html();
    if (currentName !== "") {
        var ref = database.ref("spotsInfo/hike");
        ref.once("value")
            .then(function (snapshot) {
            if (snapshot.child(currentName).exists()) {
                likeCount = snapshot.child(currentName + "/likes").val();
                $("#heartCount").text(likeCount);
            } else {
                $("#heartCount").text("0");
            }
        });
    }
}




function saveFavLocal(favorite) {
    placeName = $("#current-spot").html();
    url = currentPlace.url;
    console.log(url);
    placeObj = {
        name: placeName,
        url: currentPlace.url,
    };
    //retrieve favorteArray from localStorage:
    if (localStorage.getItem(favorite)) {
        var favoriteArray = localStorage.getItem(favorite);
    }
    //function check if user has already like this spot:
    if ((favoriteArray == "[null]") | favoriteArray == undefined){
        var favoriteArray = [];
        favoriteArray.push(placeObj);
        favoriteArray = JSON.stringify(favoriteArray);
        localStorage.setItem(favorite, favoriteArray);
        favoriteArray = localStorage.getItem(favorite);
        favoriteArray = JSON.parse(favoriteArray);
        favoriteList = favoriteArray;
        UserlikedPlace = true;
    } else {
        favoriteArray = JSON.parse(favoriteArray);
        console.log(typeof(favoriteArray));
        console.log(favoriteArray.length);
        for (i = 0; i < favoriteArray.length; i++) {
            favPlace = favoriteArray[i];
            console.log(favPlace);
            //item in fav array exists and Found where current fav place in the fav array 
            if (favPlace.name == placeName) {
                var placeExists = true;
                //UserlikedPlace = false;
            } else{
                var placeExists = false;
                //UserlikedPlace = true;
            }
        }
        if (placeExists !== true){
            favoriteArray.push(placeObj);
            favoriteArray = JSON.stringify(favoriteArray);
            localStorage.setItem(favorite, favoriteArray);
            favoriteArray = localStorage.getItem(favorite);
            favoriteArray = JSON.parse(favoriteArray);
            favoriteList = favoriteArray;   
        }
    }
    loadUserFav("Favorite Hike Spots", "#favHikeList"); 
    //heartForFavPlace("#heartHike", favoriteList, currentName);
} 

function loadUserFav(listName, typeList) {
    //when the user try to open the favorite list
    if (localStorage.getItem(listName)) {
        var favList = localStorage.getItem(listName);     
        favList = JSON.parse(favList);
        $(typeList).text("");
        console.log(favList);
        console.log(typeof(favList));
        for (var i = 0; i < favList.length; i++) {
            place = favList[i];
            var newDiv = $("<div><a target='_blank' href='" + place.url + "'>" + place.name + "</a></div>");
            $(typeList).append(newDiv);
        }
    }
}

function heartForFavPlace(heart, list, name){
    
    $(heart).removeClass("heartColor");
    console.log(list);
    //check if list is string, if it is, parse to JSON format
    if (typeof(list) == "string"){
        list = JSON.parse(list);
    }
    console.log(typeof(list));
    if (list !== null) {
        for (i = 0; i < list.length; i++) {
            favPlace = list[i];
            console.log(favPlace);
            console.log(favPlace.name);
            console.log(name);
            if (favPlace.name === name ) {
                $(heart).addClass("heartColor");
                UserlikedPlace = true;
            } 
            else {
                UserlikedPlace = false;
            }
        }
    }
}


function removePlace(list, name){
    console.log(list);
    if (typeof(list) === "string"){
        list = JSON.parse(list);
    }
    // list = [{key 1: val 1, key 2: val 2}, {}, {}]
    if (list !== null) {
        for (i = 0; i < list.length; i++) {
            favPlace = list[i];
            console.log(favPlace);
            console.log(favPlace.name);
            console.log(name);
            if (favPlace.name === name ) {
                var index = list.indexOf(i);
                if (index > -1){
                    array.splice(index, 1);
                }
            } 
        }
    }
}

//TODO: save in local storage value of like switch
// function alreadyLiked(list, name, heart) {
//     $(heart).removeClass("heartColor");
//     console.log(list);
//     //check if list is string, if it is, parse to JSON format
//     if (typeof(list) == "string"){
//         list = JSON.parse(list);
//     }
//     console.log(typeof(list));
//     if (list !== null) {
//         for (i = 0; i < list.length; i++) {
//             favPlace = list[i];
//             console.log(favPlace);
//             console.log(favPlace.name);
//             console.log(name);
//             if (favPlace.name === name && favPlace.liked == true) {
//                 $(heart).addClass("heartColor");
//             } 
//             else {
//                 $(heart).removeClass("heartColor");
//             }
//         }
//     }
// }


// function likedORunliked(list, name){
//     //name == current name on page
//     //list == favorite list in the local storage
//     //when click on heart:
//     if (typeof(list) == 'string'){
//         list = JSON.parse(list);
//     }    
//     for (var i = 0; i < list.length; i++){
//         place = list[i];
//         if (place.name == name && place.liked == true){
//             place.liked = false;
//         } else if ( place.name == name && place.liked == false){
//             place.liked = true;
//         }
//     }
// }


