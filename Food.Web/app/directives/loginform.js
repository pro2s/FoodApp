(function () {
    'use strict';
    angular
        .module('app')
        .directive('loginForm', loginForm);

    loginForm.$inject = ['authservice'];
    function loginForm(authservice) {

        var directive = {
            restrict: 'E',
            replace: true,
            templateUrl: 'app/views/login.html',
            controller: Login,
            controllerAs: 'login',
        };
        return directive;


        function Login() {
            var login = this;
            login.form = authservice.form;
            login.register = register;
            login.doLogin = doLogin;
        }

        function register() {
            authservice.showRegister();
        }

        function doLogin() {
            authservice.doLogin();
        }

      

    };

})();
