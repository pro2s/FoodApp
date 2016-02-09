(function () {
    'use strict';
    angular
        .module('app')
        .factory('authservice', authService);

    authService.$inject = ['$http', 'Config', 'Account'];
    function authService($http, Config, Account) {
        var _form = {
            title: "Login",
            btnText: "Login",
            registred: true,
            error: false,
            email: '',
            password: '',
            repassword: '',
        }

        var _state = {
            isLogged: false,
            roles:'',
            email:'',
            username: '',
        };
        
        var _view = {
            show: function() {},
            hide: function() {},
        }

        var service = {
            init: init,
            view: _view,
            form: _form,
            state: _state,
            checkAccess: checkAccess,
            checkRoles: checkRoles,
            setView: setView,
            showLogin: showLogin,
            showRegister: showRegister,
            doLogin: doLogin,
            doLogout: doLogout,
        };

        return service;
        
        
        function checkAccess(access, roles) {
            var allow = true;
            if (access && access != 'isAnonymous') {
                if (access == 'isAuthenticated') {
                    allow = _state.isLogged;
                    if (roles && allow) {
                        allow = !checkRoles(roles);
                    } 
                }
            }
            return allow;
        }
        
        function checkRoles(roles) {
            var result = false;
            for (var i = 0; i < roles.length; i++) {
                if (_state.role.indexOf(roles[i]) != -1) {
                    result = true;
                    break;
                };
            }
            return result;
        }
        
        function init(type) {
            var key = sessionStorage.getItem('tokenKey');
            if (key) {
                $http.defaults.headers.common['Authorization'] = key;
                var info = Account.get({ action: "UserInfo" }, setInfo(data), errorInit(type));
            }
        }
                
        function setInfo(data) {
            _state.isLogged = true;
            _state.username = data.email;
        }
        
        function errorInit(type) {
            doLogout();
            if(type && type == 'form') {
                _form.msg = 'Failed get user info, try again';
                _form.error = true;
                _view.show();
            }
        }

                
        function setView(view) {
            _view = view
        }

        function showLogin() {
            _form.title = "Login";
            _form.btnText = "Login";
            _form.registred = true;
            _view.show();
        }

        function showRegister() {
            _form.title = "Register";
            _form.btnText = "Register";
            _form.registred = false;
            _view.show();
        };

        function doLogin() {
            var data = "grant_type=password&username=" + _form.email + "&password=" + _form.password;
            var config = {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
            $http.post(Config.get('api') + 'token', data, config).then(successLogin, failedLogin);
        }

        function successLogin(data) {
            _form.error = false;
            _form.msg = "";
            
            if (data.token_type && data.access_token) {
                _view.hide();
                if (data.userName) {
                    _state.username = data.userName;
                }
                sessionStorage.setItem('tokenKey', data.token_type + '  ' + data.access_token);
                init('form');
            } else {
                _form.error = true;
                var msg = 'Authorization failed';
            }
            
        }

        function failedLogin(data) {
             doLogout();
            _form.error = true;
            if (data.error_description) {
                _form.msg = data.error_description;
            } else {
                _form.msg = 'Password or email is incorrect';
            }
        }

        function doLogout() {
            _state.isLogged = false;
            _state.username = '';
            sessionStorage.removeItem('tokenKey');
            delete $http.defaults.headers.common['Authorization'];
        }
    };

})()