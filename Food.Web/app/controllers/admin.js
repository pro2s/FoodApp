'use strict';

angular.module('FoodApp.Admin', ['FoodApp.UserService'])
.controller('AdminCtrl', ['$scope', '$q', 'User', 'Payment', 'UserDay' , 'Menu', function ($scope, $q, User, Payment, UserDay, Menu){
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
        
        
        $scope.sysmenu = Menu.query({system:'none'});
		$scope.weekmenu = Menu.query();
        $scope.days = UserDay.query();
        
        $q.all([
            $scope.sysmenu.$promise,
            $scope.weekmenu.$promise,
            $scope.days.$promise
        ])
        .then(function(result) {
            $scope.weekdays = {};
            var nonemenu = $scope.sysmenu.pop();	
            var menucount = {};   
            var monday = new Date().GetMonday();
            var day = new Date().getDay();
            $scope.stat.select =  (day == 0 ? 6: day) + 1;
            
            // Generate days from Monday current week to next Monday 
            for (var i = 0; i < 8; i++) {
                var date = new Date(+monday)
                var day = {date:date,userselect:[],menu:[],total:0};
                var key = date.toDateString();
                $scope.weekdays[key] = day;
                monday.setDate(monday.getDate() + 1); 
            }
            
            // Fill days with users choice, count menu and day choice
            angular.forEach($scope.days, function(day) {
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
             
             // Fill menu array and add property count to each menu 
            angular.forEach($scope.weekmenu, function(menu) {
                $scope.menu[menu.id] = menu;
                var key = new Date(menu.onDate).toDateString();
                if ($scope.weekdays.hasOwnProperty(key)) {
                    menu.count = menucount[menu.id];
                    $scope.weekdays[key].menu.push(menu);
                };
			});    
            
            success();    
        }, failure)
        
        
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

