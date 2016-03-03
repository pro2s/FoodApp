(function () {
    'use strict';
    angular
        .module('app')
        .service('APIInterceptor', APIInterceptor);

    APIInterceptor.$inject = ['$rootScope', 'Config'];
    function APIInterceptor($rootScope, Config) {
        var service = this;

        service.request = function (config) {
            /*
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;
             
            if (access_token) {
                config.headers.authorization = access_token;
            }
            */

            if (config.url.indexOf('/api/') == 0) {
                config.url = Config.get('api') + config.url.substring(1);
                console.log('request to API: ', config.url);
            }

            return config;

        };

        service.responseError = function (response) {
            switch (response.status) {
                case 401:
                    $rootScope.$broadcast('unauthorized');
                    break;
                case 408:
                    console.log('connection timed out');
                    break;
            }

            return response;
        };
    };

})()

