(function() {
    'use strict';
    angular
        .module('app')
        .controller('TopMenu', TopMenu);

    TopMenu.$inject = ['$scope', '$rootScope', '$location', '$route', 'User'];    
    
    function TopMenu($scope, $rootScope, $location, $route, User) {
        var topmenu = this;
        topmenu.users = {}
        topmenu.isActive = isActive;
        topmenu.selectUser = selectUser;
        
        activate();
        
        function activate() {
            topmenu.users = User.getUsers();
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