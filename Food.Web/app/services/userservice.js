(function() {
    'use strict';
    angular
        .module('app.userservice')
        .factory('User', User)	 
        .factory('UserDay', ['$resource',
          function($resource){
            return $resource('/api/userchoices/:id', {}, {
              query: {method:'GET', params:{id:''}, isArray:true},
              update: {method:'PUT', params:{id:''}},
            });
        }])
        .factory('Payment', ['$resource',
          function($resource){
            return $resource('/api/payments/:id', {}, {
              query: {method:'GET', params:{id:''},	 isArray:true},
              update: { method: 'PUT', params: { id: '' } },
              share: { method: 'POST', params: { id: 'share' } }
            });
        }])	
        .factory('Account', ['$resource',
          function ($resource) {
              return $resource('/api/Account/:action', {}, {
              });
        }])

        User.$inject = [ '$resource'];    
        /**
        * @namespace User
        * @desc Get User data from api 
        * @memberOf Factories
        */
        function User($resource) {
            return $resource('/api/users/:id', {}, {
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
                    //cache: true, // nedd cache invalidate when add user payment
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