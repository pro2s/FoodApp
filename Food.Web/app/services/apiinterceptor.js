(function () {
    'use strict';
    angular
        .module('app')
        .service('APIInterceptor', APIInterceptor);

    APIInterceptor.$inject = ['$q','$rootScope', 'Config'];
    function APIInterceptor($q, $rootScope, Config) {
        var service = this;

        service.request = function (config) {
            /*
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;
             
            if (access_token) {
                config.headers.authorization = access_token;
            }
            */
            for (var key in config.params) {
                if (config.params[key] === '') {
                    delete config.params[key];
                }
            }

            if (config.url.indexOf('/api/') == 0) {
                config.url = Config.get('api') + config.url.substring(1);
                console.log('request to API: ', config.url);
            }

            return config;

        };
        
        service.responseError = function (rejection) {
            switch (rejection.status) {
                case 401:
                    $rootScope.$broadcast('unauthorized');
                    break;
                case 408:
                case -1:
                    console.log('Connection timeout.');
                    $('#offlineMessage').modal({backdrop: 'static', keyboard: false})  
                    break;


            }

            return $q.reject(rejection); 
        };
        
    };

})()

