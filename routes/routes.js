var mongoose = require( 'mongoose' );
var UserModel = mongoose.model( 'UserModel' );
var TechModel = mongoose.model( 'TechModel' );
var chalk = require('chalk');
var app = require('../app');//expressJS allows circular dependencies



exports.loginPageHandler = function (req, res){
	res.render('login.handlebars', {LoggedIN: false});
};//loginPageHandler

exports.logoutPageHandler = function (req, res){
  req.session.destroy();
 
  res.render('message.handlebars', {message:'<span class="label label-success">You have logged-out successfully</span>', 
                                   LoggedIN: false});
};//logoutPageHandler

exports.authHandler = function (req, res){
	var nmReq = req.body.loginName;
	var pwdReq = req.body.loginPassword;
	var authResult;
  req.session.loggedin = false;

	UserModel.findOne({username:nmReq}, function(err, userObj){
    var authResult;
    if(userObj === null){
      authResult = false;
    } else if (pwdReq === userObj.password){
      authResult = true;
	  } else{
			authResult = false;
	  }
    res.json(authResult);
		console.log("Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, authResult);
	});//UserModel.findOne
}; //authHandler


exports.consoleHandler = function (req, res){
  // if (req.session.loggedin){}else{
  //   res.status(500);
  //   res.send("Incorrect request");
  //   return;
  // }

  TechModel.find({}, function(err, techArray){
    if (!err){
      res.json(techArray);
      //console.log("tech array being returned=" + JSON.stringify(techArray));
    } 
  }); //TechModel.find       
}; //consoleHandler



exports.registerFormHandler = function(req, res){
   res.render("register.handlebars", {LoggedIN: req.session.loggedin});
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
                                          LoggedIN: req.session.loggedin});
     }else{
       req.session.newuser = savedUser.username;
       res.render('message.handlebars', {message:'<span class="label label-success">Registration successful</span>', 
                                         LoggedIN: req.session.loggedin});
     }
   }); //newuser.save
};//registerUserHandler

exports.editPageHandler = function(req, res){
  var techToEdit = req.query.tech;
  console.log("techToEdit="  + techToEdit);
  TechModel.findOne({tech:techToEdit}, function(err, techRec){
  if (!err){
    console.log(chalk.yellow("Going to edit -> [" + techRec.tech + " : " + techRec.description + "]"));
    res.json(techRec);
  } 
}); //TechModel.findOne
}; //editPageHandler

exports.saveChangesHandler = function(req, res){
  var techRequest = req.body.tech;
  var techDescrRequest = req.body.description;
  console.log("Saving Edited records : " + techRequest + " : " + techDescrRequest);
  var message;
  //update rec through model
  TechModel.update({tech:techRequest}, 
                    {$set: { description: techDescrRequest }}, 
                    {multi:false}, function(err, updatedRec){
   if(err){
     res.json(false);
   }else{
     res.json(true);
   }
  });
}; //saveChangesHandler

exports.deletePageHandler = function(req, res){
  var techToEdit = req.query.tech;
  TechModel.remove({tech:techToEdit}, function(err, techRec){
  if(err){
     res.json(false);
     console.log(techToEdit + " could not be deleted");
   }else{
     res.json(true);
     console.log(techToEdit + " deleted successfully");
   } 
}); //TechModel.remove
}; //editPageHandler

exports.addFormHandler = function(req, res){
    res.render('add.handlebars', {LoggedIN: req.session.loggedin});
 }; //addFormHandler

exports.addHandler = function(req, res){
  var message;
  var newTech = new TechModel();
  newTech.tech = req.body.tech;
  newTech.description = req.body.description;
   //save to db through model :: Add a record
   newTech.save(function(err, savedUser){
     if(err){
     res.json(false);
     console.log(techToEdit + " could not be added");
   }else{
     res.json(true);
     console.log(techToEdit + " added successfully");
   } 
   }); //newTech.save
}; //addHandler

