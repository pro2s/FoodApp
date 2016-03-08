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
        vm.setClaim = setClaim;
        vm.checkClaim = checkClaim;
        vm.lockout = lockout;
        vm.isLockout = isLockout;


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

        function updateUser(user) {
            User.get({ id: user.id }, function (data) {
                vm.users[user.id] = data;    
            });
        }

        function setClaim(user, claimType, claimValue) {
            var config = { userId: user.id, type: claimType, value: claimValue};
            if (checkClaim(user, claimType, claimValue)) {
                config.value = '';
            }
            var acc = new Account(config);
            acc.$save({ action: 'UserClaim'})
                .then(function () {
                    updateUser(user);// Ok
                });
        }

        function checkClaim(user, claimType, claimValue) {
            var result = false;
            angular.forEach(user.claims, function (claim) {
                if (claimType == claim.claimType) {
                    result = claimValue == claim.claimValue;
                }
            });
            return result;
        }

        function lockout(user, minutes) {
            if (!minutes) {
                minutes = 60 * 24;
            }

            if (isLockout(user)) {
                minutes = 0;
            }

            var config = { userId: user.id, minutes: minutes };
            var acc = new Account(config);
            acc.$save({ action: 'UserLockout' })
                .then(function () {
                    updateUser(user);// Ok
                });
        }

        function isLockout(user) {
            var end = new Date(user.lockoutEndDate)
            var now = new Date();
            var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            return end > utc;
        }
    };
    
})(); 