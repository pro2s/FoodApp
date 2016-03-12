(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserProfile', UserProfile)
        
    
    UserProfile.$inject = ['User', 'Account', 'Payment', 'UserDay', 'authservice', 'Pagination'];
    
    function UserProfile(User, Account, Payment, UserDay, authservice, Pagination) {
        var vm = this;
        var ordersPaginationID = "userOrders";
        var paymentsPaginationID = "userPayments"
        vm.auth = {}
        vm.payments = [];
        vm.userorders = [];
        vm.ordersSum = 0;
        vm.paymentsSum = 0;
        vm.share = {
            amount: 0,
            email: ''
        }
        vm.changePwd = {};
        vm.ordersPages = {};
        vm.paymentsPages = {};

        vm.confirmEmail = confirmEmail;
        vm.shareBalance = shareBalance;
        vm.getUserOrders = getUserOrders;
        vm.getPayments = getPayments;
        activate();

        function activate() {
            vm.ordersPages = Pagination.addPagination(ordersPaginationID, 7);
            vm.paymentsPages = Pagination.addPagination(paymentsPaginationID, 7);
            authservice.reloadUserInfo();
            vm.auth = authservice.state
            getPayments();
            getUserOrders();
            getOrdersSum();
            getPaymentsSum();
        }

        function getPayments() {
            Payment.query({pagination: paymentsPaginationID },
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

        function getPaymentsSum() {
            Payment.get({ id: 'Sum' }, function (data) {
                vm.paymentsSum = data.sum;
            })
        }

        function getOrdersSum() {
            UserDay.get({ id: 'Sum' }, function (data) {
                vm.ordersSum = data.sum;
            })
        }


        function confirmEmail() {
            var acc = new Account();
            acc.$save({ action: 'ReConfirmEmail' });
        }

        function shareBalance(form) {
            var payment = new Payment(vm.share);
            payment.$share({},function (payment) {
                getPayments();
                getPaymentsSum();
                // Balance from UserInfo 
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