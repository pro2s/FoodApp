(function() {
    'use strict';
    angular
        .module('app.menuservice', ['ngResource'])
        .factory('Menu', Menu)
        .factory('MenuItem', MenuItem) 
        .factory('GlobalMenu', GlobalMenu);

    Menu.$inject = ['Config', '$resource'];    
    function Menu(Config, $resource) {
        return $resource(Config.get('api') + 'api/menus/:id', {}, {
          query: {method:'GET', params:{id:''}, isArray:true},
          update: {method:'PUT', params:{id:''}, isArray:true},
        });
    }

    MenuItem.$inject = ['Config', '$resource'];    
    function MenuItem(Config, $resource) {
        return $resource(Config.get('api') + 'api/menuitems/:id', {}, {
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