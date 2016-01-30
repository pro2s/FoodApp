'use strict';

angular.module('FoodApp.Admin', ['FoodApp.UserService'])
.controller('AdminCtrl', ['$scope', 'User', 'Payment', 'UserDay' , 'Menu', function ($scope, User, Payment, UserDay, Menu){
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
			//User.update({id:user.id},user);
			var pay = new Payment({userid:user.id, sum:add})
			pay.$save();
			
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
			
			
			Menu.query({system:"none"}, function(menu){
				
				var nonemenu = menu.pop();	
				angular.forEach(userdays, function(day) {
					var key = new Date(day.date).toDateString();
					if ($scope.weekdays.hasOwnProperty(key)) {
						$scope.weekdays[key].userselect.push(day)
						if (day.selectid != nonemenu.id) {
							if (typeof menucount[day.selectid] == 'undefined'){
								menucount[day.selectid]=1;
								$scope.weekdays[key].total++;
							 } else {
								menucount[day.selectid]++;
								$scope.weekdays[key].total++;
							 }
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
				
			}, failure);    

            success();
        }, failure);
        
        
        
        
        
        $scope.getUser = function(userday) {
            return $scope.users[userday.userid];
        };
		
        $scope.getMenu = function(userday) {
            return $scope.menu[userday.selectid];
        };
		
		$scope.confirmSelect = function(userday){
			userday.confirm = true;
			userday.$update({id:userday.id});
			$scope.users[userday.userid].bill = $scope.users[userday.userid].bill - $scope.menu[userday.selectid].price;
		}
	    
	};
}]);

