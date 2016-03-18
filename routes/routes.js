var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var bcrypt = require('bcrypt');

exports.loginPageHandler = function (req, res){
	req.session.destroy();
	res.render('login.handlebars', {});
};//loginPageHandler

exports.landingPageHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var loginOutcome;

	mongoose.model('User').findOne({username:nmReq}, function(err, userObj){
	    if(userObj === null){
	     	loginOutcome = "Login Failed: User name does not exist in db";
	    } else {  //userObj is Not NULL
	    	bcrypt.compare(pwdReq, userObj.password, function(err, isMatch) {
		        if (err) {
		        	loginOutcome = "Login Failed : bcrypt.comare yielded error" ;
		        }else if (isMatch === true){
					loginOutcome = "Login successful";
				} else{
					loginOutcome = "Login Failed: Password did not match";
				}
		     }
	    }//userObj is Not NULL
		console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
		res.render('landingpage.handlebars', {welcomeMessage:loginOutcome});
	});//findOne
}; //landingPageHandler


exports.registerFormHandler = function(req, res){
   res.render("register", {});
}; //registerFormHandler

exports.registerUserHandler = function(req, res){
   var usernameReq = req.body.username;
   var emailReq = req.body.email;
   var passwordReq = req.body.password;

   var newuser = new User();
   newuser.username = usernameReq;
   newuser.email = emailReq;
   newuser.password = passwordReq;

   //save to db through model
   newuser.save(function(err, savedUser){
       if(err){
         var message = "A user already exists with that username or email";
         console.log(message);
         res.render("register", {errorMessage:message});
         return;
       }else{
         req.session.newuser = savedUser.username;
         res.render('landingpage.handlebars', {welcomeMessage:"Registration succesful"});
       }
   });
};//registerUserHandler
