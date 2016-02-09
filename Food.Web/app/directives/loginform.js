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
            scope: {},
            templateUrl: 'app/views/login.html',
            controller: Login,
            controllerAs: 'login',
        };
        return directive;


        function Login() {
            var login = this;
            login.id = 'modalLoginForm';
            login.form = authservice.form;
            login.register = register;
            login.doLogin = doLogin;
            var view = {
                name:'Bootstrap Modal Login Form',
                show: showLogin,
                hide: hideLogin
            }            
            authservice.setView(view);
        
        
            function showLogin() {
                login.form.active = true;
                $('#' + login.id).modal('show');
            }

            function hideLogin() {
                login.form.active = false;
                $('#' + login.id).modal('hide');
            }

            function register() {
                authservice.showRegister();
            }

            function doLogin() {
                authservice.doLogin();
            }
        }
      

    };

})();
