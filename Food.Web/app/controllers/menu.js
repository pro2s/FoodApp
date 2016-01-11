'use strict';

angular.module('FoodApp.Menu', []).controller('MenuCtrl',['$scope','Menu', function ($scope, Menu) {
    $scope.title = "Loading menu ...";
    $scope.options = [];
    $scope.working = false;

    $scope.Menu = function (components = true) {
        $scope.date = new Date();  
		$scope.tomorrow = false;
        $scope.working = true;
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