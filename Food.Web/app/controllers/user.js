'use strict';

angular.module('FoodApp.User', ['ngResource'])
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
.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.otherwise({ redirectTo: '/' });
	$routeProvider
	.when('/', {
		templateUrl: 'app/views/food.html',
		controller: 'FoodCtrl'
	})
	.when('/admin', {
		templateUrl: 'app/views/admin.html',
		controller: 'UserCtrl'
	});
	// $locationProvider.html5Mode(true);
}])
.controller('FoodCtrl', ['$scope','$http','UserDay','Menu', function ($scope, $http, UserDay, Menu) {
	$scope.date = new Date();
	$scope.sendData = false;
	$scope.title = "Loading ...";
	$scope.correctData = false;
	$scope.working = false;
	
	$scope.checkday = function(day) {
		var count = 0;
		$scope.weekmenu.forEach(function(item){
			if (item.onDate == day.date){
				count++;
			};
		});
		count = 2;
		if (count>1){
			return true;
		} else {
			return false;
		}
		
	}
	var success = function(){
		$scope.error = false;
		$scope.working = false;
	};
		
	var failure = function(){
		$scope.status = "Oops... something went wrong";
		$scope.error = true;
		$scope.working = false;
	};
	
	$scope.answer = function () {
		return $scope.correctData ? 'Changes accepted' : 'Сhanges rejected';
	};

	$scope.setDaySelect = function (day, menu) {
		if ($scope.checkdate(day.date)) {
			day.select = menu;
		}
	};
	
	$scope.init = function() {
		$scope.status = "Loading food ...";
		$scope.sendData = false;
		$scope.working = true;
		$scope.error = true;
        
        $scope.userid = 5700305828184064;
		
		Menu.query({system:'all'},
			function(sysmenu) {
				$scope.weekdays = {};

				var monday = new Date().GetMonday();
				
				for (var i = 0; i < 8; i++) {
					var menu = [];
					angular.forEach(sysmenu, function(item) {
						if (item.type < 0  || (item.type == i + 1)) {
							menu.push(item);
						}
					}); 
					var date = new Date(+monday)
					var day = {date:date,menu:menu,select:{},userday:{}};
					var key = date.toDateString();
					$scope.weekdays[key] = day;
					monday.setDate(monday.getDate() + 1); 
				}	
				
				Menu.query(function(weekmenu) {
					angular.forEach(weekmenu, function(menu) {
						var day = new Date(menu.onDate).getDay()-1;
						var key = new Date(menu.onDate).toDateString();
						if ($scope.weekdays.hasOwnProperty(key)) {
                            $scope.weekdays[key].menu.push(menu);
                        }
					}) ;

					for (var key in $scope.weekdays) {
						var day = $scope.weekdays[key];
						if (day.menu.length == 1) {
							delete $scope.weekdays[key]
						}
					}
					
					$scope.days = UserDay.query({userid:$scope.userid},
					function() {
						angular.forEach($scope.days, function(day) {
							var key = new Date(day.date).toDateString();
							if ($scope.weekdays.hasOwnProperty(key)) {

								angular.forEach($scope.weekdays[key].menu, function(menu) {
									if (menu.id == day.selectid){
										$scope.weekdays[key].select = menu;
										$scope.weekdays[key].userday = day;
									}		
								});
							}
						});
						success();
					},failure);
				},failure);
			}, failure);
	};
	
	function isEmpty(obj) { 
		for (var x in obj) { return false; }
		return true;
	}

	$scope.sendUserDays = function (days) {
		$scope.working = true;
		$scope.sendData = true;
		
		for (var key in $scope.weekdays) {
			var day = $scope.weekdays[key];
			
			if (isEmpty(day.userday)) {
				if (!isEmpty(day.select)){
					console.log('save');
					var userday = new UserDay({userid:$scope.userid, selectid: day.select.id, date:day.date});
					userday.$save();
				}
			}
			else if (day.select.id != day.userday.selectid)
			{
				console.log('update');
				day.userday.selectid = day.select.id;
				day.userday.$update({id:day.userday.id});
			}
		}
		
		$scope.working = false;
		$scope.correctData = true; //false if error in request
	};
}])
.controller('UserCtrl', ['$scope', 'User', 'UserDay' , 'Menu', function ($scope, User, UserDay, Menu){
	$scope.title = "loading users ...";
	$scope.options = [];
	$scope.addbill = {
		id: 0, 
		value: 0,
		error: false,
		};
	
	$scope.addId = -1;
	$scope.working = false;
	
	$scope.chkadd = function (id) {
		if ($scope.addId == id) {
			return true;
		}
		else
		{
			return false;
		}
	};
	
	$scope.onadd = function (id) {
		$scope.addId = id;
	};
	
	$scope.offadd = function () {
		$scope.addId = -1;
		$scope.addbill.error = false;
		$scope.addbill.value = 0;
	};
	
	$scope.sendbill = function (user) {
		if ($scope.addId < 0 ) {
			return;
		}
		var add = parseInt($scope.addbill.value);
		if (isNaN(add)) {
			$scope.addbill.error = true;
		}
		else
		{
			$scope.addbill.error = false;
			user.bill = parseInt(user.bill) + add;
			User.update({id:user.id},user);
			$scope.addId = -1;
			$scope.addbill.value = 0;
		}
	};
	
	$scope.Users = function () {
		$scope.working = true;
		$scope.options = [];
		$scope.title = "Users";
		$scope.stat = {};
        
        $scope.menu = {};
        
		var success = function(){
			$scope.working = false;
		};
		var failure = function(data){
			$scope.title = "Oops... something went wrong";
			$scope.working = false;
		};
        
        $scope.users = {};
		User.query(function(data){
            angular.forEach(data, function(user) {
				$scope.users[user.id] = user;
			});
            success();
        }, failure);
        
        $scope.weekdays = {};
        UserDay.query(function(userdays) {
            var menucount = {};   
            var monday = new Date().GetMonday();
            
            var day = new Date().getDay();
            $scope.stat.select =  (day == 0 ? 6: day) + 1;
            
           
            for (var i = 0; i < 8; i++) {
                var date = new Date(+monday)
                var day = {date:date,userselect:[],menu:[],total:0};
                var key = date.toDateString();
                $scope.weekdays[key] = day;
                monday.setDate(monday.getDate() + 1); 
            }	
            angular.forEach(userdays, function(day) {
				var key = new Date(day.date).toDateString();
				if ($scope.weekdays.hasOwnProperty(key)) {
                    $scope.weekdays[key].userselect.push(day)
                    if (typeof menucount[day.selectid] == 'undefined'){
                        menucount[day.selectid]=1;
                        $scope.weekdays[key].total++;
                     } else {
                        menucount[day.selectid]++;
                        $scope.weekdays[key].total++;
                     }
				}
			});
            
            Menu.query(function(data) {
                angular.forEach(data, function(menu) {
                    $scope.menu[menu.id] = menu;
                    var key = new Date(menu.onDate).toDateString();
                    if ($scope.weekdays.hasOwnProperty(key)) {
                        menu.count = menucount[menu.id];
                        $scope.weekdays[key].menu.push(menu);
                    };
                });
            }, failure);    
            
            monday = new Date().GetMonday();
            
            Menu.query({system:"global"},function(data) {
                    angular.forEach(data, function(menu) {
                        $scope.menu[menu.id] = menu;
                        var key = new Date(new Date().setDate(monday.getDate() + menu.type - 1) ).toDateString();
                        if ($scope.weekdays.hasOwnProperty(key)) {
                            menu.count = menucount[menu.id];
                            $scope.weekdays[key].menu.push(menu);
                        };
                     });
            }, failure);            
            
            success();
        }, failure);
        
        
        
        
        
        $scope.getUser = function(userday) {
            return $scope.users[userday.userid];
        };
		
        $scope.getMenu = function(userday) {
            return $scope.menu[userday.selectid];
        };
	    
	};
}]);

