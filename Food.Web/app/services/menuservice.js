﻿(function() {
    'use strict';
    angular
        .module('app.menu')
        .factory('Menu', Menu)
        .factory('MenuItem', MenuItem) 
        .factory('GlobalMenu', GlobalMenu)
        .factory('ItemRating', ItemRating);

    Menu.$inject = ['$resource'];    
    function Menu($resource) {
        return $resource('/api/menus/:id', {}, {
          query: {method:'GET', params:{id:''}, isArray:true},
          update: {method:'PUT', params:{id:''}, isArray:true},
        });
    }

    MenuItem.$inject = ['$resource'];    
    function MenuItem($resource) {
        return $resource('/api/menuitems/:id', {}, {
          query: {method:'GET', params:{id:''}, isArray:true},
          update: {method:'PUT', params:{id:''}, isArray:true}
        });
    }
    
    GlobalMenu.$inject = ['Menu','authservice'];
    function GlobalMenu(Menu, authservice) {
        var _data = { menu: [], empty: true };
        authservice.registerEvent('UserLogged', updateMenu)
        authservice.registerEvent('UserLogout', updateMenu)
        updateMenu();
        
        var service = {
            data: _data,
            setMenu: setMenu,
            getMenu: getMenu,
            addMenu: addMenu,
            clearMenu: clearMenu,
        };
        return service;

        function updateMenu() {
            Menu.query(success, clearMenu);

            function success(data) {
                _data.menu = data;
                _data.empty = false;
            };

        }

        function setMenu(menu) {
            _data.menu = menu;
            _data.empty = false;
        }
        
        function getMenu() {
            return _data.menu;
        }
        
        function addMenu(menu) {
            _data.menu.push(menu);
        }
        
        function clearMenu() {
            _data.menu = [];
            _data.empty = true;
        }
    }
    
    ItemRating.$inject = ['Config', '$resource'];
    function ItemRating(Config, $resource) {
        return $resource(Config.get('api') + 'api/itemratings/:id', {}, {
            query: { method: 'GET', params: { id: '' }, isArray: true },
            update: { method: 'PUT', params: { id: '' }},
        });
    }

})()