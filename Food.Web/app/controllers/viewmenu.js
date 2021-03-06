﻿(function() {
    'use strict';
    angular
        .module('app.menu')
        .controller('ViewMenu', ViewMenu)
    
    ViewMenu.$inject = ['GlobalMenu','ItemRating','dateservice'];    
    
    function ViewMenu(GlobalMenu, ItemRating, dateservice) {
        var vm = this;
        vm.title = "WeekMenu";
        vm.data = {};
        vm.comments = {item:{}, data:[], text:''};
        vm.tomorrow = false;
        vm.components = false;

        vm.comments = {};
        
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
        
        //  TODO: get old value to return on save/update error 
        function setRating(rating) {
            var ir = new ItemRating(rating);
            if (rating.id == 0) {
                ir.$save()
                    .then(function(data){
                        rating.id = data.id;
                        updateRatings(rating);
                    })
                    .catch(function (error) {
                        rating.rate = 0;
                    });
            } else {
                ir.$update({ id: rating.id })
            }
        }

        function updateRatings(rating) {
            angular.forEach(vm.data.menu, function (menu) {
                angular.forEach(menu.items, function (item) {
                    if (item.id == rating.itemId && item.ratings[1].rate != rating.rate) {
                        item.ratings[1].rate = rating.rate;
                    }
                });
            });
        }
        
        
    };

})();    
