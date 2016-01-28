'use strict';

angular.module('FoodApp.User', ['FoodApp.UserService'])
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
		if ($scope.checkdate(day.date) && !day.userday.confirm) {
			day.select = menu;
		}
	};
	
	$scope.init = function() {
		$scope.status = "Loading food ...";
		$scope.sendData = false;
		$scope.working = true;
		$scope.error = true;
        
        
		
		Menu.query({system:'none'},
			function(sysmenu) {
				$scope.weekdays = {};
				var nonemenu = sysmenu.pop()
				var monday = new Date().GetMonday();
				
				for (var i = 0; i < 8; i++) {
					var menu = [];
					menu.push(nonemenu);
					
					var date = new Date(+monday)
					var day = {date:date,menu:menu,select:{},userday:{}};
					var key = date.toDateString();
					$scope.weekdays[key] = day;
					monday.setDate(monday.getDate() + 1); 
				}	
				
				Menu.query(function(weekmenu) {
					$scope.weekmenu = weekmenu;
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
					}, function(){
						// no user select
						success();
					});
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
}]);
