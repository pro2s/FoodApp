'use strict';

angular.module('FoodApp.User', [])
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
.controller('FoodCtrl', function ($scope, $http) {
    $scope.answered = false;
    $scope.title = "loading food ...";
    $scope.options = [];
    $scope.correctAnswer = false;
    $scope.working = false;

    $scope.answer = function () {
        return $scope.correctAnswer ? 'Changes accepted' : 'Сhanges rejected';
    };

    $scope.setDayChoice = function (day, choice) {
        if ($scope.checkdate(day.date)) {
            day.select = choice;
        }
    };

    $scope.nextQuestion = function () {
        $scope.working = true;
        $scope.answered = false;
        $scope.title = "loading food ...";
        $scope.options = [];

        $http.get("http://localhost:52959/api/values").success(function (data, status, headers, config) {
            $scope.date = new Date();
            $scope.days = data.days;
            $scope.menu = data.menu;
            $scope.choiceset = data.choiceSet;
            $scope.title = data.title;
            $scope.answered = false;
            $scope.working = false;
        }).error(function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        });
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
})
.controller('UserCtrl', function ($scope, $http) {
    $scope.title = "loading users ...";
    $scope.options = [];

    $scope.working = false;

    $scope.Users = function () {
        $scope.working = true;
        $scope.options = [];

        $http.get("http://localhost:52959/api/bill").success(function (data, status, headers, config) {
            $scope.date = new Date();
            $scope.users = data.users;
            $scope.title = "Users";
            //$scope.menu = data.menu;
            //$scope.choiceset = data.choiceSet;


            $scope.working = false;
        }).error(function (data, status, headers, config) {
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        });
    };
});

