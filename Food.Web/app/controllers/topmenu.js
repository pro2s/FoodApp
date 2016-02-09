(function() {
    'use strict';
    angular
        .module('app')
        .controller('TopMenu', TopMenu);

    TopMenu.$inject = ['$rootScope', '$location', '$route', 'User', 'authservice'];    
    
    function TopMenu($rootScope, $location, $route, User, authservice) {
        var topmenu = this;
        topmenu.menu = [];
        topmenu.users = {};
        topmenu.auth = {};
        topmenu.isActive = isActive;
        topmenu.selectUser = selectUser;
        topmenu.showLogin = showLogin;
        topmenu.showRegister = showRegister;
        topmenu.logout = logout;
        
        activate();
        
        function activate() {
            topmenu.users = User.getUsers();
            topmenu.auth = authservice.state;
            topmenu.menu = getMenu();
            authservice.registerEvent('UserLogged', updateMenu)
            authservice.registerEvent('UserLogout', updateMenu)
        }

        function updateMenu() {
            topmenu.menu = getMenu();
        }
        
        function getMenu() {
            var menu = [];
            angular.forEach($route.routes,function (config,route) {
                if (config.menuname) {
                    if (authservice.checkAccess(config.access, config.roles)) {
                        menu.push({url:route, name:config.menuname});
                    }
                }
            });
            return menu;
        }
        
        function showLogin() {
            authservice.showLogin();
        }

        function showRegister() {
            authservice.showRegister();
        }

        function logout() {
            authservice.doLogout();
        }


        function isActive(viewLocation) {
            var test = $location.path();
            return viewLocation === $location.path();
        };
        
        function selectUser(user) {
            $rootScope.userid = user.id;
            $rootScope.username = user.name;
            if  ($location.path() == '/') {
                $route.reload();
            } else {
                $location.path('/').replace();
            }
        }
        
    }

})();    