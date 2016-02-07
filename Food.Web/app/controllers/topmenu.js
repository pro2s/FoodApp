(function() {
    'use strict';
    angular
        .module('app')
        .controller('TopMenu', TopMenu);

    TopMenu.$inject = ['$rootScope', '$location', '$route', 'User', 'authservice'];    
    
    function TopMenu($rootScope, $location, $route, User, authservice) {
        var topmenu = this;
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