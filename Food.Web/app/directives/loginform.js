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
            controller: LoginController,
            controllerAs: 'login',
        };
        return directive;


        function LoginController() {
            var login = this;
            login.form = {};
            login.id = 'modalLoginForm';
            var view = {
                name:'Bootstrap Modal Login Form',
                show: showLogin,
                hide: hideLogin,
                isError: isError,
            }            
            login.register = register;
            login.doLogin = doLogin;
            login.hideLogin = hideLogin;
            
            activate();
            
            function activate() {
                login.form = authservice.form;
                $(document).on('hide.bs.modal', '#' + login.id, onHide);
                $(document).on('show.bs.modal', '#' + login.id, onShow);
                authservice.setView(view);
            }
            
            function onShow() {
                login.form.active = true;
            }
            
            function onHide() {
                login.form.active = false;
            }
            
            function showLogin() {
                $('#' + login.id).modal('show');
            }

            function hideLogin() {
                $('#' + login.id).modal('hide');
            }
            
            function register() {
                authservice.showRegister();
            }

            function doLogin() {
                if (login.form.registred) {
                    authservice.doLogin();
                } else {
                    authservice.doRegister();
                }
                
            }

            function isError() {

            }
        }
      

    };

})();
