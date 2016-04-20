var mongoose = require( 'mongoose' );
var UserModel = mongoose.model( 'UserModel' );
var TechModel = mongoose.model( 'TechModel' );
var gLoggedIN = 0;

exports.loginPageHandler = function (req, res){
	res.render('login.handlebars', {LoggedIN: gLoggedIN});
};//loginPageHandler

exports.logoutPageHandler = function (req, res){
  req.session.destroy();
  gLoggedIN = 0;
  res.render('message.handlebars', {message:'You have logged-out successfully.', 
                                   LoggedIN: gLoggedIN});
};//logoutPageHandler

exports.authHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var authResult;

	UserModel.findOne({username:nmReq}, function(err, userObj){
    if(userObj === null){
     	authResult = "Login Failed: User name does not exist in db";
      res.render('message.handlebars', {message:authResult, 
                                        LoggedIN: gLoggedIN
                                        });
    } else if (pwdReq === userObj.password){
				authResult = "Login successful";
        gLoggedIN = 1;
        res.render('message.handlebars', {message:authResult,
                                          LoggedIN: gLoggedIN
                                         });
	  } else{
				authResult = "Login Failed: Password did not match";
        res.render('message.handlebars', {message:authResult, 
                                          LoggedIN: gLoggedIN});
	  }
		console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, authResult);
	});//UserModel.findOne
}; //authHandler


exports.consoleHandler = function (req, res){
  var recordsArray; //to keep all tech records
  TechModel.find({}, function(err, techArray){
    if (!err){
      recordsArray = techArray;
      outcomeBoolean = 1;
      gLoggedIN = 1;
      res.render('console.handlebars', {recordsArray:recordsArray,
                                        LoggedIN: gLoggedIN
                                       });
      } 
  }); //TechModel.find       
}; //consoleHandler



exports.registerFormHandler = function(req, res){
   res.render("register.handlebars", {LoggedIN: gLoggedIN});
}; //registerFormHandler

exports.registerUserHandler = function(req, res){
   var newuser = new UserModel();
   newuser.username = req.body.username;;
   newuser.email = req.body.email;
   newuser.password = req.body.password;

   //save to db through model :: Add a record
   newuser.save(function(err, savedUser){
     if(err){
       var message = "A user already exists with that username or email";
       console.log(message);
       res.render("register.handlebars", {errorMessage:message, 
                                          LoggedIN: gLoggedIN});
     }else{
       req.session.newuser = savedUser.username;
       res.render('message.handlebars', {message:"Registration succesful", 
                                         LoggedIN: gLoggedIN});
     }
   }); //newuser.save
};//registerUserHandler

exports.editPageHandler = function(req, res){
  var techToEdit = req.query.tech;
  console.log("Tech to edit : " + techToEdit);
  TechModel.findOne({tech:techToEdit}, function(err, techRec){
  if (!err){
    console.log(techRec.tech + " : " + techRec.description );
    res.render('editPage.handlebars', {techRec: techRec, LoggedIN: gLoggedIN});
  } 
}); //TechModel.findOne
}; //editPageHandler

exports.saveChangesHandler = function(req, res){
  var techRequest = req.body.techname;
  var techDescrRequest = req.body.techdescr;
  //console.log("Saving Edited records : " + techRequest + " : " + techDescrRequest);
  var message;
  //update rec through model
  TechModel.update({tech:techRequest}, 
                    {$set: { description: techDescrRequest }}, 
                    {multi:false}, function(err, updatedRec){
   if(err){
     message = "Update failed for tech : " + techRequest;
     console.log(message);
     res.render('message.handlebars', {message: message, LoggedIN: gLoggedIN});
   }else{
     message = "A record saved succesfully ";
     console.log(message);
     res.render('message.handlebars', {message: message, LoggedIN: gLoggedIN});
   }
  });
}; //saveChangesHandler
