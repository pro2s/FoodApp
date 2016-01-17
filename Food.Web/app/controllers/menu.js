﻿'use strict';

angular.module('FoodApp.Menu', ['FoodApp.MenuService',])
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({ redirectTo: '/' });
    $routeProvider
    .when('/menu', {
        templateUrl: 'app/views/menu.html',
        controller: 'UserCtrl'
    });
    // $locationProvider.html5Mode(true);
}])
.controller('MenuCtrl',['$scope', 'Menu','MenuItem', function ($scope, Menu,MenuItem) {
    $scope.title = "Loading menu ...";
    $scope.options = [];
    $scope.working = false;
	$scope.menu = {};
	$scope.menu.items = [];
	$scope.editeditem = {};
	$scope.backupitem = {};
	$scope.menuitem = {};
	
	
	$scope.additem = function(item) {
	    item.id = -1;
		$scope.menu.items.push(angular.copy(item));
	};
	
	$scope.edititem = function(item) {
		$scope.backupitem = angular.copy(item);
		$scope.editeditem =  item;
	};
	
	$scope.canceledit = function() {
		angular.copy($scope.backupitem,$scope.editeditem);
		$scope.editeditem = {};
	};
	
	$scope.saveitem = function() {
		var item = new MenuItem($scope.editeditem);
		if (item.id > 0) {
			item.$update();
		}
		$scope.editeditem = {};
	};
	
	$scope.deleteitem = function(item) {
		//  remove item from base
		for (var i = 0; $scope.menu.items.length; i++) {
			
			if ($scope.menu.items[i] === item) {
				if (item.id > 0){
					MenuItem.delete({id:item.id});
				}
				$scope.menu.items.splice(i, 1);
				break; 
			}
		}
	};
	
	$scope.edited = function(item) {
		return $scope.editeditem === item;
	};
	
	$scope.add = function() {
		$scope.formTitle = "New menu";
	    $scope.menu = {};
	    $scope.menu.id = -1;
		$scope.menu.items = [];
		$scope.menuitem = {}
		$scope.edit = true;
	};
	
	$scope.editMenu = function(menu) {
		$scope.add();
		$scope.formTitle = "Edit menu";
		$scope.menu = menu;
	};
	
	$scope.cancelMenu = function() {
	    $scope.edit = false;
	}
	
	$scope.saveMenu = function() {
		var success = function(menu){
			if ($scope.menu.id < 0) {
				$scope.weekmenu.push($scope.menu);	
			}
		}
		var failure = function(data){
			$scope.title = "Oops... something went wrong";
		};
		
	    var menu = new Menu($scope.menu);
	    menu.$save(success,failure);
	    $scope.edit = false;
	}

    $scope.Menu = function (components=true) {
        $scope.date = new Date();  
		$scope.tomorrow = false;
        $scope.working = true;
		$scope.edit = false;
		$scope.components = components;
		
		var success = function(menu){
			$scope.working = false;
			$scope.title = "Week Menu";
			$scope.weekmenu = menu;
		};
		var failure = function(data){
			$scope.title = "Oops... something went wrong";
			$scope.working = false;
		};
		Menu.query(success, failure);
    };
}]);