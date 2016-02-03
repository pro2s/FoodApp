(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('UserAdmin', UserAdmin)
        
    
    UserAdmin.$inject = ['$scope', 'User', 'Payment'];        
    
    function UserAdmin($scope, User, Payment) {
        var vm = this;
        
        vm.title = "loading users ...";
        vm.payment = {id: 0, value: 0, error: false};
        vm.addId = -1;
        vm.users = {};
        vm.isadd = isAdd;
        vm.onadd = onAdd;
        vm.cancel = cancel;
        vm.sendpayment = sendPayment;

        activate();
        
        function activate() {
            vm.users = User.getUsers();
            vm.title = "Users"
        }
        
        
        function isAdd(id) {
            if (vm.addId == id) {
                return true;
            }
            else
            {
                return false;
            }
        };
        
        function onAdd(id) {
            vm.addId = id;
        };
        
        function cancel() {
            vm.addId = -1;
            vm.payment.error = false;
            vm.payment.value = 0;
        };
        
        function sendPayment(user) {
            if (vm.addId < 0 ) {
                return;
            }
            var add = parseInt(vm.payment.value);
            if (isNaN(add)) {
                vm.payment.error = true;
            }
            else
            {
                vm.payment.error = false;
                user.bill = parseInt(user.bill) + add;
                
                var pay = new Payment({userid:user.id, sum:add})
                pay.$save();
                
                vm.addId = -1;
                vm.payment.value = 0;
            }
        };
        
    };
    
})(); 