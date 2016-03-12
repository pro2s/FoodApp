(function () {
    'use strict';
    angular
        .module('app')
        .directive('commentsForm', commentsForm);

    commentsForm.$inject = ['ItemComments', 'Pagination'];
    function commentsForm(ItemComments, Pagination) {
        
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
                var paginationId = 'userComments';

                scope.id = 'commentsModal';
                scope.item = {};
                scope.comments = [];
                scope.form = { text: '' };
                scope.internalControl = {}
                scope.pages = {}

                scope.pageChanged = pageChanged;
                scope.sendComment = sendComment;
                scope.refreshComments = refreshComments;

                activate();

                function activate() {
                    scope.pages = Pagination.addPagination(paginationId, 5);
                    scope.internalControl = scope.control || {};
                    scope.internalControl.rating = {};
                    scope.internalControl.show = show;
                    scope.internalControl.hide = hide;
                }

               
                function pageChanged(){
                    refreshComments();
                }

              
                function refreshComments() {
                    ItemComments.query({ itemId: scope.item.id, pagination:paginationId }, function (data, getHeaders) {
                        scope.comments = data;
                    }, function () {
                        scope.comments = [{ userName: 'System', text: 'Get comments error.' }];
                    });
                }


                function show(item) {
                    scope.comments = [];
                    scope.totalItems = 0;
                    scope.currentPage = 1;
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
                    var comment = { itemId: scope.item.id, text: scope.form.text };
                    ItemComments.save({}, comment, function (data) {
                        refreshComments();
                        scope.form.text = '';
                    }, function (response) {
                        var msg = 'Send comment error';
                        if (response.data.message) {
                            msg = response.data.message;
                        }
                        scope.comments = [{ userName: 'System', text: msg }];
                    });
                }
            }
        };
        return directive;

    };

})();
