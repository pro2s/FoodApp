(function () {
    'use strict';
    angular
        .module('app.statistic')
        .factory('Statistic', ['$resource',
          function ($resource) {
              return $resource('/api/statistic/:id', {}, {
                  query: { method: 'GET', params: { id: '' }, isArray: false},
              });
          }])
     
})()