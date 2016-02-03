'use strict';
angular.module('app.menuservice', ['ngResource'])
.factory('Menu', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/menu/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
	  update: {method:'PUT', params:{id:''}, isArray:true}
    });
  }])
.factory('MenuItem', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/menuitem/:id', {}, {
      query: {method:'GET', params:{id:''}, isArray:true},
	  update: {method:'PUT', params:{id:''}, isArray:true}
    });
  }])
