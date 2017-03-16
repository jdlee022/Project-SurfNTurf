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
//When the heart is click on, i++ like counts:


function likeCountFx(heartID, typeSpot) {
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
            spotLng = snapshot.child(currentName + "/lng").val()
            spotLat = snapshot.child(currentName + "/lat").val()
            console.log(likeCount);
            //add one more like to current one:
            if (UserlikedPlace !==true){
                likeCount++;
            }
            console.log(likeCount)
            //push this back to the data count: 
            database.ref("spotsInfo/" + typeSpot + "/" + currentName).set({
                id: spotID,
                lat: spotLat,
                lng: spotLng,
                likes: likeCount
            });
            $("#heartCount").text(likeCount);
            //if the database doesn't have that path:
        } else {
            //create new path to that place id and like starts at 1
            likeCount = 1;
            database.ref("spotsInfo/" + typeSpot + "/" + currentName).set({
                "id": currentName,
                "lat": 0,
                "lng": 0,
                "likes": likeCount
            });//database.ref
            $("#heartCount").text(likeCount);
        } //else
    }) //function
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

//Store user's data in the storage:
var favoriteList = localStorage.getItem("Favorite Hike Spots");
saveFavLocal("Favorite Hike Spots");

function saveFavLocal(favorite) {
    $("#heartHike").on("click", function () {
        likeCountFx("#heartHike", "hike");
        placeName = $("#current-spot").html();
        url = currentPlace.url;
        console.log(url);
        //retrieve favorteArray from localStorage:
        if (localStorage.getItem(favorite)) {
            var favoriteArray = localStorage.getItem(favorite);
        }
        placeObj = {
            name: placeName,
            url: currentPlace.url,
            liked: true
        };
        //if there is no favorite array, then create one:
        if (favoriteArray == "[null]" | favoriteArray == undefined) {
            var favoriteArray = [];
            favoriteArray.push(placeObj);
            favoriteArray = JSON.stringify(favoriteArray);
            localStorage.setItem(favorite, favoriteArray);
            favoriteList = favorite;
            //there exists favoriteArray as string
            //if there is already a fav array:
        } else {
            //function check if user has already like this spot:
            favoriteArray = JSON.parse(favoriteArray);
            for (i = 0; i <= favoriteArray.length; i++) {
                favPlace = favoriteArray[i];
                console.log(i);
                console.log(favPlace);
                if ((favPlace !== undefined) && (favPlace.name === placeName)) {
                    var placeExists = true;
                    UserlikedPlace = true;
                }
            };
            if (placeExists != true) {
                favoriteArray.push(placeObj);
                favoriteArray = JSON.stringify(favoriteArray);
                localStorage.setItem(favorite, favoriteArray);
                favoriteList = favorite;
            }
        }
        loadUserFav(favorite);
    });
}

// function pushNsaveFav(favorite, array, obj) {
//     array.push(obj);
//     array = JSON.stringify(array);
//     localStorage.setItem(favorite, array);
//     favoriteList = favorite;
// }

// function checkFavList(list, name, favorite, array, obj) {
//     //if the name already in there: 
//     list = JSON.parse(list);
//     for (i = 0; i <= list.length; i++) {
//         favPlace = list[i];
//         console.log(i);
//         console.log(favPlace);
//         if ((favPlace !== undefined) && (favPlace.name === name)) {
//             var placeExists = true;
//         }
//     };
//     if (placeExists != true) {
//         pushNsaveFav(favorite, array, obj);
//     }
// }

//Create a button for the hamberger
loadUserFav("Favorite Hike Spots");
$("#favList").on("click", function () {
    loadUserFav("Favorite Hike Spots");
});

function loadUserFav(list) {
    //when the user try to open the favorite list
    $("#favoritesContentArea").text("");
    var favList = localStorage.getItem(list);
    if (favList !== null) {
        favList = JSON.parse(favList);
        console.log(favList);
        for (var i = 0; i < favList.length; i++) {
            place = favList[i];
            console.log(place);
            console.log(place.url);
            var newDiv = $("<div><a target='_blank' href='" + place.url + "'>" + place.name + "</a></div>");
            $("#favoritesContentArea").append(newDiv);
        }
    }
}
console.log(favoriteList);
//TODO: save in local storage value of like switch
function alreadyLiked(list, name, heart) {
    console.log(list);
    //list = JSON.parse(list);
    if (list !== null) {
        for (i = 0; i < list.length; i++) {
            favPlace = list[i];
            console.log(i);
            console.log(favPlace);
            if (favPlace.liked === true) {
                $(heart).addClass("heartColor");
            }
        }
    }

}



// //check or create new user using user name: 
// $("#signin").on("click", function(){
//     userName = $("input[name=userName").val();
//     //check if userName has space:
//     //check if this user name is already in the firebase:
//     var ref = database.ref("userName/");
//         //take a snapshot of current data
//     ref.once("value")
//         .then(function(snapshot){
//         //Test if this place has info in db
//         if (snapshot.child(userName).exists()){
//             id = snapshot.child(userName + "/id").val();
//             favList = snapshot.child(userName + "/favList").val();
//         } else {
//             database.ref("userName/" + userName).set({
//                 "id": userName,
//                 //store favList as arrray or objects
//                 "favList" : favoriteList
//             });
//         }   
//     });
// });