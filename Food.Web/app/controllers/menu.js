'use strict';

angular.module('FoodApp.Menu', []).controller('MenuCtrl',['$scope','Menu', function ($scope, Menu) {
    $scope.title = "loading menu ...";
    $scope.options = [];
    $scope.working = false;

    $scope.Menu = function (components) {
        $scope.working = true;
        $scope.tomorrow = false;
        $scope.components = typeof components !== 'undefined' ? components : true;
        $scope.date = new Date();  
       
		$scope.weekmenu = Menu.query();
    };
}]);