(function () {
    'use strict';
    angular
        .module('app')
        .directive('parseForm', parseForm);

    
    function parseForm() {
        
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                control: '='
            },
            templateUrl: 'app/views/parse.html',
            link: function (scope, element, attrs) {
                scope.id = 'ParseMenu';
                scope.internalControl = scope.control || {};
                scope.internalControl.show = show;
                scope.internalControl.hide = hide;
                scope.doParse = doParse;


                activate();

                function activate() {
                }


                function show() {
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }

                function doParse() {

                }
            }
        };
        return directive;

    };

})();
