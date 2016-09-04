
// ***************************** TechService *********************************** 
rApp.service('TechService', [function(){
  var preserveTechRec = {};
  this.getTech = function(){return preserveTechRec;}
  this.setTech = function(mytech){preserveTechRec = mytech;}

  var isLoggedIN = false;
  this.getLoggedIN = function(){
    return isLoggedIN;
  }
  this.setLoggedIN = function(loginsStatus){isLoggedIN = loginsStatus;}
}]);

// ***************************** RestService ***********************************
rApp.factory('RestService', function($resource) {
  return $resource('/api/tech/:tech', null, {
      'update': { method:'PUT' }
    }); // The full endpoint address
});//RestService

/*
.factory('ItemsService', ['$resource', function($resource){
    return $resource('/shoppingItems/:id', null, {
      'update': { method:'PUT' }
    });
  }])
*/