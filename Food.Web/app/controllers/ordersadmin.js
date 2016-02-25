(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('OrdersAdmin', OrdersAdmin);
        
    OrdersAdmin.$inject = ['$q', 'User', 'UserDay' , 'Menu'];    
    
    function OrdersAdmin($q, User, UserDay, Menu) {
        var vm = this;
        vm.title = "loading users choice ...";
        vm.working = false;
        vm.activeday = {};
        vm.menu = {};
        vm.users = {};
        vm.weekdays = {};
        
        vm.getUser = getUser;
        vm.getMenu = getMenu;
        vm.confirmSelect = confirmSelect;
        
        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            vm.working = true;
            vm.title = "Users choice";
            
            var day = new Date().getDay();
            vm.activeday =  (day == 0 ? 6: day);
                
            vm.users = User.getUsers();
            
            var sysmenu = Menu.query({menuMode:'none'});
            var weekmenu = Menu.query();
            var days = UserDay.query({list:'all'});
            
            $q.all([
                sysmenu.$promise,
                weekmenu.$promise,
                days.$promise
            ])
            .then(function(result) {
                
                var nonemenu = sysmenu.pop();	
                var menucount = {};   
                
                // Generate days from Monday current week to next Monday 
                vm.weekdays = {};
                var monday = new Date().GetMonday();
                for (var i = 0; i < 8; i++) {
                    var date = new Date(+monday)
                    var day = {date:date,userselect:[],menu:[],total:0};
                    var key = date.toDateString();
                    vm.weekdays[key] = day;
                    monday.setDate(monday.getDate() + 1); 
                }
                
                // Fill days with users choice, count menu and day choice
                angular.forEach(days, function(day) {
                    var key = new Date(day.date).toDateString();
                    if (vm.weekdays.hasOwnProperty(key)) {
                        vm.weekdays[key].userselect.push(day)
                        if (day.menuId != nonemenu.id) {
                            if (typeof menucount[day.menuId] == 'undefined'){
                                menucount[day.menuId]=1;
                                vm.weekdays[key].total++;
                            } else {
                                menucount[day.menuId]++;
                                vm.weekdays[key].total++;
                            }
                        }
                    }
                });
                
                // Fill menu array and add property count to each menu 
                angular.forEach(weekmenu, function(menu) {
                    vm.menu[menu.id] = menu;
                    var key = new Date(menu.onDate).toDateString();
                    if (vm.weekdays.hasOwnProperty(key)) {
                        menu.count = menucount[menu.id];
                        vm.weekdays[key].menu.push(menu);
                    };
                });    
                
                success();    
            }, failure)
            
        };
        
        function success(){
            vm.working = false;
        };
        
        function failure(data){
            vm.title = "Oops... something went wrong";
            vm.working = false;
        };
            
        function getUser(userday) {
            return vm.users[userday.userID];
        };
        
        function getMenu(userday) {
            return vm.menu[userday.menuId];
        };
        
        function confirmSelect(userday) {
            userday.confirm = true;
            userday.$update({id:userday.id})
                .then(function () {
                    vm.users[userday.userID].bill = vm.users[userday.userID].bill - vm.menu[userday.menuId].price;
                })
                .catch(function () {
                    // TODO: Show error msg
                    userday.confirm = false;
                });
            
        }
    };
})(); 