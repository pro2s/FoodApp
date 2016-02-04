﻿'use strict';
Date.prototype.GetMonday = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0?-6:1))));
}
  
function isEmpty(obj) { 
    for (var x in obj) { return false; }
    return true;
}
    
angular.module('app', [
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
            controller: 'UserCtrl'
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
        /*
        .when('/menu', {
            templateUrl: 'app/views/menu.html',
            controller: 'MenuCtrl'
        });
        */
        // $locationProvider.html5Mode(true);
    }])
    .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
        $rootScope.userid = 5700305828184064;
        $rootScope.username = "User A";
        $rootScope.api = "http://localhost/"
        $rootScope.setAPI = function (apiurl) {
            $rootScope.api = apiurl;
        };
        
       
        
        $rootScope.checkdate = function (date) {
            
            var today = new Date();
            today.setDate(today.getDate() + 1);
            var day = new Date(new Date(date).setHours(15, 0, 0, 0));

            if (day.getTime() > today.getTime()) {
                return true;
            }

            return false;
        };

    }])
    .filter('OnDate', function () {
        return function (items, date) {
          
            var tmp = {};
            for (var i in items) {
                var item = items[i];
                if (item.onDate == date || item.onDate == null) {
                    tmp[i] = item;
                }
            }
            return tmp;
        }
    })
    .filter('slice', function () {
        return function (arr, start, end) {
            arr = typeof arr !== 'undefined' ? arr : [];
            end = typeof end !== 'undefined' ? end : arr.length;
            return arr.slice(start, end);
        }
    })
    .directive('myDay', function () {
        return {
            template: "<label>{{day.date|date:'dd.MM.yyyy'}}<br/>{{day.date|date:'(EEEE)'}}</label>"
        };
    });

angular
    .module('app')
    .factory('dateservice', dateService);
    
function dateService() {
    var monday = getMonday();
    var service = {
        monday: monday,
        check: check,
    };
    return service;

    function getMonday() {
        var d = new Date();
        var day = d.getDay();
        var diff = d.getDate() - day + (day == 0 ? -6:1); 
        return new Date(d.setDate(diff));
    }
    
    function check(date) {
        var result = false;
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var day = new Date(new Date(date).setHours(15, 0, 0, 0));

        if (day.getTime() > today.getTime()) {
            result = true;
        }

        return result;
    };
}

   