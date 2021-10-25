const express = require("express");
var app = express();
const mysql = require('mysql');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
//var popup = require('popups');
const encoder = bodyParser.urlencoded();

var connection = mysql.createConnection({
  host: "localhost",
  user: "jyl",
  password: "1234",
  database: "donor"
});  
      
connection.connect((err) => {
    if (err)
        throw err;
    console.log("Connected!");
});

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


//donor detail function (insert)__:
app.post('/snd',encoder, function(request, response) {
	var name = request.body.name;
	var addr = request.body.addr;
	var city = request.body.city;
	var state = request.body.state;
	var cont = request.body.con;
	var pin = request.body.pin;
	var phn = request.body.phone;
	var email = request.body.email; 

	// var values = (name, addr, city, state, cont, pin, phn, email);  
	var sql = "INSERT INTO d_details (\`name\`, \`addr\`, \`city\`, \`state\`, \`country\`, \`pincode\`, \`phn\`, \`email\`) VALUES ('"+ name +"', '"+ addr +"', '"+ city +"', '"+ state +"', '"+ cont +"', '"+ pin +"', '"+ phn +"', '"+ email +"')";
	connection.query(sql, function (err, result) {  
		if (!err){
			console.log("1 record inserted");
			response.redirect("https://rzp.io/l/1PZVJID");
		}else{
			response.send('something went wrong..!');
			throw err
		}
	});  
});

//login function___:
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth',encoder, function(request, response) {
	var username = request.body.user;
	var password = request.body.pwd;

	if (username && password) {
		connection.query('SELECT * FROM login WHERE usernm = ? AND pass = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/index');
			} else {
				response.send('incorrect username and password')
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/index', function(request, response) {
	if (request.session.loggedin) {
		console.log('Welcome back, ' + request.session.username + '!');
		response.redirect('index.html');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

const PORT = process.env.PORT || 1020;

    app.listen(PORT, () => {
        app.use(express.static(__dirname));
        console.log(`App is listening on Port ${PORT}`);
      });