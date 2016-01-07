'use strict';

angular.module('FoodApp.Menu', []).controller('MenuCtrl', function ($scope, $http) {
    $scope.title = "loading menu ...";
    $scope.options = [];
    $scope.working = false;

    $scope.Menu = function (components) {
        $scope.working = true;
        $scope.options = [];
        $scope.tomorrow = false;
        $scope.components = typeof components !== 'undefined' ? components : true;

        $http.get("http://localhost:52959/api/values").success(function (data, status, headers, config) {
            $scope.date = new Date();
            $scope.choice = data.choiceSet;
            $scope.title = "Menus";
            //$scope.menu = data.menu;
            //$scope.choiceset = data.choiceSet;


            $scope.working = false;
        }).error(function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        });
    };
})