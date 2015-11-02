var myLat =0;
var myLng = 0;
var message = "noMessage";
var landmark = new google.maps.LatLng(myLat,myLng);
var map;
var marker;
var login;
var infowindow;
var mycurrentLat;
var mycurrentLng;
var distanceDiff;
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
		for(var i =0; i < message.length; i++)
		 {
		 	infowindow = new google.maps.InfoWindow();
			myLat = message[i].lat;
			myLng = message[i].lng;
			login = message[i].login;
			note = message[i].message;
			distanceDiff = distanceFromMe();
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
			distance: distanceDiff
		});

	marker.setMap(map);

		google.maps.event.addListener(marker, 'click', function() {
		if(myLat == mycurrentLat && myLng == mycurrentLng){
			infowindow.setContent(marker.title + "<br/> message: " + marker.message);

		}
		else{
			infowindow.setContent(marker.title + "<br/> message: " + marker.message + "<br/> Distance from me: " + marker.distance);
		}
		infowindow.open(map, marker);
	});

}
function toRad(x) {
   return x * Math.PI / 180;
}


function distanceFromMe()
{

	var R = 6371; // km 

	var dLat = toRad(mycurrentLat - myLat); 
	
	var dLon = toRad(mycurrentLng - myLng);  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(toRad(mycurrentLat)) * Math.cos(toRad(myLat)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 
	return d;
}


function parse(){

	var request =  new XMLHttpRequest;

	request.open('POST', 'https://secret-about-box.herokuapp.com/sendLocation', true);
	request.onreadystatechange = function ()
	{

				if(request.readyState == 4 && request.status == 200)
		{
			data = request.responseText;
			message = JSON.parse(data);
			getLocation();

		}

	};

	var params = "login=RobertHeller&lat=" + mycurrentLat + "&lng="+ mycurrentLng + "&message=" +"Hello%20world";
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(params);
}
