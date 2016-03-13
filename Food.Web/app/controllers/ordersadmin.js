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
        vm.orders = [];
        vm.pages = {};

        vm.getAllOrders = getAllOrders;
        vm.getUser = getUser;
        vm.deleteOrder = deleteOrder;
        vm.confirmOrder = confirmOrder;
        vm.pageChanged = pageChanged;
        vm.isConfirmed = isConfirmed;
        vm.confirmDay = confirmDay;
        vm.totalOnDay = totalOnDay;
        vm.updateDay = updateDay;

        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            vm.pages = Pagination.addPagination(paginationID);
            vm.working = true;
            vm.titleWeek = "Users orders";
            
            vm.today = new Date().toDateString();
                
            vm.users = User.getUsers();
            
            getAllOrders();

            var promises = [];
            
            vm.weekdays = {};
            var monday = new Date().GetMonday();
            for (var i = 0; i < 8; i++) {
                var date = new Date(+monday)
                var key = date.toDateString();
                var day = { date: date, orders: {}, menu: {} };
                day.orders = UserDay.query({ list: 'day', startdate: date });
                promises.push(day.orders.$promise);
                vm.weekdays[key] = day;
                monday.setDate(monday.getDate() + 1); 
            }
                
            
            
            $q.all(promises)
            .then(function(result) {
                
                for (var key in vm.weekdays) {
                    totalOnDay(vm.weekdays[key]);
                }              
              
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
         
        
         
        /**
         * Calculate totlas on menu for day
         * @param {object} day object (date,oders,menu)
         */
        function totalOnDay(day) {
            

            day.menu = {};
            for (var i = 0, len = day.orders.length; i < len; i++) {
                var menu = day.orders[i].menu;
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

        /**
         * Update orders on date
         * @param {Date} date
         */
        function updateDay(date) {
            var key = new Date(date).toDateString();
            var day = vm.weekdays[key];
            var orders = UserDay.query({ list: 'day', startdate: date }, function () {
                day.orders = orders;
                totalOnDay(day);
            });
        }


        /**
         * Confirm user order
         * @param {UserDay} order - user order
         * @param {bool} bulk - true when bulk operation
         */
        function confirmOrder(order, bulk) {
            if (!bulk) {
                bulk = false;
            }
            var d = $q.defer();
            
            order.confirm = !order.confirm;
            UserDay.update({ id: order.id }, order, function () {
                if (!bulk) {
                    getAllOrders();
                    updateDay(order.date);
                }
                d.resolve();
                // Ok
            }, function () {
                // Error
                order.confirm = !order.confirm;
            });

            return d.promise;
        }

        function deleteOrder(order) {
            UserDay.delete({ id: order.id }, function () {
                    getAllOrders();
                    updateDay(order.date);
                }, function () {
                    // Error
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
            for (var i = 0, len = day.orders.length; i < len; i++) {
                if (!day.orders[i].confirm) {
                    result = false;
                    break;
                }
            }
            return result;
        }

        /**
         * Confirm all orders for day
         * @param {object} day 
         */
        function confirmDay(day) {
            var promises = [];
            for (var i = 0, len = day.orders.length; i < len; i++) {
                if (!day.orders[i].confirm) {
                    promises.push(confirmOrder(day.orders[i], true));
                }
            }
            $q.all(promises).then(function () {
                    getAllOrders();
                    totalOnDay(day);
            });
        }
    };
})(); 