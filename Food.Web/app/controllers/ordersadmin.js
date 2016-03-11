(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('OrdersAdmin', OrdersAdmin);
        
    OrdersAdmin.$inject = ['$q', 'User', 'UserDay' , 'Menu', 'Config'];    
    
    function OrdersAdmin($q, User, UserDay, Menu, Config) {
        var vm = this;
        vm.title = "loading users choice ...";
        vm.working = false;
        vm.activeday = {};
        vm.users = {};
        vm.weekdays = {};
        vm.menucount = {};
        vm.tab = 'week';
        vm.orders = {total: 0, current:1, perPage:10, pageData:[]};

        vm.getAllOrders = getAllOrders;
        vm.getUser = getUser;
        vm.deleteSelect = deleteSelect;
        vm.confirmSelect = confirmSelect;
        vm.setTab = setTab;
        vm.isTab = isTab;
        vm.pageChanged = pageChanged;
        vm.isConfirmed = isConfirmed;
        vm.confirmDay = confirmDay;


        activate();
        
        // TODO: Decompose on methods 
        function activate() {
            vm.working = true;
            vm.title = "Users choice";
            
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
                    var day = {date:date,userselect:[],menu:[],total:0};
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
                                vm.weekdays[key].menu[day.menuId] = {};
                                vm.weekdays[key].menu[day.menuId].count = 1;
                                vm.weekdays[key].menu[day.menuId].menu = day.menu
                                vm.weekdays[key].total = 1;
                            } else {
                                vm.weekdays[key].menu[day.menuId].count++;
                                vm.weekdays[key].total++;
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
            vm.title = "Oops... something went wrong";
            vm.working = false;
        };
            
        function getUser(userday) {
            return vm.users[userday.userID];
        };
        
        function confirmSelect(userday) {
            userday.confirm = !userday.confirm;
            userday.$update({id:userday.id})
                .then(function () {
                    var price = (userday.confirm ? -1 : 1) * userday.menu.price
                    vm.users[userday.userID].bill = vm.users[userday.userID].bill + price;
                })
                .catch(function () {
                    // TODO: Show error msg
                    userday.confirm = false;
                });
            
        }

        function deleteSelect(userselect, index) {
            var userday = userselect[index];
            userday.$delete({ id: userday.id })
                .then(function () {
                    userselect.splice(index, 1);
                })
                .catch(function () {
                    // TODO: Show error msg
                });

        }

        function setTab(name) {
            vm.tab = name;
        }

        function isTab(name) {
            return vm.tab == name;
        }

        function pageChanged() {
            getAllOrders();
        }

        function parseRange(hdr) {
            var m = hdr && hdr.match(/^(?:\S+ )?(\d+)-(\d+)\/(\d+|\*)$/);
            if (m) {
                return {
                    from: +m[1],
                    to: +m[2],
                    total: m[3] === '*' ? Infinity : +m[3]
                };
            } else if (hdr === '*/0') {
                return { total: 0 };
            }
            return null;
        }

        function parseHeaders(headers) {
            var range = parseRange(headers['content-range']);
            if (range) {
                vm.orders.total = range.total;
                vm.orders.current = Math.ceil(range.from / vm.orders.perPage) + 1;
            } else {
                vm.orders.total = vm.orders.pageData.length;
                vm.orders.currentPage = 1;
            }
        }

        function getAllOrders() {
            var from = (vm.orders.current - 1) * vm.orders.perPage;
            var to = from + vm.orders.perPage - 1;
          
            Config.set('allOrdersRange', 'x-entity=' + from + '-' + to);

            UserDay.all({}, function (data, getHeaders) {
                vm.orders.pageData = data;
                parseHeaders(getHeaders());
            }, function () {

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
                    confirmSelect(day.userselect[i]);
                }
            }
        }
    };
})(); 