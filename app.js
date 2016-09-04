var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');

var chalk = require('chalk');
var db = require('./models/db.js');  // db.js must be required before routes.js
var app = module.exports = express(); // exporting apps must be done before routes.js
var routes = require('./routes/routes.js');


app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(bodyparser.json({ type: 'application/vnd.api+json' })); 
app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));

app.post('/auth', routes.authHandler);
app.post('/register', routes.registerUserHandler);

// REST Routes
app.get('/api/tech', routes.getAllHandler);  // return all tech records
app.get('/api/tech/:tech', routes.getOneHandler);  // return one record
app.post('/api/tech', routes.postOneHandler); // add new tech record
app.put('/api/tech/:tech', routes.updateOneHandler); // update a record
app.delete('/api/tech/:tech', routes.deleteOneHandler); // detete a record


var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log(chalk.green('HTTP server is listening on port: ' + port));
});

