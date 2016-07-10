// also include ngRoute for all our routing needs
var rApp = angular.module('meanRouteApp', ['ngRoute', 'ngResource']);

// configure our routes
rApp.config(function($routeProvider) {
    $routeProvider
        // route for the login page
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController',
            controllerAs : 'lController'
        })

        // route for the console page
        .when('/console', {
            templateUrl : 'pages/console.html',
            controller  : 'consoleController',
            controllerAs : 'cController'
        })            
		
		    // route for the login page
        .when('/login', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController',
            controllerAs : 'lController'
        })	

        // route for the logout page
        .when('/logout', {
            templateUrl : 'pages/logout.html',
            controller  : 'loginController',
            controllerAs : 'lController'
        })  	

        // route for the register page
        .when('/register', {
            templateUrl : 'pages/register.html',
            controller  : 'loginController',
            controllerAs : 'lController'
        })    

        // route for the add page
        .when('/addTech', {
            templateUrl : 'pages/add.html',
            controller  : 'addController',
            controllerAs : 'aController'
        })    


        // route for the edit page
        .when('/editTech', {
            templateUrl : 'pages/edit.html',
            controller  : 'editController',
            controllerAs : 'eController'
        });
});

//defining a service using module.service. 
//begin with creating an independent function
function techServiceFunction(){
  var preserveTechRec = {};
  this.getTech = function(){return preserveTechRec;}
  this.setTech = function(mytech){preserveTechRec = mytech;}

  var isLoggedIN = false;
  this.getLoggedIN = function(){
    return isLoggedIN;
  }
  this.setLoggedIN = function(loginsStatus){isLoggedIN = loginsStatus;}
}
  
//service: create a service on the basis of function
rApp.service('TechService', [techServiceFunction]);

rApp.factory('TechRestService', function($resource) {
  return $resource('/api/tech/:id'); // The full endpoint address
});

// *****************************loginController***********************************
rApp.controller('loginController', 
  ['$http', 'TechService', '$location', function($http, tservice, $location) {
  var self = this;
  self.loginSubmit = function() {
      $http({method: 'post',
            url: '/auth',
            data: self.login,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = 'Login succeessful';
            tservice.setLoggedIN(true);
            $location.path('console');
          }else{
            self.message = 'Login Failed';
            tservice.setLoggedIN(false);
          };
          console.log(self.message);
        }
      );//then
  };//self.loginSubmit 

  self.registerSubmit = function() {
      $http({method: 'post',
            url: '/register',
            data: self.login,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = 'Registration succeessful';
            tservice.setLoggedIN(false);
          }else{
            self.message = 'Registration Failed';
            tservice.setLoggedIN(false);
          };
          console.log(self.message);
        }
      );//then
  };//self.loginSubmit 

}]); //loginController

// *****************************consoleController***********************************
rApp.controller('consoleController', 
  ['$http', '$location', 'TechService', 'TechRestService', 
     function($http, $location, TechService, TechRestService) {
  var self = this;
  self.techRecords = [];
  self.loginStatus = TechService.getLoggedIN();


  self.techRecords = TechRestService.query();

  self.editLinkClicked = function(event) {
    var techToEdit = event.currentTarget.id;
    console.log(" Record to Edit=" + techToEdit);

      $http({method: 'get',
            url: '/api/tech/' + techToEdit,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = JSON.stringify(response.data);
            //valueTech = response.data.tech;
            //valueDesc = response.data.description;
            TechService.setTech(response.data);  //response.data.tech
            console.log("******recordToEdit in consoleController=" + response.data.tech);
            $location.path('editTech');
          }else{
            self.message = 'Record to edit unavailable';
            console.log("******re" + self.message);
          };
          
        }
      );//then
  };//self.editLinkClicked 

self.deleteLinkClicked = function(event) {
    var techToEdit = event.currentTarget.id;
    console.log(" Record to Delete = " + techToEdit);

      $http({method: 'delete',
            url: '/api/tech/' + techToEdit,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = 'Record deleted successfully';
            console.log(self.message);
            self.techRecords = TechRestService.query();
          }else{
            self.message = 'Record could not be deleted';
            console.log(self.message);
          };
        }
      );//then
  };//self.deleteLinkClicked 

}]);//consoleController

// ******************************editController**********************************
rApp.controller('editController', 
    ['$http', '$location', 'TechService', 
      function($http, $location, TechService) {
  var self = this;
  console.log("******recordToEdit in editController=" + TechService.getTech());
  self.loginStatus = TechService.getLoggedIN();
  self.editTech = TechService.getTech();

    self.editFormSubmit = function() {
    console.log("Record to Save after edit (tech* description)= " + self.editTech.tech + "*" + self.editTech.description);

      $http({method: 'put',
            url: '/api/tech',
            data: self.editTech,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = 'Record Saved Successfully';
             $location.path('console');
          }else{
            self.message = 'Record could not be saved';
            console.log("******Server response from edit save=" + self.message);
          };
        }
      );//then
  };//self.editFormSubmit 
}]);//editController

// **********************************addController******************************
rApp.controller('addController', 
    ['$http', '$location', 'TechService', 'TechRestService',
      function($http, $location, TechService, TechRestService) {
  var self = this;
  self.addTech = {};

    self.addFormSubmit = function() {
    console.log("Record to Save after add (tech* description)= " + self.addTech.tech + "*" + self.addTech.description);

      $http({method: 'post',
            url: '/api/tech',
            data: self.addTech,
            headers: {'Content-Type': 'application/vnd.api+json'}
      }).then(
        function(response) {
          if(response.data){
            self.message = 'Record added Successfully';
            $location.path('console');

          }else{
            self.message = 'Record could not be added';
            console.log("******Server response from add save=" + self.message);
          };
        }
      );//then
  };//self.editFormSubmit 
}]);//addController
  
