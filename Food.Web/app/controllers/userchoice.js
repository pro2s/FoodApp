(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserChoice', UserChoice);
    
    UserChoice.$inject = ['$q','UserDay','Menu','dateservice', 'authservice'];
    
    function UserChoice($q, UserDay, Menu, dateservice, authservice) {
        var uc = this;
        uc.date = new Date();
        uc.sysmenu = []
        uc.weekmenu = []
        uc.days = []
        uc.error = true;
        uc.working = false;
        uc.title = "Loading ...";
        uc.status = "Loading food ...";
        uc.readonly = true;
        uc.weekdays = [];
        uc.numweekdays = 0;

        uc.init = activate;
        uc.isDisable = isDisable;
        uc.setUserOrder = setUserOrder;
        uc.weekOffset = weekOffset;

        activate();
        
        function activate() {
            CheckUser();
            authservice.registerEvent('UserLogged', CheckUser);
            authservice.registerEvent('UserLogout', CheckUser);
        };

        
        function weekOffset() {
            var offset = 0;
            if (uc.numweekdays < 7) {
                offset = 6 - uc.numweekdays;
            }
            return new Array(offset);
        }
        
        function CheckUser() {
            uc.readonly = true;
            if (authservice.checkAccess('isAuthenticated',[])) {
                 FillUserChoice();
                 uc.readonly = false;
            }
        }

        function FillUserChoice() {
            uc.status = "Loading food ...";
            uc.working = true;
            uc.error = true;
            uc.weekdays = {};
            
            uc.sysmenu = Menu.query({menuMode:'none'});
            uc.weekmenu = Menu.query();
            uc.days = UserDay.query({userid:uc.userid});
            
            $q.all([
                uc.sysmenu.$promise,
                uc.weekmenu.$promise,
                uc.days.$promise
            ])
            .then(function(result) {
                
                var nonemenu = uc.sysmenu.pop()

                // Generate days from Monday current week to next Monday 
                uc.weekdays = FillWeek(nonemenu);
                
                // Fill days with menu for this day
                angular.forEach(uc.weekmenu, function(menu) {
                    var key = new Date(menu.onDate).toDateString();
                    if (uc.weekdays.hasOwnProperty(key)) {
                        uc.weekdays[key].menu.push(menu);
                    }
                }) ;
                
                uc.numweekdays = 0;
                // Delete days without choice and count other
                for (var key in uc.weekdays) {
                    var day = uc.weekdays[key];
                    if (day.menu.length == 1) {
                        delete uc.weekdays[key]
                    } else {
                        uc.numweekdays++;
                    }
                }
                
                // Set user choice to each day
                angular.forEach(uc.days, function(day) {
                    var key = new Date(day.date).toDateString();
                    if (uc.weekdays.hasOwnProperty(key)) {
                        uc.weekdays[key].userday = day;
                    }
                });
                
                success();
                
            }, failure);
        }
        
        
        function FillWeek(nonemenu) {
            var week = {}
            var monday = dateservice.getMonday();
            for (var i = 0; i < 8; i++) {
                var menu = [];
                menu.push(nonemenu);
                
                var date = new Date(+monday)
                var day = {date:date,menu:menu,userday:{}};
                var key = date.toDateString();
                week[key] = day;
                monday.setDate(monday.getDate() + 1); 
            }
            return week;
        }
        
        function success() {
            uc.error = false;
            uc.working = false;
        };
        
        function failure() {
            uc.status = "Oops... something went wrong";
            uc.error = true;
            uc.working = false;
        };
        
        
        function isDisable(day) {
            return !dateservice.check(day.date) || day.userday.confirm
        };
        
        
        function setUserOrder(day, menu) {
            if (dateservice.check(day.date) && !day.userday.confirm) {
                var oldmenu = day.userday.menu;
                if (isEmpty(day.userday)) {
                    day.userday = {};
                    day.userday.menuId = menu.id;
                    var userday = new UserDay({ menuId: menu.id, date: day.date });
                    userday.$save(function (data) {
                        day.userday = data;
                        day.userday.menu = menu;
                    }, function () {
                        day.userday = {};
                        // Error
                    });

                } else if (menu.id != day.userday.menuId) {
                    
                    day.userday.menuId = menu.id;
                    day.userday.$update({ id: day.userday.id }, function () {
                        day.userday.menu = menu;
                    }, function () {
                        day.userday.menu = oldmenu;
                        day.userday.menuId = oldmenu.id;
                        // Error
                    });
                }
            }
        };


    };
    
})(); 