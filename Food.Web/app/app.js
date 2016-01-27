'use strict';
Date.prototype.GetMonday = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0?-6:1))));
}
            
angular.module('FoodApp', [
    'ngRoute',
    'FoodApp.User',
	'FoodApp.Admin',
    'FoodApp.Menu',
    'FoodApp.MenuService',
	'FoodApp.UserService',
    ])
	.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
		$routeProvider.otherwise({ redirectTo: '/' });
		$routeProvider
		.when('/', {
			templateUrl: 'app/views/food.html',
			controller: 'FoodCtrl'
		})
		.when('/admin', {
			templateUrl: 'app/views/admin.html',
			controller: 'UserCtrl'
		})
		.when('/menu', {
			templateUrl: 'app/views/menu.html',
			controller: 'UserCtrl'
		});
		// $locationProvider.html5Mode(true);
	}])
    .controller('TopMenu', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            var test = $location.path();
            return viewLocation === $location.path();
        };
		
    })
    .run(function ($rootScope) {
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

    })
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


   