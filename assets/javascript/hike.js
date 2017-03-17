$(document).ready(function () {



    //hide the favorites list
    $("#favList").click(function () {
        $("#favoritesWrapper").toggle("slow", function () {

        });
    });

    //search bar control


    $("#search-icon").click(function () {

        if ($("#search-box-spot").css('display') == 'none') {
            
            console.log("if");
            $("#location-icon-spot").hide();
            $("#name-spot").hide();
            $("#search-box-spot").show("slow", function () {

            });

        } else {
            
            $("#search-box-spot").hide("slow", function () {
                $("#location-icon-spot").show();
                 $("#name-spot").show();
            });
        }
});





    //change background image on hover
    $('#hike-title').hover(function () {
        $('body').css('background-image', 'url("assets/images/hikeIndex.png")');
    }, function () {

        $('body').css('background-image', 'url("https://fast-company-res.cloudinary.com/image/upload/fc/3039266-poster-p-1-your-windowless-cubicle-is-doing-horrible-things-for-your-sleep-and-mental-health.jpg")');
    });

});

$('#surf-title').hover(function () {
    $('body').css('background-image', 'url("https://static.pexels.com/photos/35007/pexels-photo.jpg")');
}, function () {

    $('body').css('background-image', 'url("https://fast-company-res.cloudinary.com/image/upload/fc/3039266-poster-p-1-your-windowless-cubicle-is-doing-horrible-things-for-your-sleep-and-mental-health.jpg")');
});
