(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('ChoiceAdmin', ChoiceAdmin);
        
    ChoiceAdmin.$inject = ['$q', 'User', 'UserDay' , 'Menu'];    
    
    function ChoiceAdmin($q, User, UserDay, Menu) {
        var ca = this;
        ca.title = "loading users choice ...";
        ca.working = false;
        ca.activeday = {};
        ca.menu = {};
        ca.users = {};
        ca.weekdays = {};
        
        ca.getUser = getUser;
        ca.getMenu = getMenu;
        ca.confirmSelect = confirmSelect;
        
        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            ca.working = true;
            ca.title = "Users choice";
            
            var day = new Date().getDay();
            ca.activeday =  (day == 0 ? 6: day);
                
            ca.users = User.getUsers();
            
            var sysmenu = Menu.query({system:'none'});
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
                ca.weekdays = {};
                var monday = new Date().GetMonday();
                for (var i = 0; i < 8; i++) {
                    var date = new Date(+monday)
                    var day = {date:date,userselect:[],menu:[],total:0};
                    var key = date.toDateString();
                    ca.weekdays[key] = day;
                    monday.setDate(monday.getDate() + 1); 
                }
                
                // Fill days with users choice, count menu and day choice
                angular.forEach(days, function(day) {
                    var key = new Date(day.date).toDateString();
                    if (ca.weekdays.hasOwnProperty(key)) {
                        ca.weekdays[key].userselect.push(day)
                        if (day.menuId != nonemenu.id) {
                            if (typeof menucount[day.menuId] == 'undefined'){
                                menucount[day.menuId]=1;
                                ca.weekdays[key].total++;
                            } else {
                                menucount[day.menuId]++;
                                ca.weekdays[key].total++;
                            }
                        }
                    }
                });
                
                // Fill menu array and add property count to each menu 
                angular.forEach(weekmenu, function(menu) {
                    ca.menu[menu.id] = menu;
                    var key = new Date(menu.onDate).toDateString();
                    if (ca.weekdays.hasOwnProperty(key)) {
                        menu.count = menucount[menu.id];
                        ca.weekdays[key].menu.push(menu);
                    };
                });    
                
                success();    
            }, failure)
            
        };
        
        function success(){
            ca.working = false;
        };
        
        function failure(data){
            ca.title = "Oops... something went wrong";
            ca.working = false;
        };
            
        function getUser(userday) {
            return ca.users[userday.userID];
        };
        
        function getMenu(userday) {
            return ca.menu[userday.menuId];
        };
        
        function confirmSelect(userday) {
            userday.confirm = true;
            userday.$update({id:userday.id});
            ca.users[userday.menuId].bill =ca.users[userday.menuId].bill -ca.menu[userday.menuId].price;
        }
    };
})(); 