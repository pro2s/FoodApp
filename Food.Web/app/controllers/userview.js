(function() {
    'use strict';
    angular
        .module('app.user')
        .controller('UserView', UserView)
        
    
    UserView.$inject = ['User', 'Account', 'Payment', 'authservice'];
    
    function UserView(User, Account, Payment, authservice) {
        var vm = this;
        vm.auth = authservice.state
    }
})();