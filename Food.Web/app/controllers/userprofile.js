(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserProfile', UserProfile)
        
    
    UserProfile.$inject = ['User', 'Account', 'Payment', 'UserDay', 'authservice', 'Pagination'];
    
    function UserProfile(User, Account, Payment, UserDay, authservice, Pagination) {
        var vm = this;
        var ordersPaginationID = "userOrders"
        vm.auth = {}
        vm.payments = [];
        vm.userorders = [];
        vm.share = {
            amount: 0,
            email: ''
        }
        vm.changePwd = {};
        vm.ordersPages = {};

        vm.confirmEmail = confirmEmail;
        vm.shareBalance = shareBalance;
        vm.getPaymentSum = getPaymentSum;
        vm.getChoicesSum = getChoicesSum;
        vm.getUserOrders = getUserOrders
        activate();

        function activate() {
            vm.ordersPages = Pagination.addPagination(ordersPaginationID, 7);
            authservice.reloadUserInfo();
            vm.auth = authservice.state
            getPayments();
            getUserOrders();
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

        function getUserOrders() {
            UserDay.query({ list: 'personal', pagination: ordersPaginationID },
                function (data) {
                    vm.userorders = data;
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