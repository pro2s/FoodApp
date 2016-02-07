(function () {
    'use strict';
    angular
        .module('app')
        .factory('authservice', authService);

    authService.$inject = ['$http', '$rootScope', 'Account'];
    function authService($http, $rootScope, Account) {
        var form = {
            title: "Login",
            btnText: "Login",
            registred: true,
            error: false,
            email: '',
            password: '',
            repassword: '',
        }

        var state = {
            isLogined: false,
            username: ''
        };

        var service = {
            init: init,
            form: form,
            state: state,
            showLogin: showLogin,
            showRegister: showRegister,
            doLogin: doLogin,
            doLogout: doLogout,
        };

        return service;

        function init() {
            var type = sessionStorage.getItem('tokenType');
            var key = sessionStorage.getItem('tokenKey');
            var token = type + ' ' + key;

            if (token.length > 0) {
                
                $http.defaults.headers.common['Authorization'] = token;
                var info = Account.get({ action: "UserInfo" }, function () {
                    state.username = info.email;
                    state.isLogined = true;
                });
            }

        }

        function setInfo(data) {
            state.isLogined = true;
            state.username = data.email;
        }

        function showLogin() {
            form.title = "Login";
            form.btnText = "Login";
            form.registred = true;
            $('#loginModal').modal('show');

        }

        function showRegister() {
            form.title = "Register";
            form.btnText = "Register";
            form.registred = false;
            $('#loginModal').modal('show');
        };

        function doLogin() {
            var data = "grant_type=password&username=" + form.email + "&password=" + form.password;
            var config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
            $http.post($rootScope.api + 'token', data, config).success(successLogin).error(failedLogin);
        }

        function successLogin(data) {
            form.error = false;
            form.msg = "";
            $('#loginModal').modal('hide');
            state.isLogined = true;
            state.username = data.userName;
            sessionStorage.setItem('tokenKey', data.access_token);
            sessionStorage.setItem('tokenType', data.token_type);
            init();
        }

        function failedLogin(data) {
            state.isLogined = false;
            form.error = true;
            form.msg = data.error_description;
        }

        function doLogout() {
            state.isLogined = false;
            sessionStorage.removeItem('tokenKey');
            sessionStorage.removeItem('tokenType');
        }
    };

})()