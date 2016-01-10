'use strict';
angular.module('FoodApp', [
    'ngRoute',
    'FoodApp.User',
    'FoodApp.Menu',
    'FoodApp.MenuService',
    ])
    .controller('HeaderCtrl', function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            var test = $location.path();
            return viewLocation === $location.path();
        };
    })
    .run(function ($rootScope) {

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


   