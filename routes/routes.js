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
	var nmReq = req.body.nm;
	var pwdReq = req.body.pwd;
	var authResult;
  req.session.loggedin = false;

	UserModel.findOne({username:nmReq}, function(err, userObj){
    if(userObj === null){
     	authResult = '<span class="label label-danger">Login Failed: User name does not exist in db</span>' ;
      res.render('message.handlebars', {message:authResult, 
                                        LoggedIN: req.session.loggedin
                                        });
    } else if (pwdReq === userObj.password){
				authResult =   '<span class="label label-success">Login successful</span>' ;   
        req.session.loggedin = true;
        //****** go directly to console page 
        // req.url = '/console';
        // req.method = 'get';
        // app._router.handle(req, res);

        //****** go to console page
        res.render('message.handlebars', {message:authResult,
                                         LoggedIN: req.session.loggedin
                                        });
	  } else{
				authResult = '<span class="label label-danger">Login Failed: Password did not match</span>' ; 
        res.render('message.handlebars', {message:authResult, 
                                          LoggedIN: req.session.loggedin});
	  }
		console.log("Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, authResult);
	});//UserModel.findOne
}; //authHandler


exports.consoleHandler = function (req, res){
  if (req.session.loggedin){}else{
    res.status(500);
    res.send("Incorrect request");
    return;
  }
  
  var recordsArray; //to keep all tech records
  TechModel.find({}, function(err, techArray){
    if (!err){
      recordsArray = techArray;
      res.render('console.handlebars', {recordsArray:recordsArray,
                                        LoggedIN: req.session.loggedin
                                       });
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
  TechModel.findOne({tech:techToEdit}, function(err, techRec){
  if (!err){
    console.log(chalk.yellow("Going to edit -> [" + techRec.tech + " : " + techRec.description + "]"));
    res.render('editPage.handlebars', {techRec: techRec, LoggedIN: req.session.loggedin});
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
     res.render('message.handlebars', {message: message, LoggedIN: req.session.loggedin});
   }else{
     message = '<span class="label label-success">A record saved succesfully</span>';
     console.log(chalk.green(message));
     res.render('message.handlebars', {message: message, LoggedIN: req.session.loggedin});
   }
  });
}; //saveChangesHandler

exports.deletePageHandler = function(req, res){
  var techToEdit = req.query.tech;
  TechModel.remove({tech:techToEdit}, function(err, techRec){
  if (!err){
    var message = '<span class="label label-success">A record removed successfully</span>'
    res.render('message.handlebars', {message: message, LoggedIN: req.session.loggedin});
  } 
}); //TechModel.remove
}; //editPageHandler

exports.addFormHandler = function(req, res){
    res.render('add.handlebars', {LoggedIN: req.session.loggedin});
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
       res.render("message.handlebars", {message:message, LoggedIN: req.session.loggedin});
     }else{
       message = '<span class="label label-success">A new technology added successfully</span>';
       res.render('message.handlebars', {message:message, LoggedIN: req.session.loggedin});
     }
   }); //newTech.save
}; //addHandler

