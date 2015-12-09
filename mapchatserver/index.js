
var express = require('express');

var bodyParser = require('body-parser');
var validator = require('validator');

var app = express();

 app.use(bodyParser.json());

 app.use(bodyParser.urlencoded({extended: true}));


var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydatabase';

var MongoClient = require('mongodb').MongoClient, format = require('util').format;

var db = MongoClient.connect(mongoUri, function(error,databaseConnection) {
		db = databaseConnection; 
 });

app.post('/sendLocation',function(request,response){

		response.header("Access-Control-Allow-Origin", "*");
		response.header("Access-Control-Allow-headers", "X-Requested-With");
		var login = request.body.login;
		var lng = JSON.parse(request.body.lng);
		var lat = JSON.parse(request.body.lat);
		var msg = request.body.message;
		var date = Date();

		var approvedLogin = ['mchow', 'kaytea', 'CindyLytle', 'BenHarris', 'JeremyMaletic', 'LeeMiller', 'EricDapper', 'RichRumfelt', 'VanAmmerman', 'VicJohnson', 'ErinHolleman', 'PatFitzgerald', 'CheriVasquez', 'HarleyRhoden', 'JanetGage', 'HarleyConnell', 'GlendaMaletic', 'JeffSoulen', 'MarkHair', 'RichardDrake', 'CalvinStruthers', 'LeslieDapper', 'JefflynGage', 'PaulRamsey', 'BobPicky', 'RonConnelly', 'FrancieCarmody', 'ColleenSayers', 'TomDapper', 'MatthewKerr', 'RichBiggerstaff', 'MarkHarris', 'JerryRumfelt', 'JoshWright', 'LindyContreras', 'CameronGregory', 'MarkStruthers', 'TravisJohnson', 'RobertHeller', 'CalvinMoseley', 'HawkVasquez', 'LayneDapper', 'HarleyIsdale', 'GaylaSoulen', 'MatthewRichards', 'RoyDuke', 'GaylaRodriquez', 'FrancieGeraghty', 'LisaLytle', 'ErinHair', 'CalvinGraham', 'VanRhoden', 'KeithRumfelt', 'GlendaSmith', 'KathrynJohnson', 'FredVandeVorde', 'SheriMcKelvey', 'RoyMiller', 'PatIsdale', 'JoseRodriquez', 'KelleyRumfelt', 'JanetKinsey', 'RonCampbell', 'BenKerr', 'RobDennison', 'BobOwens', 'CherylLytle', 'LisaSoulen', 'TravisDuke', 'CindyGregory', 'JoyceVandeVorde', 'MatthewScholl', 'RobJohnson', 'EricHawthorn', 'CameronRodriquez', 'JoshRamsey', 'CalvinDuke', 'SheriHeller', 'LeaAmmerman', 'LayneVasquez', 'IMConnell', 'BenHauenstein', 'ColleenKerr', 'HawkRichards', 'LeaIsdale', 'RickSoulen', 'RoyMcFatter', 'KyleContreras', 'MaryHeller', 'KathrynFitzgerald', 'JanetRiedel', 'PatHawthorn', 'KeithHauenstein', 'BenRichards', 'RickVasquez', 'KelleyAmmerman', 'EvanConnelly', 'KendallRumfelt', 'TravisIsdale', 'RobContreras', 'JavierRussell', 'ColleenCampbell', 'JeremyConnelly', 'BenKinsey', 'JanetScholl', 'PaulaLewis', 'LeslieMcFatter', 'MatthewMcAda', 'LeeMuilman', 'KyleMoseley', 'JeffRhoden', 'AnitaHolleman', 'JefflynMcKelvey', 'BobContreras', 'RobFitzgerald', 'BenJohnson'];

		if (approvedLogin.indexOf(login) <= -1 || lng == undefined || lat == undefined || msg == undefined){
			response.send({"error":"Whoops, something is wrong with your data!"});
		}
		else{
		//how do I check that the data to store in JSON file is complete?
		var toInsert = {
				"login": login,
				"lng": lng,
				"lat": lat,
				"message": msg,
				"created_at": date,
		};

		db.collection('checkins', function (error, coll){

		var id = coll.insert ( toInsert, function(error,saved){
			if(error){
				response.send(500); //TODO: RETURN A REALISTIC ERROR 
			}
			else{	

				response.status(200);
	  			coll.find({}).toArray(function(error2, cursor) {
					response.send(JSON.stringify(cursor));
				});
			}
		});
		});
		}	
	});
	
app.get('/latest.json', function(request,response){

	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-headers", "X-Requested-With");

	response.set('Content-Type', 'text/html');

	var login = request.query.login;

	if(login == undefined){

		response.status(404);
		response.send({});
	}
	else{

		db.collection('checkins', function(er,collection){
			collection.find().sort({created_at: -1}).toArray(function(error, cursor){

				if(error){
					response.status(404);
					response.send({});
				}
				else{
					response.status(200);
					response.send(JSON.stringify(cursor[0]));
				}
			});
	
		});

	}
});

app.get('/', function(request,response){

	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-headers", "X-Requested-With");

	response.set('Content-Type', 'text/html');
	var indexpage = '';

	db.collection('checkins',function(er,collection){
		collection.find().sort({created_at: -1}).toArray(function(error,cursor){
			if(error){
				indexpage += '<!DOCTYPE HTML><html><head><title>List of the check-ins and messages </title></head><body><h1>Whoops, something went wrong!</h1></body></html>';
				response.send(indexpage);
			}
			else{
				indexpage += '<!DOCTYPE HTML><html><head><title> List of the check-ins and messages </title></head><body><h1>List of the check-ins and messages for all logins: </h1>'; 

				for(var i = 0; i < cursor.length; i++){
					indexpage += "<p>" + cursor[i].login + " checked in at " + cursor[i].lat + " , " + 
								cursor[i].lng+ " on " + cursor[i].created_at + " and wrote " + cursor[i].message + ".</p>";
				}

				indexpage += '</body></html>';
				response.send(indexpage);
			}
		});
	});


});


app.listen(process.env.PORT || 3000);







