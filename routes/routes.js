var mongoose = require( 'mongoose' );
var UserModel = mongoose.model( 'UserModel' );
var TechModel = mongoose.model( 'TechModel' );
var chalk = require('chalk');
var gLoggedIN = 0;

exports.loginPageHandler = function (req, res){
	res.render('login.handlebars', {LoggedIN: gLoggedIN});
};//loginPageHandler

exports.logoutPageHandler = function (req, res){
  req.session.destroy();
  gLoggedIN = 0;  
  res.render('message.handlebars', {message:'<span class="label label-success">You have logged-out successfully</span>', 
                                   LoggedIN: gLoggedIN});
};//logoutPageHandler

exports.authHandler = function (req, res){
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var authResult;

	UserModel.findOne({username:nmReq}, function(err, userObj){
    if(userObj === null){
     	authResult = '<span class="label label-danger">Login Failed: User name does not exist in db</span>' ;
      res.render('message.handlebars', {message:authResult, 
                                        LoggedIN: gLoggedIN
                                        });
    } else if (pwdReq === userObj.password){
				authResult =   '<span class="label label-success">Login successful</span>' ;   
        gLoggedIN = 1;
        res.render('message.handlebars', {message:authResult,
                                          LoggedIN: gLoggedIN
                                         });
	  } else{
				authResult = '<span class="label label-danger">Login Failed: Password did not match</span>' ; 
        res.render('message.handlebars', {message:authResult, 
                                          LoggedIN: gLoggedIN});
	  }
		console.log("Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, authResult);
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
       res.render('message.handlebars', {message:'<span class="label label-success">Registration successful</span>', 
                                         LoggedIN: gLoggedIN});
     }
   }); //newuser.save
};//registerUserHandler

exports.editPageHandler = function(req, res){
  var techToEdit = req.query.tech;
  TechModel.findOne({tech:techToEdit}, function(err, techRec){
  if (!err){
    console.log(chalk.yellow("Going to edit -> [" + techRec.tech + " : " + techRec.description + "]"));
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
     message = '<span class="label label-danger">Update Failed</span>';
     console.log(chalk.red(message));
     res.render('message.handlebars', {message: message, LoggedIN: gLoggedIN});
   }else{
     message = '<span class="label label-success">A record saved succesfully</span>';
     console.log(chalk.green(message));
     res.render('message.handlebars', {message: message, LoggedIN: gLoggedIN});
   }
  });
}; //saveChangesHandler

exports.deletePageHandler = function(req, res){
  var techToEdit = req.query.tech;
  TechModel.remove({tech:techToEdit}, function(err, techRec){
  if (!err){
    var message = '<span class="label label-success">A record removed successfully</span>'
    res.render('message.handlebars', {message: message, LoggedIN: gLoggedIN});
  } 
}); //TechModel.remove
}; //editPageHandler

exports.addFormHandler = function(req, res){
    res.render('add.handlebars', {LoggedIN: gLoggedIN});
 }; //addFormHandler

exports.addHandler = function(req, res){
  var message;
  var newTech = new TechModel();
  newTech.tech = req.body.techname;
  newTech.description = req.body.techdescr;
   //save to db through model :: Add a record
   newTech.save(function(err, savedUser){
     if(err){
       message = '<span class="label label-danger">A record already exists with given technology</span>';
       console.log(message);
       res.render("message.handlebars", {message:message, LoggedIN: gLoggedIN});
     }else{
       message = '<span class="label label-success">A new technology added successfully</span>';
       res.render('message.handlebars', {message:message, LoggedIN: gLoggedIN});
     }
   }); //newTech.save
}; //addHandler

