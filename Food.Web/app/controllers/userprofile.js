(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserProfile', UserProfile)
        
    
    UserProfile.$inject = ['User', 'Account', 'Payment', 'UserDay', 'authservice'];
    
    function UserProfile(User, Account, Payment, UserDay, authservice) {
        var vm = this;
        vm.auth = {}
        vm.payments = [];
        vm.userchoices = [];
        vm.share = {
            amount: 0,
            email: ''
        }

        vm.confirmEmail = confirmEmail;
        vm.shareBalance = shareBalance;
        vm.getPaymentSum = getPaymentSum;
        vm.getChoicesSum = getChoicesSum;

        activate();

        function activate() {
            authservice.reloadUserInfo();
            vm.auth = authservice.state
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


        function confirmEmail() {
            var acc = new Account();
            acc.$save({ action: 'ReConfirmEmail' });
        }

        function shareBalance(form) {
            var payment = new Payment(vm.share);
            payment.$share({},function (payment) {
                vm.payments.push(payment);
                authservice.reloadUserInfo();
            }, function (error) {
                vm.shareError = "Send balance error.";
                if (error.data.modelState['share.Email']) {
                    form.email.$setValidity('email', false); 
                } else {
                    form.email.$setValidity('email', true);
                }

                if (error.data.modelState['share.Amount']) {
                    form.amount.$setValidity('amount', false);
                } else {
                    form.amount.$setValidity('amount', true);
                }
            });
        }
    }
})();