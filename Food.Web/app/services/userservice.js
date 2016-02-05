(function() {
    'use strict';
    angular
        .module('app.userservice')
        .factory('User', User)	 
        .factory('UserDay', ['$rootScope','$resource',
          function($rootScope, $resource){
            return $resource($rootScope.api + 'api/userday/:id', {}, {
              query: {method:'GET', params:{id:''}, isArray:true},
              update: {method:'PUT', params:{id:''}},
            });
        }])
        .factory('Payment', ['$rootScope','$resource',
          function($rootScope, $resource){
            return $resource($rootScope.api + 'api/payment/:id', {}, {
              query: {method:'GET', params:{id:''},	 isArray:true},
              update: {method:'PUT', params:{id:''}},
            });
        }])	
        
        User.$inject = ['$rootScope', '$resource'];    
        
        /**
        * @namespace User
        * @desc Get User data from api 
        * @memberOf Factories
        */
        function User($rootScope, $resource) {
            return $resource($rootScope.api + 'api/user/:id', {}, {
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