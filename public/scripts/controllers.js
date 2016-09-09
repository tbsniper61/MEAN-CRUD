// ***************************** menuController ***********************************
rApp.controller('menuController', 
  ['$scope', 'TechService', function($scope, TechService) {
  
  $scope.loginStatus = TechService.getLoggedIN();
  $scope.username = TechService.getUsername();

  TechService.subscribe($scope, function somethingChanged() {
        $scope.loginStatus = TechService.getLoggedIN(); // Handle notification
        $scope.username = TechService.getUsername();
  });//subscribe

  $scope.logoutSubmit = function() {
    TechService.setLoggedIN(false);
    $scope.loginStatus = TechService.getLoggedIN();
    TechService.setUsername("")
    $scope.username = TechService.getUsername();
  }//logoutSubmit

}]);//menuController

// ***************************** loginController ***********************************
rApp.controller('loginController', 
  ['$scope', '$http', 'TechService', '$location',  function($scope, $http, tservice, $location) {
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
            tservice.setUsername(self.login.loginName);
            tservice.notify();
            $location.path('console');
          }else{
            self.message = 'Login Failed';
            tservice.setLoggedIN(false);
            tservice.notify();
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
            $location.path('login');
          }else{
            self.message = 'Registration Failed';
          };
          console.log(self.message);
        }
      );//then
  };//self.loginSubmit 

}]); //loginController


// ***************************** consoleController ***********************************
rApp.controller('consoleController', 
  ['$location', 'TechService', 'RestService', 
     function($location, TechService, RestService) {
  var cc = this;
  cc.techRecords = [];
  cc.loginStatus = TechService.getLoggedIN();
  cc.techRecords = RestService.query();
}]);//consoleController

// ****************************** editController **********************************
rApp.controller('editController', 
    ['$routeParams', 'RestService', '$location', 'TechService', 
      function($routeParams, RestService, $location, TechService) {
  var ec = this;

  ec.loginStatus = TechService.getLoggedIN();
  //fetch single record to be edited in view
  ec.editTech = RestService.get({tech:$routeParams.editTech});
  
  ec.editFormSubmit = function() {
    console.log("to update tech=%s, description=%s", ec.editTech.tech, ec.editTech.description);

    RestService.update({tech:$routeParams.editTech}, ec.editTech);
    $location.path('console');
  };//ec.editFormSubmit 

}]);//editController

// ********************************** addController ******************************
rApp.controller('addController', 
    ['RestService', '$location', 'TechService', 
      function(RestService, $location, TechService) {
  var ac = this;
  ac.addTech = {};

  ac.addFormSubmit = function() {
    console.log("to Save after add tech=%s, description=%s ", 
      ac.addTech.tech, ac.addTech.description);

    var newRec = new RestService(ac.addTech);
    newRec.$save(function(){
      console.log("New record saved successfully");
      $location.url('console');
    });
  };//self.editFormSubmit 
}]);//addController
  

// ********************************** deleteController ******************************
rApp.controller('deleteController', 
    ['$routeParams', '$location', 'TechService', 'RestService',
      function($routeParams, $location, TechService, RestService) {
  var self = this;

  console.log(" to Delete tech=%s " + $routeParams.editTech);
  RestService.remove({tech:$routeParams.editTech}, function(){
    console.log($routeParams.editTech + " deleted successfully.");
    $location.url('console');
  });

}]);//deleteController
  
