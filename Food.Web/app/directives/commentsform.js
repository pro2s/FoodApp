(function () {
    'use strict';
    angular
        .module('app')
        .directive('commentsForm', commentsForm);

    
    function commentsForm() {
        
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                control: '=',
                setRating: '&',
                readonly: '='
            },
            templateUrl: 'app/views/comments.html',
            link: function (scope, element, attrs) {
                scope.id = 'commentsModal';
                scope.item = {};
                scope.comments = [];
                scope.text = '';
                
                
                scope.internalControl = scope.control || {};
                scope.internalControl.show = show;
                scope.internalControl.hide = hide;
                scope.sendComment = sendComment;


                activate();

                function activate() {
                }


                function show(item) {
                    scope.comments = []; // Get Item comments
                    scope.text = '';
                    scope.item = item;
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }

                function sendComment() {
                    scope.comments.push({date: new Date(),text:scope.text});
                }
            }
        };
        return directive;

    };

})();
