(function() {
    'use strict';
    angular
        .module('app.admin')
        .controller('UserAdmin', UserAdmin)
        
    
    UserAdmin.$inject = ['User', 'Payment','Account'];        
    
    function UserAdmin(User, Payment, Account) {
        var vm = this;
        
        vm.title = "loading users ...";
        vm.payment = {id: 0, value: 0, error: false};
        vm.addId = -1;
        vm.users = {};
        vm.isadd = isAdd;
        vm.onadd = onAdd;
        vm.cancel = cancel;
        vm.sendpayment = sendPayment;
        vm.isAdmin = isAdmin;
        vm.switchRole = switchRole;

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
                user.balance = parseInt(user.balance) + add;
                
                var pay = new Payment({userid:user.id, sum:add})
                pay.$save();
                
                vm.addId = -1;
                vm.payment.value = 0;
            }
        };
        
        function isAdmin(user){
            var result = false;
            if (user.roles.indexOf("Admin") != -1) {
                result = true;
            }
            return result;
        }

        function switchRole(user) {
            var acc = new Account({ userId: user.id, role: 'Admin' });
            acc.$save({ action: 'SwitchRole' })
                .then(function () {
                    var index = user.roles.indexOf("Admin");
                    if (index > -1) {
                        user.roles.splice(index, 1);
                    } else {
                        user.roles.push("Admin");
                    }
                })
        }
    };
    
})(); 