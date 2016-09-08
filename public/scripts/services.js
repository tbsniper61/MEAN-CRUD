
// ***************************** TechService ***********************************
// Idea: http://www.codelord.net/2015/05/04/angularjs-notifying-about-changes-from-services-to-controllers 
rApp.service('TechService', ['$rootScope', function($rootScope){
  var isLoggedIN = false;
  this.getLoggedIN = function(){
    return isLoggedIN;
  }
  this.setLoggedIN = function(loginsStatus){isLoggedIN = loginsStatus;}

  this.subscribe = function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
  }//subscribe

  this.notify = function() {
            $rootScope.$emit('notifying-service-event');
  }//notify
}]);

// ***************************** RestService ***********************************
rApp.factory('RestService', function($resource) {
  return $resource('/api/tech/:tech', null, {
      'update': { method:'PUT' }
    }); // The full endpoint address
});//RestService
