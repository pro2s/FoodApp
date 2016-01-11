'use strict';
angular.module('FoodApp.MenuService', ['ngResource'])
.factory('Menu', ['$rootScope','$resource',
  function($rootScope, $resource){
    return $resource($rootScope.api + 'api/menu/:menuId', {}, {
      query: {method:'GET', params:{menuId:''}, isArray:true}
    });
  }])
