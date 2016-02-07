(function() {
    'use strict';
    angular
        .module('app.userservice')
        .factory('User', User)	 
        .factory('UserDay', ['$rootScope','$resource',
          function($rootScope, $resource){
            return $resource($rootScope.api + 'api/userchoices/:id', {}, {
              query: {method:'GET', params:{id:''}, isArray:true},
              update: {method:'PUT', params:{id:''}},
            });
        }])
        .factory('Payment', ['$rootScope','$resource',
          function($rootScope, $resource){
            return $resource($rootScope.api + 'api/payments/:id', {}, {
              query: {method:'GET', params:{id:''},	 isArray:true},
              update: {method:'PUT', params:{id:''}},
            });
        }])	
        .factory('Account', ['$rootScope', '$resource',
          function ($rootScope, $resource) {
              $rootScope.api = 'http://localhost:53058/';
              return $resource($rootScope.api + 'api/Account/:action', {}, {
              });
        }])

        User.$inject = ['$rootScope', '$resource'];    
        
        /**
        * @namespace User
        * @desc Get User data from api 
        * @memberOf Factories
        */
        function User($rootScope, $resource) {
            return $resource($rootScope.api + 'api/users/:id', {}, {
                query: {
                    method:'GET', 
                    params:{id:''}, 
                    isArray:true
                    },
                update: {
                    method:'PUT', 
                    params:{id:''}
                    },
                getUsers: {
                    method:'GET', 
                    params:{id:''}, 
                    cache: true,
                    transformResponse: getUsers, 
                    },
            });
            
            /**
           * @name getUsers
           * @desc Get User list in object with key as user.id and value as user 
           * @param {String} data Raw response from api with json data
           * @param {Array} header Http headersGetter
           * @returns {Object}
           * @memberOf Factories.User
           */
            function getUsers(data, header) {
                var jsonData = angular.fromJson(data);
                var users = {};
                angular.forEach(jsonData, function(user) {
                    users[user.id] = user;
                });
                return users;
            }
        }
})()