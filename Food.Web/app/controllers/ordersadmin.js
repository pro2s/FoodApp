(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('OrdersAdmin', OrdersAdmin);
        
    OrdersAdmin.$inject = ['$q', 'User', 'UserDay' , 'Menu', 'Config', 'Pagination'];    
    
    function OrdersAdmin($q, User, UserDay, Menu, Config, Pagination) {
        var vm = this;
        var paginationID = 'allOrders';

        vm.titleWeek = "loading users orders ...";
        vm.titleAll = "All orders"
        vm.working = false;
        vm.activeday = {};
        vm.users = {};
        vm.weekdays = {};
        vm.menucount = {};
        vm.orders = [];
        vm.pages = {};

        vm.getAllOrders = getAllOrders;
        vm.getUser = getUser;
        vm.deleteSelect = deleteSelect;
        vm.confirmSelect = confirmSelect;
        vm.pageChanged = pageChanged;
        vm.isConfirmed = isConfirmed;
        vm.confirmDay = confirmDay;
        vm.totalOnDay = totalOnDay;

        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            vm.pages = Pagination.addPagination(paginationID);
            vm.working = true;
            vm.titleWeek = "Users orders";
            
            var day = new Date().getDay();
            vm.activeday =  (day == 0 ? 6: day);
                
            vm.users = User.getUsers();
            
            getAllOrders();

            var sysmenu = Menu.query({menuMode:'none'});
            var days = UserDay.query({list:'week'});
            
            $q.all([
                sysmenu.$promise,
                days.$promise
            ])
            .then(function(result) {
                var nonemenu = sysmenu.pop();	
                vm.menucount = {};   
                
                // Generate days from Monday current week to next Monday 
                vm.weekdays = {};
                var monday = new Date().GetMonday();
                for (var i = 0; i < 8; i++) {
                    var date = new Date(+monday)
                    var day = {date:date,userselect:[],menu:{}};
                    var key = date.toDateString();
                    vm.weekdays[key] = day;
                    monday.setDate(monday.getDate() + 1); 
                }
                
                // Fill days with users choice, count menu and day choice
                angular.forEach(days, function(day) {
                    var key = new Date(day.date).toDateString();
                    if (vm.weekdays.hasOwnProperty(key)) {
                        if (day.menuId != nonemenu.id) {
                            vm.weekdays[key].userselect.push(day)

                            if (typeof vm.weekdays[key].menu[day.menuId] == 'undefined') {
                                vm.weekdays[key].menu[day.menuId] = day.menu;
                                vm.weekdays[key].menu[day.menuId].count = 1;
                            } else {
                                vm.weekdays[key].menu[day.menuId].count++;
                            }
                            
                        }
                    }
                });
                
                success();    
            }, failure)
            
        };
        
        function success(){
            vm.working = false;
        };
        
        function failure(data){
            vm.titleWeek = "Oops... something went wrong";
            vm.working = false;
        };
            
        function totalOnDay(day) {
            day.menu = {};
            for (var i = 0, len = day.userselect.length; i < len; i++) {
                var menu = day.userselect[i].menu;
                if (typeof day.menu[menu.id] == 'undefined') {
                    day.menu[menu.id] = menu;
                    day.menu[menu.id].count = 1;
                } else {
                    day.menu[menu.id].count++;
                }
            }
        }


        function getUser(userday) {
            return vm.users[userday.userID];
        };
        
        function confirmSelect(userday, bulk) {

            if (!bulk) {
                bulk = false;
            }

            userday.confirm = !userday.confirm;
            userday.$update({id:userday.id})
                .then(function () {
                    if (!bulk) {
                        getAllOrders();
                    }
                    // Ok
                })
                .catch(function () {
                    // TODO: Show error 
                    userday.confirm = !userday.confirm;
                });
            
        }

        function deleteSelect(orders, index) {
            var userday = orders[index];
            userday.$delete({ id: userday.id })
                .then(function () {
                    orders.splice(index, 1);
                })
                .catch(function () {
                    // TODO: Show error msg
                });

        }

        function pageChanged() {
            getAllOrders();
        }

        function getAllOrders() {
            UserDay.all({ pagination: paginationID }, function (data, getHeaders) {
                vm.orders = data;
            }, function () {
                // TODO: Show error msg
            })
        }
      
        function isConfirmed(day) {
            var result = true;
            for (var i = 0, len = day.userselect.length; i < len; i++) {
                if (!day.userselect[i].confirm) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        function confirmDay(day) {
            
            for (var i = 0, len = day.userselect.length; i < len; i++) {
                if (!day.userselect[i].confirm) {
                    confirmSelect(day.userselect[i],true);
                }
            }
            // need promises from confirm
            getAllOrders();
            totalOnDay(day);
        }
    };
})(); 