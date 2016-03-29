(function() {
    'use strict';
    angular
        .module('app')
        .controller('TopMenu', TopMenu);

    TopMenu.$inject = ['$rootScope', '$location', '$route', 'User', 'authservice','$translate','moment'];    
    
    function TopMenu($rootScope, $location, $route, User, authservice,$translate,moment) {
        var topmenu = this;
        topmenu.menu = [];
        topmenu.users = {};
        topmenu.auth = {};
        topmenu.languages = [];
        topmenu.language = "en"
        
        topmenu.changeLanguage = changeLanguage;
        topmenu.isAuth = isAuth;
        topmenu.isActive = isActive;
        topmenu.showLogin = showLogin;
        topmenu.showRegister = showRegister;
        topmenu.logout = logout;
        
        activate();
        
        function activate() {
            
            $translate.onReady(function() {
                topmenu.languages = $translate.getAvailableLanguageKeys(); 
                topmenu.language = $translate.proposedLanguage()
            });
            
            topmenu.auth = authservice.state;
            updateMenu();
            authservice.registerEvent('UserLogged', updateMenu)
            authservice.registerEvent('UserLogout', updateMenu)
        }
         
        
        function updateMenu() {
            topmenu.menu = getMenu();
        }
        
        function getMenu() {
            var menu = [];
            angular.forEach($route.routes,function (config,route) {
                if (config.menuname) {
                    if (authservice.checkAccess(config.access, config.roles)) {
                        menu.push({url:route, name:config.menuname});
                    }
                }
            });
            return menu;
        }
        
        function changeLanguage(langKey) {
            $translate.use(langKey);
            topmenu.language = $translate.proposedLanguage();
            moment.locale(topmenu.language);
            
        };
        
        function showLogin() {
            authservice.showLogin();
        }

        function showRegister() {
            authservice.showRegister();
        }

        function logout() {
            authservice.doLogout();
            $location.path('/');
        }

        function isActive(viewLocation) {
            return viewLocation === $location.path();
        };

        function isAuth()
        {
            return topmenu.auth.isLogged;
        }
    }

})();    