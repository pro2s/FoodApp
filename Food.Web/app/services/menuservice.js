(function() {
    'use strict';
    angular
        .module('app.menu')
        .factory('Menu', Menu)
        .factory('MenuItem', MenuItem)
        .factory('ItemRating', ItemRating)
        .factory('ItemComments', ItemComments)
        .factory('GlobalMenu', GlobalMenu);
    

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
    
    ItemRating.$inject = ['$resource'];
    function ItemRating($resource) {
        return $resource('/api/itemratings/:id', {}, {
            query: { method: 'GET', params: { id: '' }, isArray: true },
            update: { method: 'PUT', params: { id: '' } },
        });
    }

    ItemComments.$inject = ['$resource'];
    function ItemComments($resource) {
        return function (config) {
            return $resource('/api/itemcomments/:id', {}, {
                query: { 
                    method: 'GET', 
                    params: { id: '', range: '@range' }, 
                    isArray: true, 
                    headers: config.headers,
                },
                update: { method: 'PUT', params: { id: '' }}
            });
        }
    }

    GlobalMenu.$inject = ['Menu','authservice'];
    function GlobalMenu(Menu, authservice) {
        var _data = { menu: [], empty: true };
        authservice.registerEvent('UserLogged', updateMenu)
        authservice.registerEvent('UserLogout', updateMenu)
        updateMenu();
        
        var service = {
            data: _data,
            updateMenu: updateMenu,
            setMenu: setMenu,
            getMenu: getMenu,
            addMenu: addMenu,
            deleteMenu:deleteMenu,
            clearMenu: clearMenu,
        };
        return service;

        function deleteMenu(menu) {
            var i = _data.menu.indexOf(menu);
            if (i > 0) {
                _data.menu.splice(i, 1);
            }
            
        }

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
    
    

})()