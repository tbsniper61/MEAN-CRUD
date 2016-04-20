var express = require('express');
var bodyparser = require('body-parser');
var session = require('express-session');
var hbars = require('express-handlebars');
var chalk = require('chalk');
var db = require('./models/db.js');  // db.js must be required before routes.js
var routes = require('./routes/routes.js');
var app = express();


app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));
app.set('view engine', 'handlebars');
app.engine('handlebars', hbars({}));

app.get('/', routes.loginPageHandler);
app.get('/logout', routes.logoutPageHandler);
app.post('/auth', routes.authHandler);
app.get('/console', routes.consoleHandler);
app.get('/registerForm', routes.registerFormHandler);
app.post('/register', routes.registerUserHandler);
app.get('/edit', routes.editPageHandler);
app.post('/saveChanges', routes.saveChangesHandler);


//error handling
app.use("*", function(req, res) {
     res.status(404);
     res.render('404.handlebars', {});
});

app.use(function(error, req, res, next) {
     console.log(chalk.red('Error : 500::' + error))
     res.status(500);
     res.render('500.handlebars', {err:error});  // good for knowledge but don't do it
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('HTTP server is listening on port: ' + port);
});