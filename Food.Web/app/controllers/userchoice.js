(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserChoice', UserChoice);
    
    UserChoice.$inject = ['$q','UserDay','Menu','dateservice'];
    
    function UserChoice($q, UserDay, Menu, dateservice) {
        var uc = this;
        uc.date = new Date();
        uc.sysmenu = []
        uc.weekmenu = []
        uc.days = []
        uc.error = true;
        uc.working = false;
        uc.correctData = false;
        uc.sendData = false;
        uc.title = "Loading ...";
        uc.status = "Loading food ...";
        
       
        uc.init = activate;
        uc.answer = answer;
        uc.isDisable = isDisable;
        uc.setDaySelect = setDaySelect;
        uc.sendUserChoice = sendUserChoice;
        
        activate();
        
        function activate() {
            uc.status = "Loading food ...";
            uc.sendData = false;
            uc.working = true;
            uc.error = true;
            
            
            uc.sysmenu = Menu.query({system:'none'});
            uc.weekmenu = Menu.query();
            uc.days = UserDay.query({userid:uc.userid});
            
            $q.all([
                uc.sysmenu.$promise,
                uc.weekmenu.$promise,
                uc.days.$promise
            ])
            .then(function(result) {
                uc.weekdays = {};
                var nonemenu = uc.sysmenu.pop()
                var monday = new Date().GetMonday();
                
                // Generate days from Monday current week to next Monday 
                for (var i = 0; i < 8; i++) {
                    var menu = [];
                    menu.push(nonemenu);
                    
                    var date = new Date(+monday)
                    var day = {date:date,menu:menu,select:{},userday:{}};
                    var key = date.toDateString();
                    uc.weekdays[key] = day;
                    monday.setDate(monday.getDate() + 1); 
                }	
                
                // Fill days with menu for this day
                angular.forEach(uc.weekmenu, function(menu) {
                    var day = new Date(menu.onDate).getDay()-1;
                    var key = new Date(menu.onDate).toDateString();
                    if (uc.weekdays.hasOwnProperty(key)) {
                        uc.weekdays[key].menu.push(menu);
                    }
                }) ;
                
                // Delete days without choice 
                for (var key in uc.weekdays) {
                    var day = uc.weekdays[key];
                    if (day.menu.length == 1) {
                        delete uc.weekdays[key]
                    }
                }
                
                // Set user choice to each day
                angular.forEach(uc.days, function(day) {
                    var key = new Date(day.date).toDateString();
                    if (uc.weekdays.hasOwnProperty(key)) {
                        angular.forEach(uc.weekdays[key].menu, function(menu) {
                            if (menu.id == day.selectid){
                                uc.weekdays[key].select = menu;
                                uc.weekdays[key].userday = day;
                            }		
                        });
                    }
                });
                
                success();
                console.log('all done');            
                
            }, failure);
       };
        
        
        function success() {
            uc.error = false;
            uc.working = false;
        };
        
        function failure() {
            uc.status = "Oops... something went wrong";
            uc.error = true;
            uc.working = false;
        };
        
        function answer() {
            return uc.correctData ? 'Changes accepted' : 'Сhanges rejected';
        };

        function isDisable(day) {
            return !dateservice.check(day.date) || day.userday.confirm
        };
        
        
        function setDaySelect(day, menu) {
            if (dateservice.check(day.date) && !day.userday.confirm) {
                day.select = menu;
            }
        };
        
        function sendUserChoice(days) {
            uc.working = true;
            uc.sendData = true;
            
            for (var key in uc.weekdays) {
                var day = uc.weekdays[key];
                
                if (isEmpty(day.userday)) {
                    if (!isEmpty(day.select)) {
                        console.log('save');
                        var userday = new UserDay({userid:uc.userid, selectid: day.select.id, date:day.date});
                        userday.$save();
                    }
                }
                else if (day.select.id != day.userday.selectid) {
                    console.log('update');
                    day.userday.selectid = day.select.id;
                    day.userday.$update({id:day.userday.id});
                }
            }
            
            uc.working = false;
            
            // false if error in response
            uc.correctData = true; 
        };
    };
    
})(); 