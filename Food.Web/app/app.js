'use strict';
Date.prototype.GetMonday = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0?-6:1))));
}
  
function isEmpty(obj) { 
    for (var x in obj) { return false; }
    return true;
}
    
angular
    .module('app', [
        'ngRoute',
        'app.user',
        'app.admin',
        'app.menu',
        'app.menuservice',
        'app.userservice',
    ])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.otherwise({ redirectTo: '/' });
        $routeProvider
        .when('/', {
            templateUrl: 'app/views/user.html',
            controller: 'UserChoice',
            controllerAs: 'uc',
            access: 'isAnonymous',
            menuname:'Home',
        })
        .when('/profile', {
            templateUrl: 'app/views/userprofile.html',
            controller: 'UserProfile',
            controllerAs: 'vm',
            access: 'isAuthenticated',
        })
        .when('/users', {
            templateUrl: 'app/views/useradmin.html',
            controller: 'UserAdmin',
            controllerAs: 'vm',
            access: 'isAuthenticated',
            roles: ['Admin'],
            menuname:'Users',
        })
        .when('/orders', {
            templateUrl: 'app/views/orders.html',
            controller: 'OrdersAdmin',
            controllerAs: 'vm',
            access: 'isAuthenticated',
            roles: ['Admin'],
            menuname: 'Orders',
        })
        .when('/menu', {
            templateUrl: 'app/views/editmenu.html',
            controller: 'EditMenu',
            controllerAs: 'form',
            access: 'isAuthenticated',
            roles: ['Admin','GlobalAdmin'],
            menuname:'Menu admin',
        });

        $httpProvider.interceptors.push('APIInterceptor');
        // $locationProvider.html5Mode(true);
    }])
    .run(['$route', '$rootScope', '$location', 'authservice', function ($route, $rootScope, $location, authservice) {
        
        authservice.init();
        
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            var allow= authservice.checkAccess(next.access, next.roles);
            
            if (allow) {
                console.log('ALLOW');
            } else {
                console.log('DENY');
                $location.path('/');
            }
        });
       
    }]);
    
   