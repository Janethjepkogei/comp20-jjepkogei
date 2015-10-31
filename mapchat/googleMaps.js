var myLat =0;
var myLng = 0;
var request =  new XMLHttpRequest;
var message = "noMessage";
var landmark = new google.maps.LatLng(myLat,myLng);
var map;
var marker;
var infowindow = new google.maps.InfoWindow();
var myOptions = {
		zoom: 13,
		center: landmark,
		mapTypeId: google.maps.MapTypeId.ROADMAP
};

function init()
{
	map = new google.maps.Map(document.getElementById("myMap"), myOptions);

	getLocation();
}

function getLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			renderMap();
		});
	}
//parse();
}

function renderMap(){
	landmark = new google.maps.LatLng(myLat, myLng);

	map.panTo(landmark);

		marker = new google.maps.Marker({
			position: landmark,
			title: "Here I am"
		});

	marker.setMap(map);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(marker.title);
		infowindow.open(map, marker);
	});

}

function parse(){
	request.open('POST', 'https://secret-about-box.herokuapp.com/sendLocation', true);

	request.onreadystatechange = function ()
	{
		if(request.state == 4 && request.status == 200)
		{
			data = request.responseText;
			message = JSON.parse(data);
		}

	};
	request.send(null);
}
