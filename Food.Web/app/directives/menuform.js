(function () {
    'use strict';
    angular
        .module('app')
        .directive('menuForm', menuForm);

    
    function menuForm() {
        
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                menu: '=',
                title: '=',
                save: '&',
                cancel: '&',
            },
            templateUrl: 'app/views/menuform.html',
            link: function (scope, element, attrs) {
                scope.editeditem = {};
                scope.backupitem = {};
                scope.menuitem = {};
                scope.addItem = addItem;
                scope.editItem = editItem;
                scope.cancelItem = cancelItem;
                scope.saveItem = saveItem;
                scope.deleteItem = deleteItem;
                scope.edited = edited;


                activate();

                function activate() {
                }


                function addItem(item) {
                    item.id = 0;
                    scope.menu.items.push(angular.copy(item));
                };
                
                function editItem(item) {
                    scope.backupitem = angular.copy(item);
                    scope.editeditem =  item;
                };
                
                function cancelItem() {
                    angular.copy(scope.backupitem,scope.editeditem);
                    scope.editeditem = {};
                };
                
                function saveItem () {
                    scope.editeditem = {};
                };
                
                function deleteItem(item) {
                    for (var i = 0; scope.menu.items.length; i++) {
                        if (scope.menu.items[i] === item) {
                            scope.menu.items.splice(i, 1);
                            break; 
                        }
                    }
                };
                
                function edited(item) {
                    return scope.editeditem === item;
                };
                
            }
        };
        return directive;

    };

})();
