
// ***************************** TechService ***********************************
// Idea: http://www.codelord.net/2015/05/04/angularjs-notifying-about-changes-from-services-to-controllers 
rApp.service('TechService', ['$rootScope', function($rootScope){
  var isLoggedIN = false;
  var username = "";

  // loggedIN
  this.getLoggedIN = function(){
    return isLoggedIN;
  }
  this.setLoggedIN = function(loginsStatus){
    isLoggedIN = loginsStatus;
  }

  //username
  this.getUsername = function(){
    return username;
  }
  this.setUsername = function(_username){
    console.log("setUsername called");
    username = _username;
  }

  //Observer Pattern: suscribe & notify 
  this.subscribe = function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
  }//subscribe

  this.notify = function() {
            $rootScope.$emit('notifying-service-event');
  }//notify
}]);

// ***************************** RestService ***********************************
rApp.factory('RestService', ['$resource', function($resource) {
  return $resource('/api/tech/:tech', null, {
      'update': { method:'PUT' }
    }); // The full endpoint address
}]);//RestService
