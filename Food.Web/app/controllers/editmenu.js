(function() {
    'use strict';
    angular
        .module('app.menu')
        .controller('EditMenu', EditMenu);
    
    EditMenu.$inject = ['GlobalMenu','Menu','MenuItem','dateservice'];    
    
    function EditMenu(GlobalMenu, Menu, MenuItem, dateservice) {
        var form = this;
        form.title = "New Menu";
        form.menu = {};
        form.backupmenu = {};
        form.parse = {};

        form.add = add;
        form.edit = edit;
        form.cancel = cancel;
        form.save = save;
        
        function add() {
            form.title = "New menu";
            form.menu = {};
            form.menu.id = 0;
            form.menu.items = [];
            form.menuitem = {}
            form.isedit = true;
        };
        
        function edit(menu) {
            form.add();
            form.title = "Edit menu";
            form.backupmenu = angular.copy(menu);
            form.menu = menu;
        };
        
        function cancel() {
            angular.copy(form.backupmenu,form.menu);
            form.isedit = false;
        }
        
        function save() {
            var menu = new Menu(form.menu);
            if (form.menu.id == 0) {
                menu.$save(success,failure);
            } else {
                menu.$update({id:form.menu.id},success,failure);
            }

            function success(menu){
                // returned id must by assign to menu
                if (form.menu.id == 0 ) {
                    GlobalMenu.addMenu(menu);
                    // Need access to ViewMenu controller
                }
                form.isedit = false;
            }
            
            function failure(data){
                form.title = "Oops... something went wrong";
            };
        }

    };

})();   