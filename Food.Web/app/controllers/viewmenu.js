(function() {
    'use strict';
    angular
        .module('app.menu')
        .controller('ViewMenu', ViewMenu)
    
    ViewMenu.$inject = ['GlobalMenu','Menu','dateservice'];    
    
    function ViewMenu(GlobalMenu, Menu, dateservice) {
        var vm = this;
        vm.title = "Loading menu ...";
        vm.weekmenu = [];
        vm.tomorrow = false;
        vm.components = false;
        vm.isshow = isShow;
        vm.isold = dateservice.check;
        
        
        activate();
            
        function activate() {
            
            Menu.query(success, failure);    
            
            function success(data) {

                vm.title = "Week Menu";
                GlobalMenu.setMenu(data);
                vm.weekmenu = GlobalMenu.getMenu();
            };
            
            function failure(data) {
                vm.title = "Oops... something went wrong";

            };
        }
        
        function isShow(menu) {
            return !vm.tomorrow || dateservice.check(menu.onDate);
        }
        
        
    };

})();    
