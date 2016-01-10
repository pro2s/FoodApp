'use strict';
angular.module('FoodApp.MenuService', [])
.factory('menuService', function ($rootScope, $http) {
    var menuService = {};

    menuService.data = {};
    menuService.status = false;
    //Gets the list of nuclear weapons
    menuService.getMenu = function () {
        menuService.status = false;
        $http.get('http://localhost:52959/api/menu')
            .success(function (data) {
                menuService.data = data;
                menuService.status = true;
            })
            .error(function (data, status, headers, config) {
                menuService.status = true;
            });
        return menuService.data;
    };

    return menuService;
});
