(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('UserChoice', UserChoice);
        
    UserChoice.$inject = ['$scope', '$q', 'User', 'UserDay' , 'Menu'];    
    
    function UserChoice($scope, $q, User, UserDay, Menu) {
        $scope.title = "loading users choice ...";
        $scope.working = false;
        $scope.stat = {};
        $scope.menu = {};
        $scope.users = {};
        $scope.sysmenu = {};
        $scope.weekmenu = {};
        $scope.days = {};
        $scope.weekdays = {};
        $scope.getUser = getUser;
        $scope.getMenu = getMenu;
        $scope.confirmSelect = confirmSelect;
        
        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            $scope.working = true;
            $scope.title = "Users choice";
            $users = getUsers();
            
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
                $scope.stat.select =  (day == 0 ? 6: day);
                
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
           
        };
        
        function success(){
            $scope.working = false;
        };
        
        function failure(data){
            $scope.title = "Oops... something went wrong";
            $scope.working = false;
        };
            
        function getUsers() {
            var users = {};
            User.query(function(data){
                angular.forEach(data, function(user) {
                    users[user.id] = user;
                });
            });
            return users;
        }        
        
        function getUser(userday) {
            return $scope.users[userday.userid];
        };
        
        function getMenu(userday) {
            return $scope.menu[userday.selectid];
        };
        
        function confirmSelect(userday) {
            userday.confirm = true;
            userday.$update({id:userday.id});
            $scope.users[userday.userid].bill = $scope.users[userday.userid].bill - $scope.menu[userday.selectid].price;
        }
    };
})(); 