(function() {
    'use strict';
    angular
        .module('app.menu')
        .controller('ViewMenu', ViewMenu)
    
    ViewMenu.$inject = ['GlobalMenu','Menu','ItemRating','dateservice'];    
    
    function ViewMenu(GlobalMenu, Menu, ItemRating, dateservice) {
        var vm = this;
        vm.title = "Loading menu ...";
        vm.weekmenu = [];
        vm.tomorrow = false;
        vm.components = false;
        vm.isshow = isShow;
        vm.isold = dateservice.check;
        vm.getMenuRating = getMenuRating;
        vm.setRating = setRating;
        
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
        
        function getMenuRating(menu) {
            var rating = 0;
            var count = 0;
            angular.forEach(menu.items, function(item) {
                var rate = item.ratings[0].rate;
                if (rate) {
                    rating += rate;
                    count++;
                }
            });
            if (count > 0) {
                rating = rating / count;
            }
            return rating;
        }

        function setRating(rating) {
            var ir = new ItemRating(rating);
            if (rating.id == 0) {
                ir.$save();
            } else {
                ir.$update({ id: rating.id })
            }
        }
    };

})();    
