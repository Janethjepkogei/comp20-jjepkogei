
function parse(){
	var request = new XMLHttpRequest();
	var message = "noMessage";
	request.open('GET', 'http://messagehub.herokuapp.com/messages.json',true);

	request.onreadystatechange = function(){
	 		 	if (request.readyState == 4 && request.status == 200){
	 				data = request.responseText;
	 				message = JSON.parse(data);
	 				elem = document.getElementById("messages");

	 				for(var i =0; i < message.length; i++ ){
	 					elem.innerHTML +="<p>" + message[i].content + " "+message[i].username + "</p>"
	 				}
	 	}

	 };
	 request.send(null);
}