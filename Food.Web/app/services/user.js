angular.module('FoodApp.UserService', ['ngResource'])
.factory('UserDay', ['$rootScope','$resource',
  function($rootScope, $resource){
	return $resource($rootScope.api + 'api/userday/:id', {}, {
	  query: {method:'GET', params:{id:''}, isArray:true},
	  update: {method:'PUT', params:{id:''}},
	});
}])
.factory('User', ['$rootScope','$resource',
  function($rootScope, $resource){
	return $resource($rootScope.api + 'api/user/:id', {}, {
	  query: {method:'GET', params:{id:''},	 isArray:true},
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