angular.module('FoodApp', [])
    .run(function($rootScope) {

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
    .controller('FoodCtrl', function ($scope, $http) {
        $scope.answered = false;
        $scope.title = "loading food ...";
        $scope.options = [];
        $scope.correctAnswer = false;
        $scope.working = false;

        $scope.answer = function () {
            return $scope.correctAnswer ? 'correct' : 'incorrect';
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
    .directive('myDay', function () {
        return {
            template: "<label>{{day.date|date:'dd.MM.yyyy'}}<br/>{{day.date|date:'(EEEE)'}}</label>"
        };
    })
    .controller('UserCtrl', function ($scope, $http) {
        $scope.title = "loading users ...";
        $scope.options = [];

        $scope.working = false;

        $scope.Users = function () {
            $scope.working = true;
            $scope.options = [];

            $http.get("/api/bill").success(function (data, status, headers, config) {
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
    .controller('MenuCtrl', function ($scope, $http) {
        $scope.title = "loading menu ...";
        $scope.options = [];

        $scope.working = false;

        $scope.Menu = function () {
            $scope.working = true;
            $scope.options = [];

            $http.get("http://localhost:52959/api/values").success(function (data, status, headers, config) {
                $scope.tomorrow = false;
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
    .filter('slice', function () {
        return function (arr, start, end) {
            arr = typeof arr !== 'undefined' ? arr: [];
            end = typeof end !== 'undefined' ? end : arr.length;
            return arr.slice(start, end);
        }
        })