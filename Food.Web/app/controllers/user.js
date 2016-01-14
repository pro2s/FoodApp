﻿'use strict';

angular.module('FoodApp.User', ['ngResource'])
.factory('UserDay', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/userday/:Id', {}, {
      query: {method:'GET', params:{Id:''}, isArray:true}
    });
}])
.factory('User', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/user/:Id', {}, {
      query: {method:'GET', params:{Id:''}, isArray:true}
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
    // $locationProvider.html5Mode(true);
}])
.controller('FoodCtrl', ['$scope','$http','UserDay','Menu', function ($scope, $http, UserDay, Menu) {
    $scope.date = new Date();
    $scope.sendData = false;
    $scope.title = "Loading ...";
    $scope.correctData = false;
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
        return $scope.correctData ? 'Changes accepted' : 'Сhanges rejected';
    };

    $scope.setDaySelect = function (day, menu) {
        if ($scope.checkdate(day.date)) {
            day.select = menu;
        }
    };
	
	$scope.init = function() {
		$scope.loadUser();
		$scope.loadMenu();
	};
    
	$scope.loadMenu = function () {
        
		$scope.working = true;
		$scope.error = true;
    
		$scope.weekmenu = Menu.query(success,failure);
    };
	
	$scope.loadUser = function () {
        
		$scope.working = true;
		$scope.error = true;
		$scope.sendData = false;
		
		$scope.status = "Loading food ...";
        
		$scope.days = UserDay.query(success,failure);
	};

	$scope.sendUserDays = function (days) {
        $scope.working = true;
        $scope.sendData = true;
        var mdays = new UserDay(days) // impliment success/failure func for set correctData
        mdays.$save();
        $scope.working = false;
        $scope.correctData = true; //false if error in request
    };
}])
.controller('UserCtrl', ['$scope','$http','User', function ($scope, $http, User){
    $scope.title = "loading users ...";
    $scope.options = [];
	$scope.addbill = {
		id: 0, 
		value: 0,
		error: false,
		};
	
	$scope.addId = -1;
    $scope.working = false;
	
	$scope.chkadd = function (id) {
		if ($scope.addId == id) {
			return true;
		}
		else
		{
			return false;
		}
	};
	
	$scope.onadd = function (id) {
		$scope.addId = id;
	};
	
	$scope.offadd = function () {
		$scope.addId = -1;
		$scope.addbill.error = false;
		$scope.addbill.value = 0;
	};
	
	$scope.sendbill = function (user) {
		if ($scope.addId < 0 ) {
			return;
		}
		var add = parseInt($scope.addbill.value);
		if (isNaN(add)) {
			$scope.addbill.error = true;
		}
		else
		{
			$scope.addbill.error = false;
			user.bill = user.bill + add;
			user.$save();
			$scope.addId = -1;
			$scope.addbill.value = 0;
		}
	};
	
    $scope.Users = function () {
        $scope.working = true;
        $scope.options = [];
		$scope.title = "Users";
		$scope.users = User.query();
		$scope.working = false;
    };
}]);

