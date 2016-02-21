(function() {
    'use strict';
    angular
        .module('app.menu')
        .controller('ViewMenu', ViewMenu)
    
    ViewMenu.$inject = ['GlobalMenu','ItemRating','dateservice'];    
    
    function ViewMenu(GlobalMenu, ItemRating, dateservice) {
        var vm = this;
        vm.title = "Week Menu";
        vm.data = {};
        vm.tomorrow = false;
        vm.components = false;
        vm.isshow = isShow;
        vm.isold = dateservice.check;
        vm.getMenuRating = getMenuRating;
        vm.setRating = setRating;
        
        activate();
            
        function activate() {
            vm.data = GlobalMenu.data;
        }
        
        function isShow(menu) {
            return !vm.tomorrow || dateservice.check(menu.onDate);
        }
        
        function getMenuRating(menu) {
            var rating = 0;
            var count = 0;
            angular.forEach(menu.items, function(item) {
                if (item.ratings != undefined) {
                    var rate = item.ratings[0].rate;
                    if (rate) {
                        rating += rate;
                        count++;
                    }
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

        function updateRatings(rating) {
            angular.forEach(vm.data.menu, function (menu) {
                angular.forEach(menu.items, function (item) {
                    if (item.id == rating.itemId && item.ratings[1].rate != rating.rate) {
                        item.ratings[1].rate != rating.rate;
                    }
                });
            });
        }
    };

})();    
