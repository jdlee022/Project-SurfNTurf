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
likeCountFx("#heart");

function likeCountFx(heartID){
    $(heartID).on('click', function(){
        //get the current spot's name        
        currentName = $("#currentSpot").html();
        //test for one that not yet exists in the db
        //currentName = "New Canyon";
        //test for one that already exists in the db
        //currentName = "Old Mountain";
        currentName = currentName.replace(" ", "_");
        //check if database has a path for this aready

        var ref = database.ref("spotsInfo/hike");
        //take a snapshot of current data
        ref.once("value")
            .then(function(snapshot){
            //Test if this place has info in db
            if (snapshot.child(currentName).exists()){
                //retrievve current like count 
                likeCount = snapshot.child(currentName + "/likes").val();
                spotID = snapshot.child(currentName + "/id").val();
                spotLng = snapshot.child(currentName + "/lng").val() 
                spotLat =snapshot.child(currentName + "/lat").val()
                console.log(likeCount);
                //add one more like to current one:
                likeCount++;
                console.log(likeCount)
                //push this back to the data count: 
                database.ref("spotsInfo/hike/" + currentName).set({
                    id: spotID,
                    lat: spotLat,
                    lng: spotLng,
                    likes: likeCount
                });
            //if the database doesn't have that path:
            } else {
                //create new path to that place id and like starts at 1
                database.ref("spotsInfo/hike/"+ currentName).set({
                    "id" : currentName, 
                    "lat": 0,
                    "lng": 0,
                    "likes": 1   
                }); //database.ref
            }//else
        }) //function
    });
}


//Store user's data in the storage:
function saveFavLocal(){
     $("#heart").on("click", function(){
        //localStorage.setItem("");
     });
     
}

// function addUsertoArray(){
//     $("#userName").on("click", function(){
//         userName = $("input[name=userName]").val()
//     });
// }

function loadUserFav() {
    //when the user try to open the favorite list
    $("button").on("click", function(){
        
    });
}
