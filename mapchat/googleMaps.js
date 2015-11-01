var myLat =0;
var myLng = 0;
var message = "noMessage";
var landmark = new google.maps.LatLng(myLat,myLng);
var map;
var marker;
var login;
var infowindow = new google.maps.InfoWindow();
var mycurrentLat;
var mycurrentLng;
var myOptions = {
		zoom: 13,
		center: landmark,
		mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init()
{
	map = new google.maps.Map(document.getElementById("myMap"), myOptions);

	
	getMyLocation();
}

function getLocation()
{
	
	if(navigator.geolocation)
	{
		console.log(message[0]);
		for(var i =0; i < message.length; i++)
		 {
			myLat = message[i].lat;
			myLng = message[i].lng;
			login = message[i].login;
			note = message[i].message;
			distanceDiff = distanceFromMe(myLat,myLng);
			renderMap();
		}
	}

}
 function getMyLocation() {
				if (navigator.geolocation) { 
					navigator.geolocation.getCurrentPosition(function(position) {
						 mycurrentLat = position.coords.latitude;
						 mycurrentLng = position.coords.longitude;
						 parse();
					});
			}	
	}

function renderMap(){
	landmark = new google.maps.LatLng(myLat, myLng);

	map.panTo(landmark);
		marker = new google.maps.Marker({
			position: landmark,
			title: login,
			message: note,
			
		});

	marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
		if(myLat == mycurrentLat && myLng == mycurrentLng){
			infowindow.setContent(marker.title + "<br/> message: " + marker.message);

		}
		else{
			infowindow.setContent(marker.title + "<br/> message: " + marker.message + "<br/> Distance from me: " );
		}
		infowindow.open(map, marker);
	});

}

function distanceFromMe(var myLat, var myLng)
{
	

}


function parse(){

var request =  new XMLHttpRequest;

	request.open('POST', 'https://secret-about-box.herokuapp.com/sendLocation', true);
	request.onreadystatechange = function ()
	{

		console.log(request.readyState);
		if(request.readyState == 4 && request.status == 200)
		{
			data = request.responseText;
			message = JSON.parse(data);
			//console.log(message[0]);
			getLocation();

		}

	};

	var params = "login=RobertHeller&lat=" + mycurrentLat + "&lng="+ mycurrentLng + "&message=" +"Hello%20world";
	// set headers
	//params = "<Your location in the right format>"
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
}
