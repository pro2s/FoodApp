(function() {
    'use strict';
    angular
        .module('app.menuservice', ['ngResource'])
        .factory('Menu', Menu)
        .factory('MenuItem', MenuItem) 
        .factory('GlobalMenu', GlobalMenu);

    Menu.$inject = ['$rootScope', '$resource'];    
    function Menu($rootScope, $resource) {
        return $resource($rootScope.api + 'api/menu/:id', {}, {
          query: {method:'GET', params:{id:''}, isArray:true},
          update: {method:'PUT', params:{id:''}, isArray:true},
        });
    }

    MenuItem.$inject = ['$rootScope', '$resource'];    
    function MenuItem($rootScope, $resource) {
        return $resource($rootScope.api + 'api/menuitem/:id', {}, {
          query: {method:'GET', params:{id:''}, isArray:true},
          update: {method:'PUT', params:{id:''}, isArray:true}
        });
    }

    function GlobalMenu() {
        var _menu = [];
        var empty = true;
        var service = {
            empty: empty,
            setMenu: setMenu,
            getMenu: getMenu,
            addMenu: addMenu,
            clearMenu: clearMenu,
        };
        return service;

        function setMenu(menu) {
            _menu = menu;
            empty = false;
        }
        
        function getMenu() {
            return _menu;
        }
        
        function addMenu(menu) {
            _menu.push(menu);
        }
        
        function clearMenu() {
            _menu = [];
            empty = true;
        }
    }
    
})()