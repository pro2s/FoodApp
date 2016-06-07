'use strict';
Date.prototype.GetMonday = function() {
    return (new Date(this.setDate(this.getDate() - this.getDay() + (this.getDay() == 0?-6:1))));
}
  
function isEmpty(obj) { 
    for (var x in obj) { return false; }
    return true;
}

var translations = {
    TITLE: 'FoodApp',
};
    
angular
    .module('app', [
        'ngRoute',
        'ngCookies',
        'pascalprecht.translate',
        'ui.bootstrap',
        'angularMoment',
        'angular-loading-bar',
        'app.user',
        'app.admin',
        'app.menu',
        'app.statistic',
        'app.userservice',
    ])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', '$translateProvider', 'moment', 'cfpLoadingBarProvider', function ($routeProvider, $locationProvider, $httpProvider, $translateProvider, moment, cfpLoadingBarProvider) {

        cfpLoadingBarProvider.includeSpinner = true;

        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/locale-',
            suffix: '.json'
        });
        $translateProvider.registerAvailableLanguageKeys(['en', 'ru'], {
            'en_*': 'en',
            'ru_*': 'ru',
        });
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage('en');
        $translateProvider.useCookieStorage();

        moment.locale($translateProvider.preferredLanguage());
        
        $routeProvider.otherwise({ redirectTo: '/' });
        $routeProvider
        .when('/', {
            templateUrl: 'app/views/user.html',
            controller: 'UserChoice',
            controllerAs: 'uc',
            access: 'isAnonymous',
            menuname:'Home',
        })
        .when('/statistic', {
            templateUrl: 'app/views/statistic.html',
            controller: 'ViewStatistic',
            controllerAs: 'vm',
            menuname: 'Statistic',
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
            menuname:'Menu',
        });

        $httpProvider.interceptors.push('APIInterceptor');
        $httpProvider.interceptors.push('PaginationInterceptor');
        // $locationProvider.html5Mode(true);
    }])
    .run(['$route', '$rootScope', '$location', 'authservice', function ($route, $rootScope, $location, authservice) {
        
        authservice.init();
        
        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if (authservice.isInit()) {
                var allow = authservice.checkAccess(next.access, next.roles);

                if (allow) {
                    console.log('ALLOW');
                } else {
                    console.log('DENY');
                    $location.path('/');
                }
            } else {
                return
            }
        });
       
    }]);
    
   