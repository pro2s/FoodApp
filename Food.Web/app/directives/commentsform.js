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
                scope.perPage = 5;
                scope.currentPage = 1;
                scope.totalItems = 0;
                
                scope.pageChanged = pageChanged;
                scope.sendComment = sendComment;
                scope.refreshComments = refreshComments;

                activate();

                function activate() {
                    scope.internalControl = scope.control || {};
                    scope.internalControl.rating = {};
                    scope.internalControl.show = show;
                    scope.internalControl.hide = hide;
                }

                function parseRange(hdr) {
                    var m = hdr && hdr.match(/^(?:\S+ )?(\d+)-(\d+)\/(\d+|\*)$/);
                    if (m) {
                        return {
                            from: +m[1],
                            to: +m[2],
                            total: m[3] === '*' ? Infinity : +m[3]
                        };
                    } else if (hdr === '*/0') {
                        return { total: 0 };
                    }
                    return null;
                }

                function pageChanged(){
                    refreshComments();
                }

                function parseHeaders(headers) {
                    var range = parseRange(headers['content-range']);
                    if (range) {
                        scope.totalItems = range.total;
                        scope.currentPage = Math.ceil(range.from / scope.perPage) + 1;
                    } else {
                        scope.totalItems = scope.comments.length;
                        scope.currentPage = 1;
                    }
                }

                function refreshComments() {
                    var config = { headers: {} };
                    var from = (scope.currentPage - 1) * scope.perPage;
                    var to = from + scope.perPage - 1;
                    config.headers['Range'] = 'x-entity=' + from + '-' + to;

                    ItemComments(config).query({ itemId: scope.item.id }, function (data, getHeaders) {
                        scope.comments = data;
                        parseHeaders(getHeaders());
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
                    var config = {};
                    var comment = { itemId: scope.item.id, text: scope.form.text };
                    ItemComments(config).save({}, comment, function (data) {
                        refreshComments();
                        scope.form.text = '';
                    }, function () {
                        scope.comments = [{ userName: 'System', text: 'Send comments error.' }];
                    });
                }
            }
        };
        return directive;

    };

})();
