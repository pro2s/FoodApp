(function () {
    'use strict';
    angular
        .module('app')
        .factory('authservice', authService);

    authService.$inject = ['$http', 'Config', 'Account'];
    function authService($http, Config, Account) {
        var storage = localStorage; //sessionStorage;
        var _form = {
            title: "Login",
            btnText: "Login",
            registred: true,
            error: false,
            errors: {},
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            active: false,
        }

        var _state = {
            init: false,
            isLogged: false,
            roles:[],
            email:'',
            username: '',
            userinfo: {},
        };
        
        var _view = {
            show: function() {},
            hide: function () {},
            isError: function () {},
        }

        var _handlers = {};
        
        var service = {
            view: _view,
            form: _form,
            state: _state,
            init: init,
            isInit: isInit,
            registerEvent: registerEvent,
            authEvent: authEvent,
            authExternalProvider: authExternalProvider,
            authNTLM: authNTLM,
            checkAccess: checkAccess,
            checkRoles: checkRoles,
            setView: setView,
            clearForm: clearForm,
            showLogin: showLogin,
            showRegister: showRegister,
            doLogin: doLogin,
            doRegister: doRegister,
            doLogout: doLogout,
            reloadUserInfo: reloadUserInfo,
            authCompleted: authCompleted
        };

        return service;

        function getKey() {
            return storage.getItem('tokenKey');
        }

        function setKey(key) {
            storage.setItem('tokenKey', key);
        }

        function removeKey() {
            storage.removeItem('tokenKey');
        }

        function init() {
            var key = getKey();
            if (key) {
                $http.defaults.headers.common.Authorization = key;
                Account.get({ action: "UserInfo" }, successInit, failedInit);
            } else {
                _state.init = true;
            }
        }

        function isInit() {
            return _state.init;
        }

        function successInit(data) {
            if (typeof data != 'undefined') {
                _state.init = true;
                _state.isLogged = true;
                _state.username = data.userName;
                _state.email = data.email;
                _state.roles = data.roles;
                _state.userinfo = data;
                if (_form.active) {
                    _view.hide();
                }
                authEvent('UserLogged', _state);
            } else {
                _state.init = true;
                _state.isLogged = false;
                authEvent('UserNotLogged', _state);
            }

            
        }

        function failedInit() {
            _state.init = true;
            doLogout();
            if (_form.active) {
                _form.msg = 'error.auth.Info';
                _form.error = true;
            }
            authEvent('UserNotLogged', _state);
        }

        function reloadUserInfo() {
            Account.get({ action: "UserInfo" },
                function (data) {
                    _state.userinfo = data;
                },
                function () { 
                    // doLogout(); 
                });
        }

        function authEvent(eventName, objData) {
            if (_handlers[eventName]) {
                for (var i = 0; i < _handlers[eventName].length; i++) {
                    _handlers[eventName][i](objData);
                }
            }
        }

        function registerEvent(eventName, handler) {
            if (typeof _handlers[eventName] == 'undefined') {
                _handlers[eventName] = [];
            }
            _handlers[eventName].push(handler);
        }
        
        function checkAccess(access, roles) {
            var allow = true;
            if (access && access != 'isAnonymous') {
                if (access == 'isAuthenticated') {
                    allow = _state.isLogged;
                    if (roles && roles.length > 0 && allow) {
                        allow = checkRoles(roles);
                    } 
                }
            }
            return allow;
        }
        
        function checkRoles(roles) {
            var result = false;
            for (var i = 0; i < roles.length; i++) {
                if (_state.roles.indexOf(roles[i]) != -1) {
                    result = true;
                    break;
                };
            }
            return result;
        }
        
        function setView(view) {
            _view = view
        }

        function clearForm() {
            _form.error = false;
            _form.errors = {};
            _form.email = '';
            _form.username = '';
            _form.password = '';
            _form.confirmPassword = '';
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


        function successLogin(response) {
            var data = response.data
            _form.error = false;
            _form.msg = "";
            
            if (data.token_type && data.access_token) {
                if (data.userName) {
                    _state.username = data.userName;
                }
                setKey(data.token_type + '  ' + data.access_token)
                init();
            } else {
                _form.error = true;
                var msg = 'error.auth.Failed';
            }
            
        }

        function failedLogin(response) {
            var data = response.data
            doLogout();
            _form.error = true;
            if (data) {
                _form.msg = data.error_description;
            } else {
                _form.msg = 'error.auth.Password';
            }
        }


        function doRegister() {
            var data = {
                userName: _form.username,
                email: _form.email,
                password: _form.password,
                confirmPassword: _form.confirmPassword
            };
            var reg = new Account(data);
            reg.$save({ action: "Register" }, successRegister, failedRegister)
        }

        function successRegister() {
            console.log('Registred');
            _form.registred = true;
            doLogin();
        }

        function failedRegister(response) {
            var data = response.data
            _form.error = true;
            if (data) {
                _form.msg = data.message;
                _form.errors['userName'] = data.modelState['model.UserName'];
                _form.errors['email'] = data.modelState['model.Email'];
                _form.errors['password'] = data.modelState['model.Password'];
                _form.errors['confirmPassword'] = data.modelState['model.ConfirmPassword'];
            } else {
                _form.msg = 'error.auth.Registration';
            }
            _view.isError();
        }

        function doLogout() {
            _state.isLogged = false;
            _state.username = '';
            _state.roles = [];
            // TODO: send request only if set tokenKey
            var acc = new Account({});
            acc.$save({ action: "Logout" });

            removeKey();
            delete $http.defaults.headers.common['Authorization'];
            authEvent('UserLogout');
        }

        function authExternalProvider(provider) {
            var redirectUri = location.protocol + '//' + location.host + '/authcomplete.html';
            var externalProviderUrl = Config.get('api') + "api/Account/ExternalLogin?provider=" + provider
                                                        + "&response_type=token&client_id=self" 
                                                        + "&redirect_uri=" + redirectUri;
            window.$windowScope = service;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        function authNTLM() {
            var redirectUrl = Config.get('redirectUrl') + '/authcomplete.html';
            var externalProviderUrl = Config.get('api') + "api/Account/ntlmlogin?redirecturl=" + redirectUrl;
            window.$windowScope = service;
            var oauthWindow = window.open(externalProviderUrl, "Authenticate Account", "location=0,status=0,width=600,height=750");
        };

        function authCompleted(fragment) {
            
            var response = { data: fragment };
            successLogin(response);
        }
    };

})()