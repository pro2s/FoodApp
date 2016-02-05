﻿'use strict';
Date.prototype.GetMonday = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0?-6:1))));
}
  
function isEmpty(obj) { 
    for (var x in obj) { return false; }
    return true;
}
    
angular
    .module('app', [
        'ngRoute',
        'app.user',
        'app.admin',
        'app.menu',
        'app.menuservice',
        'app.userservice',
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.otherwise({ redirectTo: '/' });
        $routeProvider
        .when('/', {
            templateUrl: 'app/views/user.html',
            controller: 'UserChoice',
            controllerAs: 'uc',
        })
        .when('/admin', {
            templateUrl: 'app/views/admin.html',
            controller: 'UserAdmin',
            controllerAs: 'vm',
        })
        .when('/menu', {
            templateUrl: 'app/views/editmenu.html',
            controller: 'EditMenu',
            controllerAs: 'form',
        });
        
        // $locationProvider.html5Mode(true);
    }])
    .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        
        //TODO: temp method to get default user - must be removed
        $rootScope.userid = 5700305828184064;
        $rootScope.username = "User A";
        $rootScope.api = "http://localhost/"
        
        //Set api url from index template
        $rootScope.setAPI = function (apiurl) {
            $rootScope.api = apiurl;
        };
    }]);
    
   