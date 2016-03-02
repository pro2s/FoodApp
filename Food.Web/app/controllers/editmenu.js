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
        form.menu.items = [];
        form.editeditem = {};
        form.backupitem = {};
        form.menuitem = {};
        form.isedit = false;
        form.parse = {};

        form.additem = addItem;
        form.edititem = editItem;
        form.cancelitem = cancelItem;
        form.saveitem = saveItem;
        form.deleteItem = deleteItem;
        form.edited = edited;
        
        form.add = add;
        form.edit = edit;
        form.cancel = cancel;
        form.save = save;
        
        
        
        

        function addItem(item) {
            item.id = 0;
            form.menu.items.push(angular.copy(item));
        };
        
        function editItem(item) {
            form.backupitem = angular.copy(item);
            form.editeditem =  item;
        };
        
        function cancelItem() {
            angular.copy(form.backupitem,form.editeditem);
            form.editeditem = {};
        };
        
        function saveItem () {
            var item = new MenuItem(form.editeditem);
            if (item.id != 0) {
                item.$update({id:item.id});
            }
            form.editeditem = {};
        };
        
        function deleteItem(item) {
            for (var i = 0; form.menu.items.length; i++) {
                if (form.menu.items[i] === item) {
                    if (item.id > 0){
                        MenuItem.delete({id:item.id});
                    }
                    form.menu.items.splice(i, 1);
                    break; 
                }
            }
        };
        
        function edited(item) {
            return form.editeditem === item;
        };
        
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
            form.menu = menu;
        };
        
        function cancel() {
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