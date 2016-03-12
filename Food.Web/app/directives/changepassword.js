(function () {
    'use strict';
    angular
        .module('app')
        .directive('changePassword', changePassword);

    changePassword.$inject = ['Account', '$timeout'];
    function changePassword(Account, $timeout) {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                control: '='
            },
            templateUrl: 'app/views/changepassword.html',
            link: function (scope, element, attrs) {
                scope.id = 'changepassword';
                scope.error = false;
                scope.message = '';
                scope.input = {};
                

                scope.internalControl = scope.control || {};
                scope.internalControl.show = show;
                scope.internalControl.hide = hide;

                scope.change = change;
                

                activate();

                function activate() {
                }

                function show() {
                    scope.input = { oldPassword: '', newPassword: '', confirmPassword: '' }
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }

                function change() {
                    scope.message = 'Change password ...';
                    Account.save({ action: 'ChangePassword' }, scope.input, function (data) {
                        scope.message = "Password changed.";
                        scope.error = false;
                        $timeout(hide, 2000);
                    }, function () {
                        scope.error = true;
                        scope.message = 'Change password error';
                    })
                }
            }
        };
        return directive;

    };

})();
