  // var config = {
  //    apiKey: "AIzaSyBJXzNZQPGdTMzX3KbO4LTDGu76sY9_s6M",
  //   authDomain: "project-1-map-api-practice.firebaseapp.com",
  //   databaseURL: "https://project-1-map-api-practice.firebaseio.com",
  //   storageBucket: "project-1-map-api-practice.appspot.com",
  //   messagingSenderId: "46185502397"
  // };
  // http://api.spitcast.com/api/spot-forecast/search?longitude=-122.447759&latitude=37.768137&distance=10&year=2013&month=11&day=9&shape_min=1&size_max=6&size_min=2


  // var queryURL = "http://api.spitcast.com/api/spot-forecast/search?longitude=" + long + "latitude=" + lat + "&distance=10&year=2013&month=11&day=9&shape_min=1&size_max=6&size_min=2";
  var long = -122.447759;
  var lat = 37.768137;
  var month = 3;
  var day = 7;
  var year = 2017;
  var spotNamequeryURL = "http://api.spitcast.com/api/spot/all";
  //"http://api.spitcast.com/api/spot-forecast/search?longitude=" + long + "&latitude=" + lat + "&distance=300&year=2017&month=" + month + "&day=" + day;
  var spotNamesArray = [];
  var infoArray = [];
  var ctx = $("#myChart");
  var options;
  //var forecastURL = "http://www.spitcast.com/api/spots/forecast/" + surfSpot.name;

  var surfSpot = {
  	name: null,
  	lat:null,
  	long:null,
	county: null,
	wind: null,
	windDirection: null,
  	surfHeight:null,
	condition: null,
	waterTemp:null,
	tidesArray: [],
	timeArray: [],
	tideAndTimesArray: [],
	currentTide: null,
  	switch:false,
  }

function updateSurfSpot(name, lat, long, surfHeight, sw) {
	
	// Update all properties of surfspot
	surfSpot.lat = lat;
	//...

	// Update view 
	// $('#wind-speed).text(surfspot.windSpeed);
}


  $(".ui-autocomplete").on("click", function(){
  	$(this).addClass('clicked');
  	$("input").removeClass("inputDisappear");
	  $(".glyphicon.glyphicon-search").hide();
  })
  $("#submitBtn").on("click",function(){
  	$("input").removeClass('clicked').toggleClass("inputDisappear");
  })

 function ajaxCall(day, month, year){
	 //todo: switch to ALL endpoint instead of forecast
//   spotNamequeryURL= "http://api.spitcast.com/api/spot-forecast/search?longitude=" + surfSpot.long + "&latitude=" + surfSpot.lat + "&distance=300&year=2017&month=" + month + "&day=" + day;
  spotNamequeryURL = "http://api.spitcast.com/api/spot/all";
  $.ajax({
  	url: spotNamequeryURL,
  	method:'GET'
  })
  	.done(function(response){
  		console.log(spotNamequeryURL);
  		var spots = response;		
  		for (i = 0; i < spots.length; i++){
  			var info = spots[i];
  			infoArray.push(info);
  			spotName = spots[i].spot_name;
  			spotNamesArray.push(spotName);
  		}
  		$(function(){
  			$(".ui-autocomplete").autocomplete({
  				source:spotNamesArray
  			})
  		});
// console.log(infoArray);
		  // call weather api 


  	});
  }
  //CALL FUNCTIONS HERE
   ajaxCall(day, month, year);
   console.log("ajaxCall");

   function ajaxSurfHeightCall(spotID, hour){
 	  forecastURL = "http://api.spitcast.com/api/spot/forecast/" + spotID + "/";
	   $.ajax({
 		  url: forecastURL,
 		  method: "GET"
 	  })
 	  .done(function(response){
 		// loops through all data for the chosen spot, looking for the appropriate conditions at current time
		 for (i = 0; i < response.length; i++){
			 if (response[i].hour == hour){
				surfSpot.surfHeight = response[i].size;
				surfSpot.condition = response[i].shape_detail.swell;
			  }
		 }
				setHTML(surfSpot.name, surfSpot.surfHeight, surfSpot.condition, surfSpot.wind, surfSpot.windDirection, surfSpot.waterTemp);				
				
				month = moment().format('l').split("/")[0];			
  				day = moment().format('l').split("/")[1];
  				year = moment().format('l').split("/")[2];

				var dayName2 = moment().format("dddd");
				var monthName2 = moment().format("MMM Do YYYY");
				monthName2 = monthName2.replace('th', '');
				monthName2 = monthName2.replace('rd', '');
				var fullDate = dayName2 +" " +  monthName2;
				// console.log("Formated Date: " + fullDate);
 	  })
   };
   function ajaxWindCall(county, hour){
	   var windURL = "http://api.spitcast.com/api/county/wind/" + county;
	   console.log(windURL);
	   $.ajax({
		     method: "POST",
			 dataType: "json",
			 url: "https://proxy-cbc.herokuapp.com/proxy",
	  		 data: {
				   url:windURL
			   }
			   })
		.done(function(response){
			console.log(response.data.length);
			console.log(response);
		for (i = 0; i < response.data.length; i++){
			 if (response.data[i].hour == hour){
				surfSpot.wind = Math.round(response.data[i].speed_mph);
				surfSpot.windDirection = response.data[i].direction_degrees;
				console.log(surfSpot.wind);
			  }
		 }
		setHTML(surfSpot.name, surfSpot.surfHeight, surfSpot.condition, surfSpot.wind, surfSpot.windDirection, surfSpot.waterTemp);   
	});
}
function ajaxWaterTemp(county){
	var tempURL = "http://api.spitcast.com/api/county/water-temperature/" + county;
	$.ajax({
	  method: "POST",
	  dataType: "json",
 	  url: "https://proxy-cbc.herokuapp.com/proxy",
	  data: {
			  url:tempURL
			}
			   })
		.done(function(response){
			surfSpot.waterTemp = response.data.fahrenheit;

			setHTML(surfSpot.name, surfSpot.surfHeight, surfSpot.condition, surfSpot.wind, surfSpot.windDirection, surfSpot.surfHeight, surfSpot.waterTemp);

	})
}
function ajaxTide(county){
var tideURL = 'http://api.spitcast.com/api/county/tide/' + county;
$.ajax({
  method: "POST",
  dataType: "json",
  url: "https://proxy-cbc.herokuapp.com/proxy",
  data: {
    url: tideURL
  }
})
.done(function(response){
  console.log(response.data);
  for (i = 0; i < response.data.length; i++){
  var tide = response.data[i].tide;
  var time = response.data[i].hour;
  console.log(time);
//   time = time.replace("PM", "");
  //   time = parseInt(time);
  
  surfSpot.tidesArray.push(tide);
  surfSpot.timeArray.push(time);
  
  surfSpot.tideAndTimesArray.push(time);
  surfSpot.tideAndTimesArray.push(tide);

  }
  console.log(surfSpot.tideAndTimesArray);

var options = {}

var data = {
    labels: surfSpot.timeArray,
    datasets: [
        {
             label: '',

            // Boolean - if true fill the area under the line
            fill: false,

            // Tension - bezier curve tension of the line. Set to 0 to draw straight lines connecting points
            // Used to be called "tension" but was renamed for consistency. The old option name continues to work for compatibility.
            lineTension: 0.5,

            // String - the color to fill the area under the line with if fill is true
            //backgroundColor: "rgba(75,192,192,0.4)",

            // String - Line color
            borderColor: "black",

            // String - cap style of the line. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineCap
            borderCapStyle: 'round',

            // Array - Length and spacing of dashes. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash
            borderDash: [],

            // Number - Offset for line dashes. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineDashOffset
            borderDashOffset: 0.0,

            // String - line join style. See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin
            borderJoinStyle: 'miter',

            // The properties below allow an array to be specified to change the value of the item at the given index

            // String or Array - Point stroke color
            pointBorderColor: "black",
			borderWidth: 1,

            // String or Array - Point fill color
            pointBackgroundColor: "#fff",

            // Number or Array - Stroke width of point border
            pointBorderWidth: 0.5,

            // Number or Array - Radius of point when hovered
            pointHoverRadius: 5,

            // String or Array - point background color when hovered
            pointHoverBackgroundColor: "white",

            // String or Array - Point border color when hovered
            pointHoverBorderColor: "rgba(220,220,220,1)",

            // Number or Array - border width of point when hovered
            pointHoverBorderWidth: 2,

            // Number or Array - the pixel size of the point shape. Can be set to 0 to not render a circle over the point
            // Used to be called "radius" but was renamed for consistency. The old option name continues to work for compatibility.
            pointRadius: 1,

            // Number or Array - the pixel size of the non-displayed point that reacts to mouse hover events
            //
            // Used to be called "hitRadius" but was renamed for consistency. The old option name continues to work for compatibility.
            pointHitRadius: 10,

            // The actual data
            data: surfSpot.tidesArray,

            // String - If specified, binds the dataset to a certain y-axis. If not specified, the first y-axis is used. First id is y-axis-0
            yAxisID: "y-axis-0",
			fill: true,

        }]
};
	
	
	var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options
});

});
for (i = 0; i < myLineChart.data.datasets[0].data.length; i++) {
    if (myLineChart.data.datasets[0].data[i] > 10) {
        pointBackgroundColors.push("#90cd8a");
    } else {
        pointBackgroundColors.push("#f58368");
    }
}

myChart.update();
};

  	$("#submitBtn").on("click", function(){
  		var userInput = $("#searchText").val().trim();
  		console.log(userInput);
  		// ajaxCall(day, month, year);
  		for (i = 0; i < infoArray.length; i++){
  			if(userInput == infoArray[i].spot_name){
  				  surfSpot.name = infoArray[i].spot_name;
				  surfSpot.county = infoArray[i].county_name;
				  surfSpot.lat = infoArray[i].latitude;
				  surfSpot.long = infoArray[i].longitude;
				  surfSpot.spotID = infoArray[i].spot_id;
			  }
		  	}
				console.log(surfSpot);
				//gets the current hour to be passed to the ajax call, gets current conditions
				var hour = moment().format('hA');
				
				console.log("ID: " + surfSpot.spotID);
				console.log("hour: " + hour);
				ajaxSurfHeightCall(surfSpot.spotID, hour);
				console.log(surfSpot);
				console.log(surfSpot.surfHeight);
				console.log(surfSpot.condition);
				setHTML(surfSpot.name, surfSpot.surfHeight, surfSpot.condition, surfSpot.wind, surfSpot.windDirection, surfSpot.waterTemp);
				var countyFormatted = surfSpot.county.replace(" ", "-").toLowerCase();
				console.log(countyFormatted);
				ajaxWindCall(countyFormatted, hour);
				ajaxWaterTemp(countyFormatted);
				ajaxTide(countyFormatted);
				setHTML(surfSpot.name, surfSpot.surfHeight, surfSpot.condition, surfSpot.wind, surfSpot.windDirection, surfSpot.waterTemp);   


  	});

function dayFormatter(day){
	
	if (day < 10){
		day = day[1];
		console.log("adjusted day: " + day);
	}
}

function setHTML(spotName, surfHeight, condition, wind, windDirection, waterTemp){
  	$(".spotName").html("<i class = 'glyphicon glyphicon-map-marker'></i>"+ spotName).addClass("h2");
	$(".surfHeight").html("Height: " + surfHeight);
  	$("#poorFairGood").html(condition);
	  conditionsColor(condition);
	
	$(".wind").html("Wind (mph): " + wind + "<i class = 'glyphicon glyphicon-arrow-left'></i>");
	windColor(wind);
	
	$(".glyphicon-arrow-left").css("-webkit-transform" , "rotate(" + windDirection + "deg)");
	$(".wind").append(windDirection + "deg");
	$(".glyphicon-arrow-left").css("background-color:blue");
	console.log(waterTemp);
	$(".waterTemp").html("Water Temp (F):<br>" + waterTemp);
};

function conditionsColor(condition){
	if (condition === "Poor"){
		$("#poorFairGood").css('color', 'red');
	}
	else if (condition === "Poor-Fair"){
		$("#poorFairGood").css('color', 'yellow');
	}
	else if (condition === "Fair"){
		$("#poorFairGood").css('color', 'green');
	}
	else if (condition === "Good"){
		$("#poorFairGood").css('color', 'orange');
	}
}
function windColor(wind){
	if (wind <= 5){
		$(".wind i").css('color', 'green');
	}
	else if (wind > 5 && wind < 10){
		$(".wind i").css('color', 'yellow');
	}
	else if (wind > 10){
		$(".wind i").css('color', 'red');
	}
}