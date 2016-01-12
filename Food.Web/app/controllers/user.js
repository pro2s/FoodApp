'use strict';

angular.module('FoodApp.User', ['ngResource'])
.factory('UserDay', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/userday/:menuId', {}, {
      query: {method:'GET', params:{menuId:''}, isArray:true}
    });
}])
.factory('User', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/user/:menuId', {}, {
      query: {method:'GET', params:{menuId:''}, isArray:true}
    });
}])  
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
    });
    $locationProvider.html5Mode(true);
}])
.controller('FoodCtrl', ['$scope','$http','UserDay','Menu', function ($scope, $http, UserDay, Menu) {
    $scope.date = new Date();
	$scope.answered = false;
    $scope.title = "Loading ...";
    $scope.correctAnswer = false;
    $scope.working = false;
	
	var success = function(){
		$scope.error = false;
		$scope.working = false;
	};
		
	var failure = function(){
		$scope.status = "Oops... something went wrong";
		$scope.error = true;
		$scope.working = false;
	};
	
    $scope.answer = function () {
        return $scope.correctAnswer ? 'Changes accepted' : 'Сhanges rejected';
    };

    $scope.setDayChoice = function (day, choice) {
        if ($scope.checkdate(day.date)) {
            day.select = choice;
        }
    };
	
	$scope.init = function() {
		$scope.loadUser();
		$scope.loadMenu();
	};
    
	$scope.loadMenu = function () {
        
		$scope.working = true;
		$scope.error = true;

		$scope.status = "Loading menu ...";
        
		$scope.weekmenu = Menu.query(success,failure);
    };
	
	$scope.loadUser = function () {
        
		$scope.working = true;
		$scope.error = true;
		$scope.answered = false;

		$scope.status = "Loading food ...";
        
		$scope.days = UserDay.query(success,failure);
	};

    $scope.sendAnswer = function (days) {
        $scope.working = true;
        $scope.answered = true;

        $http.post('http://localhost:52959/api/values', days).success(function (data, status, headers, config) {
            $scope.correctAnswer = (data === true);
            $scope.working = false;
        }).error(function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        });
    };
}])
.controller('UserCtrl', ['$scope','$http','User', function ($scope, $http, User){
    $scope.title = "loading users ...";
    $scope.options = [];

    $scope.working = false;

    $scope.Users = function () {
        $scope.working = true;
        $scope.options = [];
		$scope.title = "Users";
		$scope.users = User.query();
		$scope.working = false;
    };
}]);

