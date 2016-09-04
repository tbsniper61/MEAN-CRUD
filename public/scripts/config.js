var rApp = angular.module('meanRouteApp', ['ngRoute', 'ngResource']);

// routes
rApp.config(function($routeProvider) {
    $routeProvider
        // route for the login page
        .when('/', {
            templateUrl : 'pages/login.html',
            controller  : 'loginController',
            controllerAs : 'lController'
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

        // route for the console page
        .when('/console', {
            templateUrl : 'pages/console.html',
            controller  : 'consoleController',
            controllerAs : 'cController'
        })                     

        // route for the add page
        .when('/addTech', {
            templateUrl : 'pages/add.html',
            controller  : 'addController',
            controllerAs : 'aController'
        })    

        // route for the add page
        .when('/deleteTech/:editTech', {
            templateUrl : 'pages/console.html',
            controller  : 'deleteController',
            controllerAs : 'dController'
        })   

        // route for the edit page
        .when('/editTech/:editTech', {
            templateUrl : 'pages/edit.html',
            controller  : 'editController',
            controllerAs : 'eController'
        });
});
