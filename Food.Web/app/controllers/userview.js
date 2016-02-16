(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserView', UserView)
        
    
    UserView.$inject = ['User', 'Account', 'Payment', 'UserDay', 'authservice'];
    
    function UserView(User, Account, Payment, UserDay, authservice) {
        var vm = this;
        vm.auth = authservice.state
        vm.setAdmin = setAdmin;
        vm.payments = [];
        vm.userchoices = [];
        vm.getPaymentSum = getPaymentSum;
        vm.getChoicesSum = getChoicesSum;
        
        activate();

        function activate() {
            getPayments();
            getUserChoices();
        }

        function getPayments() {
            Payment.query(
                function (data) {
                    vm.payments = data;
                },
                function (data) {
                    vm.payments = [];
                }
            );
        }

        function getUserChoices() {
            UserDay.query({list:'personal'},
                function (data) {
                    vm.userchoices = data;
                },
                function (data) {
                    vm.userchoices = [];
                }
            );
        }

        function getPaymentSum() {
            var sum = 0;
            angular.forEach(vm.payments, function (payment) {
                sum += payment.sum;
            })
            return sum;
        }

        function getChoicesSum() {
            var sum = 0;
            angular.forEach(vm.userchoices, function (choice) {
                if (choice.confirm) {
                    sum += choice.menu.price;
                }
            })
            return sum;
        }


        function setAdmin() {
            var acc = new Account({Role:'Admin'});
            acc.$save({ action: 'SetRole'});
        }
    }
})();