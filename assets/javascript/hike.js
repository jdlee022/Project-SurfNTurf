$(document).ready(function() {
    //toggle the favorites list off when page loads
    $( "#favoritesWrapper" ).toggle();
    //hide the favorites list
    $("#favList").click(function () {
        $("#favoritesWrapper").toggle("slow", function () {

        });
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
