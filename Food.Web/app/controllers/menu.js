'use strict';

angular.module('app.menu', ['app.menuservice',])
.controller('MenuCtrl',['$scope', 'Menu','MenuItem', function ($scope, Menu,MenuItem) {
    $scope.title = "Loading menu ...";
    $scope.options = [];
    $scope.working = false;
	$scope.menu = {};
	$scope.menu.items = [];
	$scope.editeditem = {};
	$scope.backupitem = {};
	$scope.menuitem = {};
	
	$scope.showMenu = function(menu){
		var show = true;
		show &= !$scope.tomorrow||$scope.checkdate(menu.onDate);
		return show;
	}
	
	$scope.additem = function(item) {
	    item.id = null;
		$scope.menu.items.push(angular.copy(item));
	};
	
	$scope.edititem = function(item) {
		$scope.backupitem = angular.copy(item);
		$scope.editeditem =  item;
	};
	
	$scope.canceledit = function() {
		angular.copy($scope.backupitem,$scope.editeditem);
		$scope.editeditem = {};
	};
	
	$scope.saveitem = function() {
		var item = new MenuItem($scope.editeditem);
		if (item.id != null) {
			item.$update({id:item.id});
		}
		$scope.editeditem = {};
	};
	
	$scope.deleteitem = function(item) {
		//  remove item from base
		for (var i = 0; $scope.menu.items.length; i++) {
			
			if ($scope.menu.items[i] === item) {
				if (item.id > 0){
					MenuItem.delete({id:item.id});
				}
				$scope.menu.items.splice(i, 1);
				break; 
			}
		}
	};
	
	$scope.edited = function(item) {
		return $scope.editeditem === item;
	};
	
	$scope.add = function() {
		$scope.formTitle = "New menu";
	    $scope.menu = {};
	    $scope.menu.id = null;
		$scope.menu.items = [];
		$scope.menuitem = {}
		$scope.edit = true;
	};
	
	$scope.editMenu = function(menu) {
		$scope.add();
		$scope.formTitle = "Edit menu";
		$scope.menu = menu;
	};
	
	$scope.cancelMenu = function() {
	    $scope.edit = false;
	}
	
	$scope.saveMenu = function() {
		var success = function(menu){
			// returned id must by assign to menu
			if ($scope.menu.id == null ) {
				$scope.weekmenu.push(menu);	
			}
		}
		var failure = function(data){
			$scope.title = "Oops... something went wrong";
		};
		
	    var menu = new Menu($scope.menu);
	    if ($scope.menu.id == null) {
			menu.$save(success,failure);
		} else {
			menu.$update({id:$scope.menu.id},success,failure);
		}
			
	    $scope.edit = false;
	}

    $scope.Menu = function (components) {
        $scope.date = new Date();  
		$scope.tomorrow = false;
        $scope.working = true;
		$scope.edit = false;
		$scope.components = components;
		
		var success = function(data){
			$scope.working = false;
			$scope.title = "Week Menu";
			$scope.weekmenu = data;
		};
		var failure = function(data){
			$scope.title = "Oops... something went wrong";
			$scope.working = false;
		};
		Menu.query(success, failure);
    };
}]);