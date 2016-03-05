(function () {
    'use strict';
    angular
        .module('app')
        .directive('commentsForm', commentsForm);

    commentsForm.$inject = ['ItemComments'];
    function commentsForm(ItemComments) {
        
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
                scope.form = { text: '' };
                scope.internalControl = {}
                
                scope.sendComment = sendComment;
                scope.refreshComments = refreshComments;

                activate();

                function activate() {
                    scope.internalControl = scope.control || {};
                    scope.internalControl.rating = {};
                    scope.internalControl.show = show;
                    scope.internalControl.hide = hide;
                }

                function refreshComments() {
                    ItemComments.query({ itemId: scope.item.id }, function (data) {
                        scope.comments = data;
                    }, function () {
                        scope.comments = [{ userName: 'System', text: 'Get comments error.' }];
                    });
                }


                function show(item) {
                    scope.comments = []; // Get Item comments
                    scope.form = { text: '' };
                    scope.item = item;
                    scope.internalControl.rating = item.ratings[1];
                    refreshComments();
                    $('#' + scope.id).modal('show');
                }

                function hide() {
                    $('#' + scope.id).modal('hide');
                }

                function sendComment() {
                    var ic = new ItemComments({ itemId: scope.item.id, text: scope.form.text });
                    ic.$save(function (data) {
                        scope.comments.push(data);
                    }, function () {
                        scope.comments = [{ userName: 'System', text: 'Send comments error.' }];
                    });
                }
            }
        };
        return directive;

    };

})();
