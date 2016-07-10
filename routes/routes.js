var mongoose = require( 'mongoose' );
var UserModel = mongoose.model( 'UserModel' );
var TechModel = mongoose.model( 'TechModel' );
var chalk = require('chalk');
var app = require('../app');//expressJS allows circular dependencies


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


exports.registerUserHandler = function(req, res){
   var newuser = new UserModel();
   newuser.username = req.body.loginName;;
   newuser.email = req.body.email;
   newuser.password = req.body.loginPassword;
   console.log("Reg " + newuser.username + "  " + newuser.email + " " + newuser.password);
   //save to db through model :: Add a record
   newuser.save(function(err, savedUser){
     if(err){
       var message = "A user already exists with that username or email";
       console.log(message);
       res.json(false);
     }else{
       req.session.newuser = savedUser.username;
       res.json(true);
     }
   }); //newuser.save
};//registerUserHandler
 

/* ******** ******** ******** ******** ******** ********  */
/* ******** ******** REST API HANDLERS ******** ********  */
/* ******** ******** ******** ******** ******** ********  */
exports.getAllHandler = function (req, res){
  //app.get('/api/tech'
  TechModel.find({}, function(err, techArray){
    if (!err){
      res.json(techArray);
      //console.log("tech array being returned=" + JSON.stringify(techArray));
    } 
  }); //TechModel.find       
}; //getAllHandler

exports.getOneHandler = function(req, res){
  //app.get('api/edit/:tech'
  var techToEdit = req.params.tech;
  console.log("techToEdit="  + techToEdit);
  TechModel.findOne({tech:techToEdit}, function(err, techRec){
  if (!err){
    console.log(chalk.yellow("Going to edit -> [" + techRec.tech + " : " + techRec.description + "]"));
    res.json(techRec);
  } 
}); //TechModel.findOne
}; //getOneHandler

exports.postOneHandler = function(req, res){
  //app.post('/api/tech'
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
}; //postOneHandler

exports.updateOneHandler = function(req, res){
  //app.put('/api/tech'
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
}; //updateOneHandler

exports.deleteOneHandler = function(req, res){
  //app.delete('/api/tech/:tech'
  var techToEdit = req.params.tech;
  TechModel.remove({tech:techToEdit}, function(err, techRec){
    if(err){
       res.json(false);
       console.log(techToEdit + " could not be deleted");
     }else{
       res.json(true);
       console.log(techToEdit + " deleted successfully");
     } 
  }); //TechModel.remove
}; //deleteOneHandler




